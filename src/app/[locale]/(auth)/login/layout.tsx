import React from 'react';

const LoginLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className="justify-center flex-col items-center flex min-h-screen bg-login-light bg-cover bg-center px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            {children}
        </div>
    );
};

export default LoginLayout;