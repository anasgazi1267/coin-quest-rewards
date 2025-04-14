
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "@/components/ui/Coins";
import { Gift, Zap, Users, Award, Youtube, MessageCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import AdBanner from "@/components/layout/AdBanner";
import AdPopup from "@/components/layout/AdPopup";
import { useCoin } from "@/context/CoinContext";

const Index = () => {
  const { isAuthenticated, ads } = useCoin();
  const [adPopupOpen, setAdPopupOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);

  const openAdPopup = (adId: string) => {
    setSelectedAdId(adId);
    setAdPopupOpen(true);
  };

  const closeAdPopup = () => {
    setAdPopupOpen(false);
    setSelectedAdId(null);
  };

  const features = [
    {
      icon: <Gift className="h-12 w-12 mb-4 text-primary" />,
      title: "Amazing Rewards",
      description: "Redeem your coins for Amazon gift cards, game currencies, and more!",
    },
    {
      icon: <Zap className="h-12 w-12 mb-4 text-primary" />,
      title: "Quick Tasks",
      description: "Complete simple tasks to earn coins quickly and efficiently.",
    },
    {
      icon: <Users className="h-12 w-12 mb-4 text-primary" />,
      title: "Referral Program",
      description: "Invite friends and earn 50 coins for each successful referral.",
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Earn Coins, Get <span className="text-primary">Rewards</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Complete tasks, watch ads, and refer friends to earn coins. Redeem them for gift cards, game currencies, and more!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Earning
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt="Earn rewards" 
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4 bg-primary text-white py-2 px-4 rounded-full">
                <span className="flex items-center font-bold">
                  Earn Today! <Coins className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Watch Ads, Earn Coins</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Choose an ad duration and earn coins instantly after watching. The longer the ad, the more coins you earn!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ads.map(ad => (
              <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {ad.durationInSeconds} seconds
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold mr-1">{ad.coinsReward}</span>
                      <Coins className="h-4 w-4" />
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => openAdPopup(ad.id)}
                    disabled={!isAuthenticated}
                  >
                    Watch Ad
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                      <Link to="/login" className="text-primary hover:underline">
                        Login
                      </Link>{" "}
                      to watch ads
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Task Types Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Complete Tasks, Earn More</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Youtube className="h-8 w-8 text-red-500 mr-3" />
                  <h3 className="text-xl font-semibold">Subscribe to YouTube</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Subscribe to partner YouTube channels and earn coins as rewards.
                </p>
                <Button variant="outline" className="w-full">
                  <Link to="/dashboard">View YouTube Tasks</Link>
                </Button>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold">Join Telegram Groups</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Join partner Telegram groups and earn coins instantly.
                </p>
                <Button variant="outline" className="w-full">
                  <Link to="/dashboard">View Telegram Tasks</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Banner Ad */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <AdBanner type="sidebar" />
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-16 bg-gradient-to-t from-secondary to-background">
        <div className="container mx-auto px-4 text-center">
          <Award className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-6">Invite Friends, Earn More</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Share your referral link with friends and earn 50 coins for each new user who joins!
          </p>
          <Button size="lg" asChild>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "View My Referral Link" : "Register to Get Referral Link"}
            </Link>
          </Button>
        </div>
      </section>

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

export default Index;
