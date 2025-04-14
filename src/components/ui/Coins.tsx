
import React from "react";
import { Coins as CoinsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoinsProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const Coins = ({ className, ...props }: CoinsProps) => {
  return (
    <CoinsIcon className={cn("text-yellow-500 coin-animation", className)} {...props} />
  );
};
