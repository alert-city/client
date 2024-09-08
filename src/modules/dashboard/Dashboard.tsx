"use client";
import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import SideBar from "@/modules/dashboard/Sidebar";
import { useState } from "react";
import { useEffect } from "react";
import { IS_FIRST_LOGIN, ACCOUNT_TYPE, DARK, LIGHT } from '@/shared/constants/storage';
import WelcomeSnackbar from "@/modules/welcome-snackbar/WelcomeSnackbar";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import "@fontsource/poppins";
import useTheme from "@/utils/switchTheme";

const Dashboard: React.FC = () => {
    const [accountType, setAccountType] = useState<string | null>(null);
    const [isFirstLogin, setIsFirstLogin] = useState<string | null>(null);

    const t = useTranslations("DashboardPage");
    const { isSystemDark, displayTheme } = useTheme();
    const isDark = displayTheme === DARK ? true : (displayTheme === LIGHT ? false : isSystemDark);

    const cardStyle = {
        width: "100%",
        flexGrow: 1,
        borderRadius: "24px",
        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        "&:hover": {
            transform: 'translateY(-5px)', // Subtle lift on hover
            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.2)',
        }
    };

    useEffect(() => {
        const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
        setAccountType(accountType!);
        const firstLogin = localStorage.getItem(IS_FIRST_LOGIN);
        setIsFirstLogin(firstLogin);
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="80vh"
            maxWidth={800}
            gap={2}
            mb={2}
            sx={{
                margin: "auto",
                border: isDark ? "1px solid #fff" : "none",
                borderRadius: '24px',
                boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
                width: {sm: '100%', md: '80%'},
                minWidth: {sm: 'auto', md: '800px'},
                padding: {sm: 2,md: 4}
            }}
        >
            <Typography
                variant="h4"
                mb={3}
                textAlign="center"
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                }}
            >
                {t("dashboard")}
            </Typography>
            <Box
                display="flex"
                gap={3}
                sx={{
                    flexDirection: {sm: 'column', md: 'row'}
                }}
            >
                <Box
                    sx={{
                        width: {sm: '100%', md: '30%'},
                        mb: {sm: 3, md: 0}
                    }}
                >
                    <SideBar accountType={accountType!} isDark={isDark}/>
                </Box>
                <Box display="flex" flexDirection="column" gap={3} sx={{width: {sm: '100%', md: '70%'}}}>
                    <Card sx={cardStyle}>
                        <CardContent>
                            <Typography
                                variant='h6'
                                gutterBottom
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    width: '100%'
                                }}
                            >
                                {t("inReview")}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={cardStyle}>
                        <CardContent>
                            <Typography
                                variant='h6'
                                gutterBottom
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    width: '100%'
                                }}
                            >
                                {t("posts")}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            {isFirstLogin === 'true' && <WelcomeSnackbar />}
        </Box>
    )
};

export default Dashboard;