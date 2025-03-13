import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to My Fitness App</h1>
      <p className="text-lg text-gray-700 mt-2">Track your workouts and progress with ease.</p>
      <Link to="/about" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Go to About Page
      </Link>
    </div>
  );
};

export default Home;