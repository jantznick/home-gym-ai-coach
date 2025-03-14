import React from "react";
import { API_BASE_URL } from "../config";

const Login: React.FC = () => {
  const loginWith = (provider: string) => {
    window.location.href = `${API_BASE_URL}/api/auth/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Login</h1>
      <p className="text-gray-600 mt-2">Choose a login method:</p>

      <button
        onClick={() => loginWith("google")}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Login with Google
      </button>

      <button
        onClick={() => loginWith("facebook")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Login with Facebook
      </button>

      <button
        onClick={() => loginWith("apple")}
        className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Login with Apple
      </button>
    </div>
  );
};

export default Login;