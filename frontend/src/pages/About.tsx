import React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-purple-600">About This App</h1>
      <p className="text-lg text-gray-700 mt-2">This app helps you log your workouts and stay fit!</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
        Back to Home
      </Link>
    </div>
  );
};

export default About;