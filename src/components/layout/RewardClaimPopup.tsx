import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins } from "@/components/ui/Coins";
import { Sparkles } from "lucide-react";
import useSound from "use-sound";
import { useCoin } from "@/context/CoinContext";

interface RewardClaimPopupProps {
  open: boolean;
  onClose: () => void;
  coinsEarned: number;
}

const RewardClaimPopup: React.FC<RewardClaimPopupProps> = ({
  open,
  onClose,
  coinsEarned,
}) => {
  const { currentUser, claimCoins } = useCoin();
  const [playSuccess] = useSound('/sounds/success.mp3');

  React.useEffect(() => {
    if (open) {
      playSuccess();
    }
  }, [open, playSuccess]);

  const handleClaim = () => {
    claimCoins(coinsEarned);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            Congratulations!
          </DialogTitle>
        </DialogHeader>
        <div className="py-8">
          <p className="text-lg mb-4">You've earned</p>
          <div className="flex items-center justify-center text-3xl font-bold gap-2">
            {coinsEarned} <Coins className="h-6 w-6" />
          </div>
          {currentUser && (
            <p className="text-sm mt-4 text-muted-foreground">
              Your balance: {currentUser.coins} coins
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <Button onClick={handleClaim} className="animate-pulse">Claim Rewards</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardClaimPopup;
