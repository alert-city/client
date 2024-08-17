"use client"
import React, {useState, useEffect} from 'react';
import { useSearchParams } from 'next/navigation';
import NavigationBarLayout from '@/modules/navigationLayout/NavigationBarLayout';


const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') ;

  if (from === 'login') {
    return (
      <div>
        <h1>Reset Password Page</h1>
      </div>
    );
  } else {
    return (
      <NavigationBarLayout>
        <h1>Reset Password Page</h1>
      </NavigationBarLayout>
    );
  }
};

export default ResetPasswordPage;