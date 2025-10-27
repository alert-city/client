import React from 'react';
import RegisterForm  from '@/modules/auth/register/RegistrationPage';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Register.Metadata

const RegisterPage: React.FC = () => {
    return (
        <div className="flex justify-center py-6 sm:py-8 md:py-10 px-4">
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;