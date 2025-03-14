import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const provider = params.get("provider");

      if (!code || !provider) {
        return navigate("/login");
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/oauth-callback`, {
          provider,
          code
        });

        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } catch (error) {
        console.error("OAuth callback error:", error);
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging in...</p>
    </div>
  );
};

export default OAuthCallback;