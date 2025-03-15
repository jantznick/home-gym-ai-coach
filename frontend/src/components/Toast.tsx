import React, { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded shadow-lg">
      {message}
    </div>
  );
};

export default Toast;
