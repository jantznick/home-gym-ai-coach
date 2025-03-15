import React from "react";

const LoginRegisterInterstitial: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-purple-600">Welcome to Workout Generator</h1>
      <p className="text-lg text-gray-700 mt-2">Please log in or register to continue.</p>
      <div className="mt-4">
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition mr-2">
          Log In
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginRegisterInterstitial;
