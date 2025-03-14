import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user ? (
        <div className="mt-4 bg-white p-4 rounded shadow text-center">
          <p className="text-xl">Welcome, {user.name || "User"}!</p>
          <p className="text-gray-600">{user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};

export default Dashboard;