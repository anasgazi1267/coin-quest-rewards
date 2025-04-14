
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Gift, Home, Info, LogOut, Database, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCoin } from "@/context/CoinContext";
import { Coins } from "@/components/ui/Coins";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { isAuthenticated, logout, coins, currentUser } = useCoin();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Rewards", href: "/rewards", icon: <Gift className="h-5 w-5" /> },
    { name: "How It Works", href: "/how-it-works", icon: <Info className="h-5 w-5" /> },
    { name: "Dashboard", href: "/dashboard", icon: <Database className="h-5 w-5" /> },
  ];

  // Add admin dashboard link if user is admin
  if (currentUser?.isAdmin) {
    navLinks.push({
      name: "Admin",
      href: "/admin",
      icon: <Crown className="h-5 w-5" />,
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CoinQuest</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center space-x-1 transition-colors hover:text-primary"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex items-center bg-secondary py-1 px-3 rounded-full">
                  <span className="font-semibold">{coins}</span>
                  <Coins className="h-5 w-5 ml-1 text-yellow-500" />
                </div>
                <div className="hidden md:block">
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:block space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="flex flex-col space-y-4 mt-8">
                  {isAuthenticated && (
                    <div className="flex items-center mb-6 py-2 border-b">
                      <User className="h-5 w-5 mr-2" />
                      <div className="flex flex-col">
                        <span className="font-medium">{currentUser?.username}</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{coins}</span>
                          <Coins className="h-4 w-4 ml-1 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center space-x-2 text-foreground hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}

                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-foreground hover:text-primary"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 pt-4 border-t">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">Login</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">Register</Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
