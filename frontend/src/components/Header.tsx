import React from "react";
import { Link } from "react-router-dom";
import LoginRegisterInterstitial from "./LoginRegisterInterstitial";

const Header: React.FC = () => {
  return (
    <header className="bg-purple-600 text-white p-4 flex flex-col md:flex-row md:justify-between items-center">
      <h1 className="text-2xl font-bold mb-2 md:mb-0">Workout Generator</h1>
      <nav className="mt-2 md:mt-0">
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/terms-of-service" className="hover:underline">Terms of Service</Link></li>
          <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
        </ul>
      </nav>
      <LoginRegisterInterstitial />
    </header>
  );
};

export default Header;
