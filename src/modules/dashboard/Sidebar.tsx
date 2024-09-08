import React from 'react';
import { Box, Typography, List, Button } from '@mui/material';
import { useRouter } from '@/i18n/routing';
import { RouteConfig } from '@/routes/route';
import { IndexConfig } from '@/routes';
import { useTranslations } from 'next-intl';
import "@fontsource/poppins";

const SideBar: React.FC<{ accountType: string, isDark: boolean }> = ({
    accountType, isDark
}) => {
    const t = useTranslations("DashboardSideBar");
    const router = useRouter();

    const handleNavigation = (path: string) => {
        const basePath = (
            accountType === IndexConfig.Organization.AccountType
        ) ? RouteConfig.AdminSubmission.Path : RouteConfig.StaffSubmission.Path;
        router.push(basePath + path);
    };

    const buttonStyles = {
        minWidth: "150px",
        padding: {sm: 1.5, md: 2},
        marginBottom: 2,
        backgroundSize: {sm: '5%', md: '15%'},
        backgroundRepeat: "no-repeat",
        backgroundPosition: {sm: 'left calc(35% + 5px) center', md: 'left calc(10% + 5px) center'},
        backgroundBlendMode: "overlay",
        color: "white",
        border: 0,
        borderRadius: "24px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, .15)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        fontFamily: 'Poppins, sans-serif',
        "&:hover": {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
        }
    };

    return (
        <Box
            gap={2}
            mb={2}
            sx={{
                padding: {sm: 2, md: 3},
                borderRadius: '24px',
                boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)',
                width: '100%',
                minWidth: '200px',
                maxWidth: {sm: '800px', md: 800},
                backgroundColor: isDark ? "#222" : "#f9f9f9"
            }}
        >
            <Typography
                variant='h6'
                gutterBottom
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: isDark ? '#ccc' : '#333' // Elegant dark color
                }}
            >
                {t("postAnEvent")}
            </Typography>
            <List>
            <Button
                    variant='contained'
                    color='warning'
                    fullWidth
                    sx={{
                        ...buttonStyles,
                        backgroundImage: "url(/images/submission-icons/emergency.svg)",
                    }}
                    onClick={() => handleNavigation(RouteConfig.EmergencySubmission.Path)}
                >
                    <Typography variant='subtitle2' sx={{ fontSize: "12px", fontFamily: 'Poppins, sans-serif' }}>
                        {t("emergency")}
                    </Typography>
                </Button>
                <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    sx={{
                        ...buttonStyles,
                        backgroundImage: "url(/images/submission-icons/routine.svg)",
                    }}
                    onClick={() => handleNavigation(RouteConfig.RoutineSubmission.Path)}
                >
                    <Typography variant='subtitle2' sx={{ fontSize: "12px", fontFamily: 'Poppins, sans-serif' }}>
                        {t("routine")}
                    </Typography>
                </Button>
            </List>
        </Box>
    )
};

export default SideBar;