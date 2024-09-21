import React from "react";
import { ID, IS_DARK } from "@/shared/constants/storage";
import { FIND_UNREVIEWED_EVENTS_BY_ORG_NAME } from "@/graphql/event";
import { FIND_ONE_USER } from "@/graphql/user";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { CardStyle } from "@/modules/dashboard/CardStyle";
import '@fontsource/poppins';

type EventValues = {
    id: string;
    subject: string;
    matter: string;
    time: string;
    date: string;
    ERTime: string | null;
    ERDate: string | null;
    location: string | null;
};

const AdminReviewList: React.FC = () => {
    const t = useTranslations("DashboardPage");
    const isDark = localStorage.getItem(IS_DARK) === "1";

    const userId = localStorage.getItem(ID);
    const { data: userData } = useQuery(
        FIND_ONE_USER,
        {
            variables: { id: userId },
            skip: !userId
        }
    );
    const orgName = userData?.findOneUser?.orgName;
    const { data: eventData } = useQuery(
        FIND_UNREVIEWED_EVENTS_BY_ORG_NAME,
        {
            variables: { orgName: orgName },
            skip: !orgName,
            fetchPolicy: "no-cache"
        }
    );
    const orgEvents = eventData?.findUnreviewedEventsByOrgName || [];

    return (
        <Card sx={CardStyle}>
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
                    {t("inReview")}: {orgEvents.length}
                </Typography>
                <Box display="flex" flexDirection="column" padding="1px">
                    {orgEvents && orgEvents.map((item: EventValues) => (
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
    );
};

export default AdminReviewList;