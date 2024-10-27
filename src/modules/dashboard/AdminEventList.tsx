import React, { useEffect } from "react";
import { EMERGENCY, ID, ROUTINE, IS_DARK } from "@/shared/constants/storage";
import { useQuery, useSubscription } from "@apollo/client";
import { FIND_ONE_USER } from "@/graphql/user";
import { FIND_REVIEWED_EVENTS_BY_ORG_NAME, EVENT_CREATED, EVENT_UPDATED } from "@/graphql/event";
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

const AdminEventList: React.FC<{
    handleOpenEventInfo: (input: EventValues) => void
}> = ({
    handleOpenEventInfo
}) => {
    const t = useTranslations("DashboardPage");
    const isDark = localStorage.getItem(IS_DARK) === "1";

    const {data: eventCreated} = useSubscription(EVENT_CREATED);
    const {data: eventUpdated} = useSubscription(EVENT_UPDATED);

    const userId = localStorage.getItem(ID);
    const { data: userData } = useQuery(
        FIND_ONE_USER,
        {
            variables: { id: userId },
            skip: !userId
        }
    );
    const orgName = userData?.findOneUser?.orgName;
    const { data: eventData, refetch } = useQuery(
        FIND_REVIEWED_EVENTS_BY_ORG_NAME,
        {
            variables: { orgName: orgName, approved: true, ascending: false },
            skip: !orgName,
            fetchPolicy: "no-cache"
        }
    );
    const orgEvents = eventData?.findReviewedEventsByOrgName || [];
    const emergencyEvents = orgEvents.filter((item: EventValues) => {
        return item.eventType === EMERGENCY;
    });
    const routineEvents = orgEvents.filter((item: EventValues) => {
        return item.eventType === ROUTINE;
    });

    useEffect(() => {
        if (eventCreated || eventUpdated) {
            refetch();
        }
    }, [eventCreated, eventUpdated])

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
                                component="button"
                                display="flex"
                                flexDirection="column"
                                padding={2}
                                sx={{
                                    width: "100%",
                                    backgroundColor: isDark ? "#333" : "none",
                                    borderRadius: "12px",
                                    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
                                    mb: 1,
                                    transition: 'all 0.3s ease',
                                    "&:hover": {
                                        transform: 'scale(1.03)',
                                        backgroundColor: "rgba(135, 206, 250, 0.5)",
                                        boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.2)',
                                    }
                                }}
                                onClick={() => handleOpenEventInfo({
                                    id: item.id,
                                    eventType: item.eventType,
                                    subject: item.subject,
                                    matter: item.matter,
                                    time: item.time,
                                    date: item.date,
                                    ERTime: item.ERTime,
                                    ERDate: item.ERDate,
                                    location: item.location
                                })}
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
                                component="button"
                                display="flex"
                                flexDirection="column"
                                padding={2}
                                sx={{
                                    width: "100%",
                                    backgroundColor: isDark ? "#333" : "none",
                                    borderRadius: "12px",
                                    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
                                    mb: 1,
                                    transition: 'all 0.3s ease',
                                    "&:hover": {
                                        transform: 'scale(1.03)',
                                        backgroundColor: "rgba(135, 206, 250, 0.5)",
                                        boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.2)',
                                    }
                                }}
                                onClick={() => handleOpenEventInfo({
                                    id: item.id,
                                    eventType: item.eventType,
                                    subject: item.subject,
                                    matter: item.matter,
                                    time: item.time,
                                    date: item.date,
                                    ERTime: item.ERTime,
                                    ERDate: item.ERDate,
                                    location: item.location
                                })}
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

export default AdminEventList;