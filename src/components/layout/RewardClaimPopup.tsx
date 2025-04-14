
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins } from "@/components/ui/Coins";
import { Sparkles } from "lucide-react";
import useSound from "use-sound";

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
  const [playSuccess] = useSound('/sounds/success.mp3');

  React.useEffect(() => {
    if (open) {
      playSuccess();
    }
  }, [open, playSuccess]);

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
        </div>
        <div className="flex justify-center">
          <Button onClick={onClose}>Claim Rewards</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardClaimPopup;
