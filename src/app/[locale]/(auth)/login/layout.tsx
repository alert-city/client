import React from 'react';

const LoginLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="justify-center flex-col items-center flex min-h-screen bg-login-light bg-cover bg-center">
      {children}
    </div>
  );
};

export default LoginLayout;
