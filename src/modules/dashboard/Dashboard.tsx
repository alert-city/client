"use client";
import React from "react";
import { Box, Typography, Card, CardContent, useMediaQuery, useTheme } from "@mui/material";
import SideBar from "@/modules/dashboard/Sidebar";
import { useState } from "react";
import { useEffect } from "react";
import { IS_FIRST_LOGIN, ACCOUNT_TYPE } from '@/shared/constants/storage';
import WelcomeSnackbar from "@/modules/welcome-snackbar/WelcomeSnackbar";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import "@fontsource/poppins";
import { FIND_USER_BY_USERNAME } from "@/graphql/user";
import { USERNAME } from "@/shared/constants/storage";
import { useQuery } from "@apollo/client";

const Dashboard: React.FC = () => {
    const [accountType, setAccountType] = useState<string | null>(null);
    const [isFirstLogin, setIsFirstLogin] = useState<string | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const t = useTranslations("DashboardPage");

    const username = localStorage.getItem(USERNAME);
    const { data } = useQuery(FIND_USER_BY_USERNAME, { variables: { username } });
    const role = data?.findUserByUsername?.role;
    const isAdmin = role ? role.includes("admin") : false;

    const cardStyle = {
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
            width={isMobile ? "100%" : "80%"}
            minWidth={isMobile ? "auto" : "800px"}
            maxWidth={800}
            padding={isMobile ? 2 : 4}
            gap={2}
            mb={2}
            sx={{
                margin: "auto",
                borderRadius: '24px',
                boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Typography
                variant={isMobile ? "h5" : "h4"}
                mb={3}
                textAlign="center"
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: theme.palette.primary.main
                }}
            >
                {t("dashboard")}
            </Typography>
            <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                gap={3}
            >
                <Box
                    width={isMobile ? "100%" : "30%"}
                    mb={isMobile ? 3 : 0}
                >
                    <SideBar accountType={accountType!} isMobile={isMobile} isAdmin={isAdmin}/>
                </Box>
                <Box display="flex" flexDirection="column" gap={3} width={isMobile ? "100%" : "70%"}>
                    <Card sx={cardStyle}>
                        <CardContent>
                            <Typography
                                variant='h6'
                                gutterBottom
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500
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
                                    fontWeight: 500
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