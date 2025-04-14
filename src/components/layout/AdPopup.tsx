
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins } from "@/components/ui/Coins";
import { Button } from "@/components/ui/button";
import { useCoin } from "@/context/CoinContext";
import RewardClaimPopup from "./RewardClaimPopup";

interface AdPopupProps {
  adId: string;
  onClose: () => void;
  open: boolean;
}

const AdPopup: React.FC<AdPopupProps> = ({ adId, onClose, open }) => {
  const { ads, watchAd, isAdWatching, adTimeRemaining, currentAdId, currentUser } = useCoin();
  const [showRewardClaim, setShowRewardClaim] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  
  const currentAd = ads.find(ad => ad.id === adId);
  
  useEffect(() => {
    if (open && adId && !isAdWatching) {
      watchAd(adId).catch(() => onClose());
    }
  }, [open, adId, watchAd, isAdWatching, onClose]);

  useEffect(() => {
    if (adTimeRemaining === 0 && isAdWatching) {
      setCanClaim(true);
    }
  }, [adTimeRemaining, isAdWatching]);

  const handleClaim = () => {
    if (currentAd && currentUser) {
      // Update user's coins in context when claimed
      setShowRewardClaim(true);
    }
  };

  const handleClaimComplete = () => {
    setShowRewardClaim(false);
    onClose();
  };

  if (!currentAd) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Watch Ad for Coins</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {isAdWatching && adId === currentAdId ? (
              <>
                <div className="relative">
                  <div dangerouslySetInnerHTML={{ __html: currentAd.content }} />
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                      {adTimeRemaining}s
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {adTimeRemaining > 0 ? (
                    <p>Please watch the entire ad to earn {currentAd.coinsReward} coins.</p>
                  ) : (
                    <Button 
                      onClick={handleClaim}
                      className="w-full"
                      disabled={!canClaim}
                    >
                      Claim {currentAd.coinsReward} Coins
                    </Button>
                  )}
                  <div className="mt-2 flex items-center justify-center">
                    <span className="font-medium mr-1">Reward:</span>{" "}
                    <span className="flex items-center">
                      {currentAd.coinsReward} <Coins className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p>Ad completed!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <RewardClaimPopup
        open={showRewardClaim}
        onClose={handleClaimComplete}
        coinsEarned={currentAd.coinsReward}
      />
    </>
  );
};

export default AdPopup;
