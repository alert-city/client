import React, { useEffect } from "react";
import { ID, IS_DARK } from "@/shared/constants/storage";
import { FIND_UNREVIEWED_EVENTS_BY_ID, EVENT_CREATED, EVENT_UPDATED } from "@/graphql/event";
import { useQuery, useSubscription } from "@apollo/client";
import { useTranslations } from "next-intl";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { CardStyle } from "@/modules/dashboard/CardStyle";
import '@fontsource/poppins';

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

const StaffReviewList: React.FC<{
    handleOpenEventInfo: (input: EventValues) => void
}> = ({
          handleOpenEventInfo
      }) => {
    const t = useTranslations("DashboardPage");
    const isDark = localStorage.getItem(IS_DARK) === "1";

    const { data: eventCreated } = useSubscription(EVENT_CREATED);
    const { data: eventUpdated } = useSubscription(EVENT_UPDATED);

    const userId = localStorage.getItem(ID);
    const { data: eventData, refetch } = useQuery(
        FIND_UNREVIEWED_EVENTS_BY_ID,
        {
            variables: { userId: userId },
            skip: !userId,
            fetchPolicy: "no-cache"
        }
    );
    const staffEvents = eventData?.findUnreviewedEventsById || [];

    useEffect(() => {
        if (eventCreated || eventUpdated) {
            refetch();
        }
    }, [eventCreated, eventUpdated])


    return (
        <Card sx={{ ...CardStyle, width: '100%' }}>
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
                    {t("inReview")}: {staffEvents.length}
                </Typography>
                <Box display="flex" flexDirection="column" padding="1px">
                    {staffEvents && staffEvents.map((item: EventValues) => (
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
    );
};

export default StaffReviewList;