import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins } from "@/components/ui/Coins";
import { ShoppingBag, Smartphone, CreditCard, AlertCircle } from "lucide-react";
import { useCoin } from "@/context/CoinContext";
import MainLayout from "@/components/layout/MainLayout";

const Rewards = () => {
  const { rewards, isAuthenticated, coins, requestWithdrawal, minWithdrawalCoins } = useCoin();
  const navigate = useNavigate();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [gameUsername, setGameUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleRewardSelect = (rewardId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedReward(rewardId);
    setGameUsername("");
    setGameId("");
  };

  const handleWithdrawalRequest = async () => {
    if (!selectedReward) return;
    
    setIsWithdrawing(true);
    const selectedRewardObj = rewards.find(r => r.id === selectedReward);
    const needsGameInfo = selectedRewardObj?.type === "freefire" || selectedRewardObj?.type === "pubg";
    
    try {
      const result = await requestWithdrawal(
        selectedReward,
        needsGameInfo ? gameUsername : undefined,
        needsGameInfo ? gameId : undefined
      );
      
      if (result) {
        setSelectedReward(null);
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "amazon":
      case "googleplay":
        return <ShoppingBag className="h-6 w-6 text-[#FF9900]" />;
      case "freefire":
      case "pubg":
        return <Smartphone className="h-6 w-6 text-blue-500" />;
      case "visa":
        return <CreditCard className="h-6 w-6 text-[#1434CB]" />;
      default:
        return <Coins className="h-6 w-6" />;
    }
  };

  const selectedRewardObj = selectedReward ? rewards.find(r => r.id === selectedReward) : null;
  const needsGameInfo = selectedRewardObj?.type === "freefire" || selectedRewardObj?.type === "pubg";
  const canWithdraw = coins >= minWithdrawalCoins;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Rewards</h1>
          <p className="text-muted-foreground">
            Redeem your coins for amazing rewards
          </p>
        </div>

        {!canWithdraw && isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Minimum Balance Required</h3>
              <p className="text-sm text-amber-700">
                You need at least {minWithdrawalCoins} coins to request a withdrawal. 
                You currently have {coins} coins.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.id} className="overflow-hidden gift-card-item">
              <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                <div className="text-4xl">{getRewardIcon(reward.type)}</div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{reward.title}</CardTitle>
                  <Badge variant="outline" className={reward.stock < 5 ? "bg-red-50 text-red-600" : ""}>
                    {reward.stock} left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                <div className="flex items-center font-semibold">
                  <span>{reward.coinsCost}</span>
                  <Coins className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleRewardSelect(reward.id)}
                  disabled={!isAuthenticated || coins < reward.coinsCost || reward.stock <= 0 || !canWithdraw}
                >
                  Redeem
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedReward && selectedRewardObj && (
          <Dialog open={!!selectedReward} onOpenChange={(open) => !open && setSelectedReward(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Redeem {selectedRewardObj.title}</DialogTitle>
                <DialogDescription>
                  You are about to redeem this reward for {selectedRewardObj.coinsCost} coins.
                </DialogDescription>
              </DialogHeader>

              {needsGameInfo && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="gameUsername">
                      {selectedRewardObj.type === "freefire" ? "Free Fire" : "PUBG"} Username
                    </Label>
                    <Input
                      id="gameUsername"
                      value={gameUsername}
                      onChange={(e) => setGameUsername(e.target.value)}
                      placeholder="Enter your game username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gameId">
                      {selectedRewardObj.type === "freefire" ? "Free Fire" : "PUBG"} ID
                    </Label>
                    <Input
                      id="gameId"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      placeholder="Enter your game ID"
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedReward(null)}
                  disabled={isWithdrawing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdrawalRequest}
                  disabled={
                    isWithdrawing || 
                    (needsGameInfo && (!gameUsername || !gameId))
                  }
                >
                  {isWithdrawing ? "Processing..." : "Confirm Redemption"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default Rewards;
