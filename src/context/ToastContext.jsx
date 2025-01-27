import React, {createContext, useContext, useState} from 'react';
import SuccessToast from '../components/SuccessToast';
import ErrorToast from '../components/ErrorToast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({children}) => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const showSuccess = (message, duration = 1500) => {
    setSuccess({message, duration});
  };

  const showError = (message, duration = 5000) => {
    setError({message, duration});
  };

  return (
    <ToastContext.Provider value={{showSuccess, showError}}>
      {children}
      {success && (
        <SuccessToast
          message={success.message}
          onClose={() => setSuccess(null)}
          duration={success.duration}
        />
      )}
      {error && (
        <ErrorToast
          message={error.message}
          onClose={() => setError(null)}
          duration={error.duration}
        />
      )}
    </ToastContext.Provider>
  );
};
