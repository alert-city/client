import React from "react";
import { EMERGENCY, ID, ROUTINE, IS_DARK } from "@/shared/constants/storage";
import { useQuery } from "@apollo/client";
import { FIND_REVIEWED_EVENTS_BY_ID } from "@/graphql/event";
import { CardStyle } from "@/modules/dashboard/CardStyle";
import { useTranslations } from "next-intl";
import '@fontsource/poppins';
import { Box, Card, CardContent, Typography } from "@mui/material";

type EventValues = {
    id: string;
    eventType: string;
    subject: string;
    matter: string;
    time: string;
    date: string;
    ERTime: string | null;
    ERDate: string | null;
    location: string | null;
};

const StaffEventList: React.FC = () => {
    const t = useTranslations("DashboardPage");
    const isDark = localStorage.getItem(IS_DARK) === "1";

    const userId = localStorage.getItem(ID);
    const { data: eventData } = useQuery(
        FIND_REVIEWED_EVENTS_BY_ID,
        {
            variables: { userId: userId, approved: true, ascending: false },
            skip: !userId,
            fetchPolicy: "no-cache"
        }
    );
    const satffEvents = eventData?.findReviewedEventsById || [];
    const emergencyEvents = satffEvents.filter((item: EventValues) => {
        return item.eventType === EMERGENCY;
    });
    const routineEvents = satffEvents.filter((item: EventValues) => {
        return item.eventType === ROUTINE;
    });

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            width="100%"
            gap={2}
        >
            <Card sx={{ ...CardStyle, flex: { xs: "1 1 100%", md: "1 1 calc(40% - 10px)" } }}>
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
                        {t("emergencyEvents")}: {emergencyEvents.length}
                    </Typography>
                    <Box display="flex" flexDirection="column" padding="1px">
                        {emergencyEvents && emergencyEvents.map((item: EventValues) => (
                            <Box
                                key={item.id}
                                display="flex"
                                flexDirection="column"
                                padding={2}
                                sx={{
                                    width: "100%",
                                    backgroundColor: isDark ? "#333" : "none",
                                    borderRadius: "12px",
                                    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
                                    mb: 1
                                }}
                            >
                                <Typography variant='h6'>
                                    {t("subject")}: {item.subject}
                                </Typography>
                                <Typography variant='body2'>
                                    {t("matter")}: {item.matter}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ ...CardStyle, flex: { xs: "1 1 100%", md: "1 1 calc(40% - 10px)" } }}>
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
                        {t("routineEvents")}: {routineEvents.length}
                    </Typography>
                    <Box display="flex" flexDirection="column" padding="1px">
                        {routineEvents && routineEvents.map((item: EventValues) => (
                            <Box
                                key={item.id}
                                display="flex"
                                flexDirection="column"
                                padding={2}
                                sx={{
                                    width: "100%",
                                    backgroundColor: isDark ? "#333" : "none",
                                    borderRadius: "12px",
                                    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
                                    mb: 1
                                }}
                            >
                                <Typography variant='h6'>
                                    {t("subject")}: {item.subject}
                                </Typography>
                                <Typography variant='body2'>
                                    {t("matter")}: {item.matter}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default StaffEventList;