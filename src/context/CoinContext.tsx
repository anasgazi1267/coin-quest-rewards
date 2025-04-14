
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type TaskType = {
  id: string;
  title: string;
  description: string;
  coinsReward: number;
  type: "youtube" | "telegram" | "ad" | "referral" | "custom" | "daily";
  completed: boolean;
  link?: string;
  durationInSeconds?: number;
  verificationRequired?: boolean;
};

type AdType = {
  id: string;
  content: string;
  durationInSeconds: number;
  coinsReward: number;
};

type RewardType = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  coinsCost: number;
  type: "amazon" | "googleplay" | "freefire" | "pubg" | "visa";
  stock: number;
};

type WithdrawalRequestType = {
  id: string;
  userId: string;
  rewardId: string;
  coinsCost: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  gameUsername?: string;
  gameId?: string;
};

type UserType = {
  id: string;
  username: string;
  email: string;
  coins: number;
  referralCode: string;
  referrals: number;
  completedTasks: string[];
  watchedAds: { adId: string; lastWatched: string }[];
  isAdmin: boolean;
  dailyRewardClaimed?: boolean;
  dailyRewardLastClaimed?: string;
};

interface CoinContextType {
  currentUser: UserType | null;
  tasks: TaskType[];
  ads: AdType[];
  rewards: RewardType[];
  withdrawalRequests: WithdrawalRequestType[];
  referralReward: number;
  minWithdrawalCoins: number;
  coins: number;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  completeTask: (taskId: string) => void;
  watchAd: (adId: string) => Promise<void>;
  requestWithdrawal: (rewardId: string, gameUsername?: string, gameId?: string) => Promise<boolean>;
  useReferralCode: (code: string) => void;
  isAdWatching: boolean;
  currentAdId: string | null;
  adTimeRemaining: number;
  bannerAd: string;
  topBannerAd: string;
  updateTask: (taskId: string, updatedTask: Partial<TaskType>) => void;
  updateAd: (adId: string, updatedAd: Partial<AdType>) => void;
  updateReward: (rewardId: string, updatedReward: Partial<RewardType>) => void;
  addTask: (task: Omit<TaskType, "id" | "completed">) => void;
  addAd: (ad: Omit<AdType, "id">) => void;
  addReward: (reward: Omit<RewardType, "id">) => void;
  removeTask: (taskId: string) => void;
  removeAd: (adId: string) => void;
  removeReward: (rewardId: string) => void;
  updateWithdrawalRequestStatus: (requestId: string, status: "pending" | "approved" | "rejected") => void;
  claimCoins: (amount: number) => void;
  claimDailyReward: () => void;
  canClaimDailyReward: boolean;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

// Mock data for demonstration
const MOCK_TASKS: TaskType[] = [
  {
    id: "task1",
    title: "Subscribe to YouTube Channel",
    description: "Subscribe to our YouTube channel for exclusive content",
    coinsReward: 50,
    type: "youtube",
    completed: false,
    link: "https://youtube.com/channel/example",
    verificationRequired: true,
  },
  {
    id: "task2",
    title: "Join Telegram Group",
    description: "Join our Telegram group for updates and community discussions",
    coinsReward: 30,
    type: "telegram",
    completed: false,
    link: "https://t.me/example",
    verificationRequired: true,
  },
  {
    id: "task3",
    title: "Daily Reward",
    description: "Claim your daily reward to earn coins",
    coinsReward: 25,
    type: "daily",
    completed: false,
  },
  {
    id: "task4",
    title: "Invite Friends",
    description: "Invite 5 friends to earn bonus coins and unlock withdrawals",
    coinsReward: 500,
    type: "referral",
    completed: false,
  },
];

const MOCK_ADS: AdType[] = [
  {
    id: "ad1",
    content: "<div class='p-4 bg-blue-100 rounded-lg text-center'>This is a sample ad for a cool product you might like!</div>",
    durationInSeconds: 15,
    coinsReward: 5,
  },
  {
    id: "ad2",
    content: "<div class='p-4 bg-green-100 rounded-lg text-center'>Check out our new service - limited time offer!</div>",
    durationInSeconds: 25,
    coinsReward: 15,
  },
  {
    id: "ad3",
    content: "<div class='p-4 bg-purple-100 rounded-lg text-center'>Special discount available only today!</div>",
    durationInSeconds: 35,
    coinsReward: 25,
  },
  {
    id: "ad4",
    content: "<div class='p-4 bg-yellow-100 rounded-lg text-center'>Premium membership with exclusive benefits - learn more!</div>",
    durationInSeconds: 50,
    coinsReward: 40,
  },
];

const MOCK_REWARDS: RewardType[] = [
  {
    id: "reward1",
    title: "Amazon Gift Card $10",
    description: "Redeem for a $10 Amazon Gift Card",
    imageUrl: "/placeholder.svg",
    coinsCost: 5000,
    type: "amazon",
    stock: 10,
  },
  {
    id: "reward2",
    title: "Google Play Gift Card $5",
    description: "Redeem for a $5 Google Play Gift Card",
    imageUrl: "/placeholder.svg",
    coinsCost: 2500,
    type: "googleplay",
    stock: 15,
  },
  {
    id: "reward3",
    title: "Free Fire 100 Diamonds",
    description: "Get 100 Free Fire Diamonds",
    imageUrl: "/placeholder.svg",
    coinsCost: 1500,
    type: "freefire",
    stock: 20,
  },
  {
    id: "reward4",
    title: "PUBG 60 UC",
    description: "Get 60 PUBG UC",
    imageUrl: "/placeholder.svg",
    coinsCost: 1200,
    type: "pubg",
    stock: 25,
  },
  {
    id: "reward5",
    title: "Visa Virtual Card $5",
    description: "Get a $5 Visa Virtual Card",
    imageUrl: "/placeholder.svg",
    coinsCost: 3000,
    type: "visa",
    stock: 5,
  },
];

// Determine if a user is an admin by checking their username and password
const isAdminUser = (email: string, password: string) => {
  return email === "anasgazi1" && password === "Anas1999@";
};

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>(MOCK_TASKS);
  const [ads, setAds] = useState<AdType[]>(MOCK_ADS);
  const [rewards, setRewards] = useState<RewardType[]>(MOCK_REWARDS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequestType[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [referralReward, setReferralReward] = useState(50);
  const [minWithdrawalCoins, setMinWithdrawalCoins] = useState(1000);
  const [isAdWatching, setIsAdWatching] = useState(false);
  const [currentAdId, setCurrentAdId] = useState<string | null>(null);
  const [adTimeRemaining, setAdTimeRemaining] = useState(0);
  const [bannerAd, setBannerAd] = useState("<div class='p-2 bg-blue-50 text-center'>Banner Ad Space Available</div>");
  const [topBannerAd, setTopBannerAd] = useState("<div class='p-1 bg-gray-50 text-xs text-center'>Top Banner Ad (468x60)</div>");
  const [canClaimDailyReward, setCanClaimDailyReward] = useState(false);

  // Local storage management
  useEffect(() => {
    // Load tasks, ads, rewards and other settings from localStorage
    const storedTasks = localStorage.getItem("coinQuestTasks");
    const storedAds = localStorage.getItem("coinQuestAds");
    const storedRewards = localStorage.getItem("coinQuestRewards");
    const storedWithdrawalRequests = localStorage.getItem("coinQuestWithdrawalRequests");
    const storedUser = localStorage.getItem("coinQuestUser");
    const storedReferralReward = localStorage.getItem("coinQuestReferralReward");
    const storedMinWithdrawalCoins = localStorage.getItem("coinQuestMinWithdrawalCoins");
    
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedAds) setAds(JSON.parse(storedAds));
    if (storedRewards) setRewards(JSON.parse(storedRewards));
    if (storedWithdrawalRequests) setWithdrawalRequests(JSON.parse(storedWithdrawalRequests));
    if (storedReferralReward) setReferralReward(JSON.parse(storedReferralReward));
    if (storedMinWithdrawalCoins) setMinWithdrawalCoins(JSON.parse(storedMinWithdrawalCoins));
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setIsAuthenticated(true);
      
      // Check if daily reward is claimable
      checkDailyRewardEligibility(parsedUser);
    }
  }, []);

