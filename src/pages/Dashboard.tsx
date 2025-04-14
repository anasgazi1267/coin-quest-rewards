
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Youtube, 
  MessageCircle, 
  Play, 
  Activity, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  XCircle, 
  CheckCircle 
} from "lucide-react";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import AdPopup from "@/components/layout/AdPopup";
import { useCoin } from "@/context/CoinContext";
import { Coins } from "@/components/ui/Coins";

const Dashboard = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    coins, 
    tasks, 
    ads, 
    completeTask, 
    withdrawalRequests,
    referralReward
  } = useCoin();
  const navigate = useNavigate();
  const [adPopupOpen, setAdPopupOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const openAdPopup = (adId: string) => {
    setSelectedAdId(adId);
    setAdPopupOpen(true);
  };

  const closeAdPopup = () => {
    setAdPopupOpen(false);
    setSelectedAdId(null);
  };

  const copyReferralCode = () => {
    if (currentUser?.referralCode) {
      navigator.clipboard.writeText(currentUser.referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  if (!currentUser) {
    return null; // Redirect will handle this
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.username}! Manage your tasks and rewards here.
          </p>
        </div>

        {/* Coins and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Coins</p>
                  <h3 className="text-2xl font-bold">{coins}</h3>
                </div>
                <Coins className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                  <h3 className="text-2xl font-bold">{currentUser.completedTasks.length}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ads Watched</p>
                  <h3 className="text-2xl font-bold">{currentUser.watchedAds.length}</h3>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Referrals</p>
                  <h3 className="text-2xl font-bold">{currentUser.referrals}</h3>
                </div>
                <Share2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard Content */}
        <Tabs defaultValue="tasks">
          <TabsList className="mb-8">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="ads">Watch Ads</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="withdrawals">My Withdrawals</TabsTrigger>
          </TabsList>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map(task => {
                const isCompleted = currentUser.completedTasks.includes(task.id);
                
                return (
                  <Card key={task.id} className={isCompleted ? "border-green-200 bg-green-50/30" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center">
                            {task.type === "youtube" ? (
                              <Youtube className="h-5 w-5 mr-2 text-red-500" />
                            ) : task.type === "telegram" ? (
                              <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                            ) : (
                              <Activity className="h-5 w-5 mr-2 text-primary" />
                            )}
                            {task.title}
                          </CardTitle>
                          <CardDescription>{task.description}</CardDescription>
                        </div>
                        <Badge variant={isCompleted ? "secondary" : "outline"} className="ml-2">
                          {isCompleted ? (
                            <span className="flex items-center">
                              <Check className="h-3 w-3 mr-1" /> Completed
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Coins className="h-3 w-3 mr-1" /> {task.coinsReward} coins
                            </span>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        {task.link && (
                          <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Open Link
                          </a>
                        )}
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                          disabled={isCompleted}
                          onClick={() => completeTask(task.id)}
                        >
                          {isCompleted ? "Completed" : "Complete Task"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Ads Tab */}
          <TabsContent value="ads" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Watch Ads to Earn Coins</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ads.map(ad => (
                <Card key={ad.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        {ad.durationInSeconds} seconds
                      </Badge>
                      <div className="flex items-center text-green-600 font-medium">
                        +{ad.coinsReward} <Coins className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => openAdPopup(ad.id)}
                    >
                      <Play className="h-4 w-4 mr-2" /> Watch Ad
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Program</CardTitle>
                <CardDescription>
                  Share your referral code with friends. Earn {referralReward} coins for each new user who joins!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                  <div className="font-mono text-sm">{currentUser.referralCode}</div>
                  <Button size="sm" variant="ghost" onClick={copyReferralCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Referrals</p>
                        <p className="text-2xl font-bold">{currentUser.referrals}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Coins Earned</p>
                        <p className="text-2xl font-bold">{currentUser.referrals * referralReward}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Reward Per Referral</p>
                        <p className="text-2xl font-bold">{referralReward}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">My Withdrawal Requests</h2>
            
            {withdrawalRequests.length > 0 ? (
              <div className="space-y-4">
                {withdrawalRequests
                  .filter(request => request.userId === currentUser.id)
                  .map(request => (
                    <Card key={request.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Reward Withdrawal</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center">
                            <Badge 
                              variant={
                                request.status === "approved" 
                                  ? "secondary" 
                                  : request.status === "rejected" 
                                  ? "destructive" 
                                  : "outline"
                              }
                              className="flex items-center"
                            >
                              {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                              {request.status === "approved" && <Check className="h-3 w-3 mr-1" />}
                              {request.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                              {request.status}
                            </Badge>
                            
                            <div className="ml-4 flex items-center">
                              <span className="font-medium">{request.coinsCost}</span>
                              <Coins className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="text-muted-foreground">No withdrawal requests yet</p>
                  <Button className="mt-4" asChild>
                    <a href="/rewards">Browse Rewards</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Ad Popup */}
      {selectedAdId && (
        <AdPopup
          adId={selectedAdId}
          open={adPopupOpen}
          onClose={closeAdPopup}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
