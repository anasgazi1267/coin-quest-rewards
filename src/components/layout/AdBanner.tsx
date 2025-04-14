
import React from "react";
import { useCoin } from "@/context/CoinContext";

interface AdBannerProps {
  type: "top" | "sidebar";
}

const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  const { topBannerAd, bannerAd } = useCoin();
  
  return (
    <div
      className={`ad-banner rounded-md overflow-hidden ${
        type === "top" ? "w-full h-[60px]" : "w-full"
      }`}
      dangerouslySetInnerHTML={{
        __html: type === "top" ? topBannerAd : bannerAd,
      }}
    />
  );
};

export default AdBanner;