  // Check if user is eligible for daily reward
  const checkDailyRewardEligibility = (user: UserType) => {
    if (!user.dailyRewardLastClaimed) {
      setCanClaimDailyReward(true);
      return;
    }
    
    const lastClaimed = new Date(user.dailyRewardLastClaimed);
    const now = new Date();
    const isNewDay = lastClaimed.getDate() !== now.getDate() || 
                     lastClaimed.getMonth() !== now.getMonth() ||
                     lastClaimed.getFullYear() !== now.getFullYear();
                     
    setCanClaimDailyReward(isNewDay);
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("coinQuestTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("coinQuestAds", JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem("coinQuestRewards", JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem("coinQuestWithdrawalRequests", JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem("coinQuestReferralReward", JSON.stringify(referralReward));
  }, [referralReward]);

  useEffect(() => {
    localStorage.setItem("coinQuestMinWithdrawalCoins", JSON.stringify(minWithdrawalCoins));
  }, [minWithdrawalCoins]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("coinQuestUser", JSON.stringify(currentUser));
      checkDailyRewardEligibility(currentUser);
    }
  }, [currentUser]);

  // Ad timer effect
  useEffect(() => {
    let timer: number | undefined;
    
    if (isAdWatching && adTimeRemaining > 0) {
      timer = window.setInterval(() => {
        setAdTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (adTimeRemaining === 0 && isAdWatching && currentAdId) {
      // Ad completed but waiting for manual claim
      setIsAdWatching(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAdWatching, adTimeRemaining, currentAdId]);

  const login = async (email: string, password: string) => {
    try {
      const isAdmin = isAdminUser(email, password);
      
      // Load existing users from localStorage or create new mock user
      const existingUsers = localStorage.getItem("coinQuestUsers");
      let users = existingUsers ? JSON.parse(existingUsers) : [];
      let user = users.find((u: UserType) => u.email === email);
      
      if (!user) {
        if (isAdmin) {
          // Create admin user
          user = {
            id: "admin1",
            username: "Admin",
            email: email,
            coins: 9999,
            referralCode: "ADMIN123",
            referrals: 0,
            completedTasks: [],
            watchedAds: [],
            isAdmin: true
          };
        } else {
          // Create regular user
          user = {
            id: `user${Date.now()}`,
            username: email.split('@')[0],
            email: email,
            coins: 100,
            referralCode: `USER${Math.floor(Math.random() * 10000)}`,
            referrals: 0,
            completedTasks: [],
            watchedAds: [],
            isAdmin: false
          };
        }
        
        users.push(user);
        localStorage.setItem("coinQuestUsers", JSON.stringify(users));
      }
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("coinQuestUser", JSON.stringify(user));
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("coinQuestUser");
    toast.info("You have been logged out");
  };

  const registerUser = async (username: string, email: string, password: string) => {
    try {
      // Load existing users
      const existingUsers = localStorage.getItem("coinQuestUsers");
      let users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if user already exists
      if (users.some((u: UserType) => u.email === email)) {
        toast.error("User with this email already exists");
        throw new Error("User already exists");
      }
      
      const newUser: UserType = {
        id: `user${Date.now()}`,
        username,
        email,
        coins: 10, // Starting coins
        referralCode: `${username.toUpperCase()}${Math.floor(Math.random() * 1000)}`,
        referrals: 0,
        completedTasks: [],
        watchedAds: [],
        isAdmin: false
      };
      
      // Add user to users array
      users.push(newUser);
      localStorage.setItem("coinQuestUsers", JSON.stringify(users));
      
      // Set as current user
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("coinQuestUser", JSON.stringify(newUser));
      toast.success("Registration successful! You received 10 welcome coins.");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw new Error("Registration failed");
    }
  };

  const completeTask = (taskId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to complete tasks");
      return;
    }

    // Find the task
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      toast.error("Task not found");
      return;
    }

    // Check if already completed
    if (currentUser.completedTasks.includes(taskId)) {
      toast.error("You have already completed this task");
      return;
    }

    // Update tasks
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    );
    setTasks(updatedTasks);

    // Update user
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + task.coinsReward,
      completedTasks: [...currentUser.completedTasks, taskId]
    };
    setCurrentUser(updatedUser);
    
    // Update in users array
    updateUserInStorage(updatedUser);
    
    toast.success(`Task completed! You earned ${task.coinsReward} coins`);
  };

  const watchAd = async (adId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to watch ads");
      return Promise.reject("Not authenticated");
    }

    // Find the ad
    const ad = ads.find(a => a.id === adId);
    if (!ad) {
      toast.error("Ad not found");
      return Promise.reject("Ad not found");
    }

    // Start watching ad
    setIsAdWatching(true);
    setCurrentAdId(adId);
    setAdTimeRemaining(ad.durationInSeconds);
    
    return Promise.resolve();
  };

  // New function to claim coins after watching ad
  const claimCoins = (amount: number) => {
    if (!currentUser) {
      toast.error("You must be logged in to claim coins");
      return;
    }
    
    if (!currentAdId) {
      toast.error("No ad to claim from");
      return;
    }
    
    // Record that the user watched the ad
    const now = new Date().toISOString();
    const updatedWatchedAds = [
      ...currentUser.watchedAds, 
      { adId: currentAdId, lastWatched: now }
    ];
    
    // Update user with coins and watched ad
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + amount,
      watchedAds: updatedWatchedAds
    };
    
    setCurrentUser(updatedUser);
    setCurrentAdId(null);
    
    // Update in users array
    updateUserInStorage(updatedUser);
    
    toast.success(`You earned ${amount} coins!`);
  };

  // New function to claim daily reward
  const claimDailyReward = () => {
    if (!currentUser) {
      toast.error("You must be logged in to claim daily reward");
      return;
    }
    
    if (!canClaimDailyReward) {
      toast.error("You've already claimed your daily reward today");
      return;
    }
    
    // Find daily reward task
    const dailyTask = tasks.find(t => t.type === "daily");
    if (!dailyTask) {
      toast.error("Daily reward task not found");
      return;
    }
    
    // Update user
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + dailyTask.coinsReward,
      dailyRewardLastClaimed: new Date().toISOString(),
      dailyRewardClaimed: true
    };
    
    setCurrentUser(updatedUser);
    setCanClaimDailyReward(false);
    
    // Update in users array
    updateUserInStorage(updatedUser);
    
    toast.success(`Daily reward claimed! You earned ${dailyTask.coinsReward} coins.`);
  };

  // Helper function to update user in storage
  const updateUserInStorage = (updatedUser: UserType) => {
    // Update current user in localStorage
    localStorage.setItem("coinQuestUser", JSON.stringify(updatedUser));
    
    // Update user in users array
    const existingUsers = localStorage.getItem("coinQuestUsers");
    if (existingUsers) {
      let users = JSON.parse(existingUsers);
      users = users.map((u: UserType) => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem("coinQuestUsers", JSON.stringify(users));
    }
  };

  const requestWithdrawal = async (rewardId: string, gameUsername?: string, gameId?: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to request withdrawals");
      return false;
    }

    // Find the reward
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      toast.error("Reward not found");
      return false;
    }

    // Check if user has enough coins
    if (currentUser.coins < reward.coinsCost) {
      toast.error(`You need ${reward.coinsCost} coins for this reward. You have ${currentUser.coins} coins.`);
      return false;
    }

    // Check minimum withdrawal requirement
    if (currentUser.coins < minWithdrawalCoins) {
      toast.error(`You need at least ${minWithdrawalCoins} coins to request a withdrawal`);
      return false;
    }

    // Check if user has enough referrals (5 required)
    if (currentUser.referrals < 5) {
      toast.error(`You need at least 5 referrals to request a withdrawal. You have ${currentUser.referrals} referrals.`);
      return false;
    }

    // Check if game credentials are provided for game rewards
    if ((reward.type === "freefire" || reward.type === "pubg") && (!gameUsername || !gameId)) {
      toast.error(`Please provide your ${reward.type === "freefire" ? "Free Fire" : "PUBG"} username and ID`);
      return false;
    }

    // Create withdrawal request
    const newRequest: WithdrawalRequestType = {
      id: `request${Date.now()}`,
      userId: currentUser.id,
      rewardId: reward.id,
      coinsCost: reward.coinsCost,
      status: "pending",
      createdAt: new Date().toISOString(),
      gameUsername,
      gameId
    };

    setWithdrawalRequests([...withdrawalRequests, newRequest]);

    // Deduct coins from user
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins - reward.coinsCost
    };
    setCurrentUser(updatedUser);
    
    // Update in users array
    updateUserInStorage(updatedUser);

    toast.success("Withdrawal request submitted! It will be processed soon.");
    return true;
  };

  const useReferralCode = (code: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to use referral codes");
      return;
    }

    // Load existing users
    const existingUsers = localStorage.getItem("coinQuestUsers");
    if (!existingUsers) {
      toast.error("Failed to process referral code");
      return;
    }
    
    const users = JSON.parse(existingUsers);
    
    // Find referring user
    const referrer = users.find((u: UserType) => u.referralCode === code);
    if (!referrer) {
      toast.error("Invalid referral code");
      return;
    }
    
    if (referrer.id === currentUser.id) {
      toast.error("You cannot use your own referral code");
      return;
    }
    
    // Update current user
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + referralReward,
    };
    setCurrentUser(updatedUser);
    
    // Update referrer
    const updatedReferrer = {
      ...referrer,
      referrals: referrer.referrals + 1,
      coins: referrer.coins + referralReward
    };
    
    // Update both users in storage
    const updatedUsers = users.map((u: UserType) => {
      if (u.id === currentUser.id) return updatedUser;
      if (u.id === referrer.id) return updatedReferrer;
      return u;
    });
    
    localStorage.setItem("coinQuestUsers", JSON.stringify(updatedUsers));
    localStorage.setItem("coinQuestUser", JSON.stringify(updatedUser));
    
    toast.success(`Referral code ${code} applied! You earned ${referralReward} bonus coins.`);
  };

  // Admin functions to update the app data
  const updateTask = (taskId: string, updatedTask: Partial<TaskType>) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can update tasks");
      return;
    }

    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    toast.success("Task updated successfully");
  };

  const updateAd = (adId: string, updatedAd: Partial<AdType>) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can update ads");
      return;
    }

    const updatedAds = ads.map(ad => 
      ad.id === adId ? { ...ad, ...updatedAd } : ad
    );
    setAds(updatedAds);
    toast.success("Ad updated successfully");
  };

  const updateReward = (rewardId: string, updatedReward: Partial<RewardType>) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can update rewards");
      return;
    }

    const updatedRewards = rewards.map(reward => 
      reward.id === rewardId ? { ...reward, ...updatedReward } : reward
    );
    setRewards(updatedRewards);
    toast.success("Reward updated successfully");
  };

  const addTask = (task: Omit<TaskType, "id" | "completed">) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can add tasks");
      return;
    }

    const newTask: TaskType = {
      ...task,
      id: `task${Date.now()}`,
      completed: false
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully");
  };

  const addAd = (ad: Omit<AdType, "id">) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can add ads");
      return;
    }

    const newAd: AdType = {
      ...ad,
      id: `ad${Date.now()}`
    };
    setAds([...ads, newAd]);
    toast.success("Ad added successfully");
  };

  const addReward = (reward: Omit<RewardType, "id">) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can add rewards");
      return;
    }

    const newReward: RewardType = {
      ...reward,
      id: `reward${Date.now()}`
    };
    setRewards([...rewards, newReward]);
    toast.success("Reward added successfully");
  };

  const removeTask = (taskId: string) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can remove tasks");
      return;
    }

    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task removed successfully");
  };

  const removeAd = (adId: string) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can remove ads");
      return;
    }

    setAds(ads.filter(ad => ad.id !== adId));
    toast.success("Ad removed successfully");
  };

  const removeReward = (rewardId: string) => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can remove rewards");
      return;
    }

    setRewards(rewards.filter(reward => reward.id !== rewardId));
    toast.success("Reward removed successfully");
  };

  const updateWithdrawalRequestStatus = (requestId: string, status: "pending" | "approved" | "rejected") => {
    if (!currentUser?.isAdmin) {
      toast.error("Only admins can update withdrawal requests");
      return;
    }

    const updatedRequests = withdrawalRequests.map(request => 
      request.id === requestId ? { ...request, status } : request
    );
    setWithdrawalRequests(updatedRequests);
    toast.success(`Withdrawal request ${status}`);
  };

  const coins = currentUser?.coins || 0;
  
  return (
    <CoinContext.Provider
      value={{
        currentUser,
        tasks,
        ads,
        rewards,
        withdrawalRequests,
        referralReward,
        minWithdrawalCoins,
        coins,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        registerUser,
        completeTask,
        watchAd,
        requestWithdrawal,
        useReferralCode,
        isAdWatching,
        currentAdId,
        adTimeRemaining,
        bannerAd,
        topBannerAd,
        updateTask,
        updateAd,
        updateReward,
        addTask,
        addAd,
        addReward,
        removeTask,
        removeAd,
        removeReward,
        updateWithdrawalRequestStatus,
        claimCoins,
        claimDailyReward,
        canClaimDailyReward
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export const useCoin = () => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error("useCoin must be used within a CoinProvider");
  }
  return context;
};
