
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type TaskType = {
  id: string;
  title: string;
  description: string;
  coinsReward: number;
  type: "youtube" | "telegram" | "ad" | "referral" | "custom";
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

  // Local storage management
  useEffect(() => {
    const storedUser = localStorage.getItem("coinQuestUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Ad timer effect
  useEffect(() => {
    let timer: number | undefined;
    
    if (isAdWatching && adTimeRemaining > 0) {
      timer = window.setInterval(() => {
        setAdTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (adTimeRemaining === 0 && isAdWatching && currentAdId) {
      // Ad completed
      setIsAdWatching(false);
      const ad = ads.find((a) => a.id === currentAdId);
      if (ad && currentUser) {
        const updatedUser = {
          ...currentUser,
          coins: currentUser.coins + ad.coinsReward,
          watchedAds: [
            ...currentUser.watchedAds,
            { adId: currentAdId, lastWatched: new Date().toISOString() }
          ]
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("coinQuestUser", JSON.stringify(updatedUser));
        toast.success(`You earned ${ad.coinsReward} coins for watching the ad!`);
      }
      setCurrentAdId(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAdWatching, adTimeRemaining, currentAdId, ads, currentUser]);

  const login = async (email: string, password: string) => {
    // Mock login for demonstration
    // In a real app, this would call an API
    try {
      const mockUser: UserType = {
        id: "user1",
        username: "demouser",
        email: email,
        coins: 100,
        referralCode: "DEMO123",
        referrals: 0,
        completedTasks: [],
        watchedAds: [],
        isAdmin: email === "admin@example.com"
      };
      
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("coinQuestUser", JSON.stringify(mockUser));
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
    // Mock registration for demonstration
    try {
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
    localStorage.setItem("coinQuestUser", JSON.stringify(updatedUser));
    
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
    localStorage.setItem("coinQuestUser", JSON.stringify(updatedUser));

    toast.success("Withdrawal request submitted! It will be processed soon.");
    return true;
  };

  const useReferralCode = (code: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to use referral codes");
      return;
    }

    // In a real app, we would validate the code against a database
    // For this demo, we'll simulate a successful referral
    
    // Update the referring user (would be fetched from backend in real app)
    toast.success(`Referral code ${code} applied! You earned 50 bonus coins.`);
    
    // Update current user
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + 50,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("coinQuestUser", JSON.stringify(updatedUser));
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
        topBannerAd
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
