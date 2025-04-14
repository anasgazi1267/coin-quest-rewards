
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AdBanner from "./AdBanner";

interface MainLayoutProps {
  children: React.ReactNode;
  showTopBanner?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showTopBanner = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {showTopBanner && (
        <div className="container mx-auto px-4 py-2">
          <AdBanner type="top" />
        </div>
      )}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
