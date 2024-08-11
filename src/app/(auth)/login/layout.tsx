import React from 'react';

const LoginLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="justify-center items-center flex min-h-screen bg-login bg-cover bg-center">
      {children}
    </div>
  );
};

export default LoginLayout;
