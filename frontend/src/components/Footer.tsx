import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-500 text-white py-8">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-sm">&copy; 2025 Home Gym AI Coach. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/terms" className="text-sm hover:underline">Terms of Service</Link>
          <Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
