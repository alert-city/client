"use client";
import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import SideBar from "@/modules/dashboard/Sidebar";
import { useState } from "react";
import { useEffect } from "react";
import { IS_FIRST_LOGIN, ACCOUNT_TYPE, IS_DARK } from '@/shared/constants/storage';
import WelcomeSnackbar from "@/modules/welcome-snackbar/WelcomeSnackbar";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import AdminReviewList from "@/modules/dashboard/AdminReviewList";
import AdminEventList from "@/modules/dashboard/AdminEventList";
import StaffReviewList from "@/modules/dashboard/StaffReviewList";
import StaffEventList from "@/modules/dashboard/StaffEventList";
import DisplayEventInfo from "@/modules/dashboard/DisplayEventInfo";
import { IndexConfig } from "@/routes";
import "@fontsource/poppins";

type EventInfo = {
    id: string;
    subject: string;
    matter: string;
    time: string;
    date: string;
    ERTime: string | null;
    ERDate: string | null;
    location: string | null;
};

const Dashboard: React.FC = () => {
    const [accountType, setAccountType] = useState<string | null>(null);
    const [isFirstLogin, setIsFirstLogin] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const t = useTranslations("DashboardPage");
    const isDark = localStorage.getItem(IS_DARK) === "1";

    //DisplayUnreviewedEvents Params
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [eventInfo, setEventInfo] = useState<EventInfo | null>();

    const handleOpenEventInfo = (input: EventInfo) => {
        setEventInfo(input);
        setOpenInfo(true);
    };

    const handleCloseEventInfo = () => setOpenInfo(false);

    useEffect(() => {
        const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
        setAccountType(accountType!);
        setIsAdmin(accountType === IndexConfig.Organization.AccountType);
        const firstLogin = localStorage.getItem(IS_FIRST_LOGIN);
        setIsFirstLogin(firstLogin);
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 900, md: 1000 },
                minHeight: "80vh",
                overflow: 'auto',
                padding: { xs: 2, sm: 3, md: 4 },
                border: isDark ? '1px solid #fff' : 'none',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Poppins, sans-serif',
            }}
        >
            <Typography
                variant="h4"
                textAlign="center"
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: isDark ? '#ccc' : '#333',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    mb: { xs: 1, md: 2 }
                }}
            >
                {t("dashboard")}
            </Typography>

            {/* 第一行：Sidebar 和 Review List */}
            <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                width="100%"
                sx={{
                    flexDirection: { xs: 'column', md: 'row' }
                }}
            >
                {/* Sidebar */}
                <Box sx={{
                    width: { xs: '100%', md: 'calc(25% - 8px)' },
                    flexShrink: 0
                }}>
                    <SideBar accountType={accountType!} />
                </Box>

                {/* Review List */}
                <Box sx={{
                    width: { xs: '100%', md: 'calc(75% - 8px)' },
                    flexShrink: 0
                }}>
                    {isAdmin && <AdminReviewList handleOpenEventInfo={handleOpenEventInfo} />}
                    {!isAdmin && <StaffReviewList handleOpenEventInfo={handleOpenEventInfo} />}
                </Box>
            </Box>

            {/* 第二行：Event Lists */}
            <Box sx={{ width: '100%' }}>
                {isAdmin && <AdminEventList handleOpenEventInfo={handleOpenEventInfo} />}
                {!isAdmin && <StaffEventList handleOpenEventInfo={handleOpenEventInfo} />}
            </Box>

            {eventInfo && <DisplayEventInfo
                open={openInfo}
                handleClose={handleCloseEventInfo}
                windowTitle={t("eventDetails")}
                subject={eventInfo?.subject!}
                matter={eventInfo?.matter!}
                time={eventInfo?.time!}
                date={eventInfo?.date!}
                ERTime={eventInfo?.ERTime || null}
                ERDate={eventInfo?.ERDate || null}
                location={eventInfo?.location || null}
            />}
            {isFirstLogin === 'true' && <WelcomeSnackbar />}
        </Box>
    )
};

export default Dashboard;