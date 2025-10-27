import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from '@/i18n/routing';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { RouteConfig } from '@/routes/route';
import { IndexConfig } from '@/routes';
import { useTranslations } from 'next-intl';
import "@fontsource/poppins";
import { IS_DARK } from '@/shared/constants/storage';

const SideBar: React.FC<{ accountType: string }> = ({
                                                        accountType
                                                    }) => {
    const t = useTranslations("DashboardSideBar");
    const router = useRouter();
    const isDark = localStorage.getItem(IS_DARK) === "1";

    const handleNavigation = (path: string) => {
        const basePath = (
            accountType === IndexConfig.Organization.AccountType
        ) ? RouteConfig.AdminSubmission.Path : RouteConfig.StaffSubmission.Path;
        router.push(basePath + path);
    };

    const buttonStyles = {
        width: "100%",
        padding: { xs: 1, sm: 1.5, md: 2 },
        marginBottom: 2,
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
            sx={{
                padding: { xs: 2, sm: 2, md: 3 },
                borderRadius: '24px',
                boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)',
                width: '100%',
                height: 'auto',
                minHeight: { xs: 'auto', md: '250px' },
                backgroundColor: isDark ? "#222" : "#f9f9f9"
            }}
        >
            <Typography
                variant='h6'
                gutterBottom
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    color: isDark ? '#ccc' : '#333',
                    mb: 2
                }}
            >
                {t("postAnEvent")}
            </Typography>
            <Button
                variant='contained'
                fullWidth
                sx={{
                    ...buttonStyles,
                    backgroundColor: `rgba(255, 165, 0, ${isDark ? 0.7 : 1})`
                }}
                onClick={() => handleNavigation(RouteConfig.EmergencySubmission.Path)}
            >
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Typography
                        variant='subtitle2'
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontFamily: 'Poppins, sans-serif'
                        }}>
                        {t("emergency")}
                    </Typography>
                </Box>
            </Button>
            <Button
                variant='contained'
                color='primary'
                fullWidth
                sx={{
                    ...buttonStyles,
                    backgroundColor: `rgba(3, 138, 255, ${isDark ? 0.7 : 1})`,
                    marginBottom: 0
                }}
                onClick={() => handleNavigation(RouteConfig.RoutineSubmission.Path)}
            >
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Typography
                        variant='subtitle2'
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontFamily: 'Poppins, sans-serif'
                        }}>
                        {t("routine")}
                    </Typography>
                </Box>
            </Button>
        </Box>
    )
};

export default SideBar;