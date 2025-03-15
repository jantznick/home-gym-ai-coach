import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import Dashboard from "./pages/Dashboard";
import TermsOfService from "./pages/TermsOfService";
import Header from "./components/Header";
import LoginRegisterInterstitial from "./components/LoginRegisterInterstitial";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Toast from "./components/Toast";

const App: React.FC = () => {
  const [toastMessage, setToastMessage] = useState("");

  return (
    <>
      <Toast message={toastMessage} />
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginRegisterInterstitial />} />
        <Route path="/callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
