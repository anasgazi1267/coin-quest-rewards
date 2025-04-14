
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const { ads, watchAd, isAdWatching, adTimeRemaining, currentAdId } = useCoin();
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
    setShowRewardClaim(true);
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Watch Ad for Coins</h3>
            {!isAdWatching && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {isAdWatching && adId === currentAdId ? (
              <>
                <div className="relative">
                  <div dangerouslySetInnerHTML={{ __html: currentAd.content }} />
                  <div className="absolute top-2 right-2">
                    <div className="ad-countdown">{adTimeRemaining}</div>
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
