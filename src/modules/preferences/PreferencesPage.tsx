'use client';
import React, { useEffect, useState } from 'react';
import NavigationBarLayout from '@/modules/navigationLayout/NavigationBarLayout';
import Preferences from '@/modules/preferences/Preferences';
import { ACCESS_TOKEN } from '@/shared/constants/storage';
import Cookies from 'js-cookie';

const PreferencesPage: React.FC = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = typeof window !== 'undefined' ? Cookies.get(ACCESS_TOKEN) : null;
        setAccessToken(accessToken || null);
    }, []);

    if (accessToken === null) {
        return (
            <div className="min-h-screen flex justify-center items-center px-4 py-6">
                <Preferences />
            </div>
        );
    } else {
        return (
            <NavigationBarLayout>
                <div className="flex justify-center items-center px-4 py-6">
                    <Preferences />
                </div>
            </NavigationBarLayout>
        );
    }
};

export default PreferencesPage;