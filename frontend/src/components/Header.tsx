import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthInterstitial from "./AuthInterstitial";

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAuthOpen = () => {
    setIsAuthOpen(true);
  };

  const handleAuthClose = () => {
    setIsAuthOpen(false);
  };

  return (
    <header
      className={`fixed top-4 left-4 right-4 z-10 rounded-md bg-blue-500/90 text-white backdrop-blur-md shadow-md transition-all duration-300 ${
        isSticky ? "top-0 left-0 right-0 rounded-none" : ""
      }`}
    >
      <div className={`mx-auto flex items-center justify-between p-4 ${isSticky ? "container" : "container mx-auto"}`}>
        <Link to="/" className="text-lg font-semibold">
          Home Gym AI Coach
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/workout"><Button variant="ghost">Workout</Button></Link>
          <Link to="/about"><Button variant="ghost">About</Button></Link>
          <Button onClick={handleAuthOpen} variant="ghost">
            Login/Register
          </Button>
        </nav>
      </div>
      <AuthInterstitial open={isAuthOpen} onClose={handleAuthClose} />
    </header>
  );
};

export default Header;
