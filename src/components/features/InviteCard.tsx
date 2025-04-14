
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useCoin } from "@/context/CoinContext";

const InviteCard = () => {
  const { currentUser, referralReward } = useCoin();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}?ref=${currentUser?.referralCode}`;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join CoinQuest",
          text: `Use my referral code ${currentUser?.referralCode} to join and earn coins!`,
          url: referralLink,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      handleCopy(referralLink);
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-purple-50/30">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Invite Friends & Earn Big</h2>
          <p className="text-muted-foreground">
            Invite friends to join and earn {referralReward} coins for every successful referral!
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-purple-500 mr-2" />
            <span className="font-medium">Your Referrals:</span>
          </div>
          <Badge variant="secondary" className="text-lg px-4">
            {currentUser?.referrals || 0} / 5
          </Badge>
        </div>

        {currentUser?.referrals < 5 && (
          <p className="text-sm text-purple-700">
            Invite {5 - (currentUser?.referrals || 0)} more friends to unlock withdrawals and get 5000 bonus coins!
          </p>
        )}

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input 
              value={referralLink}
              readOnly
              className="bg-white"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(referralLink)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Or share your invite code: <span className="font-mono font-medium">{currentUser?.referralCode}</span>
            </p>
            <Button 
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Invite Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;
