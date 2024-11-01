import { useState } from 'react';

const useAlert = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000); // Esconde o alerta após 3 segundos
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000); // Esconde o alerta após 3 segundos
  };

  return { error, success, showError, showSuccess };
};

export default useAlert;