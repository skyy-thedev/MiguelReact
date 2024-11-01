import React, { useEffect } from 'react';
import  './alertSystem.module.css'; 

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  );
};

export default Alert;