import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { FIND_ONE_USER } from '@/graphql/user';
import { FIND_UNREVIEWED_EVENTS_BY_ORG_NAME } from '@/graphql/event';
import { useTranslations } from 'next-intl';
import { ID, IS_DARK } from '@/shared/constants/storage';
import { Box, Typography, Button, Card, TextField } from '@mui/material';
import '@fontsource/poppins';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


interface DisplayUnreviewedEventsProp {
    handleOpenConfirmDialog: (eventId: string, passed: boolean, reviewComment: string | null) => void;
    reload: boolean;
};
type EventValues = {
    id: string;
    submitter: {
        firstName: string,
        lastName: string
    };
    orgName: string;
    subject: string;
    matter: string;
    time: string;
    date: string;
    ERDate: string | null;
    ERTime: string | null;
    location: string | null;
};

const DisplayUnreviewedEvents: React.FC<DisplayUnreviewedEventsProp> = ({
    handleOpenConfirmDialog, reload
}) => {
    const t = useTranslations("ReviewPage");
    const isDark = localStorage.getItem(IS_DARK) === "1";
    const [reviewComment, setReviewComment] = useState<string | null>(null);
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
        FIND_UNREVIEWED_EVENTS_BY_ORG_NAME,
        {
            variables: { orgName: orgName },
            skip: !orgName,
            fetchPolicy: "no-cache"
        }
    )
    const orgEvents = eventData?.findUnreviewedEventsByOrgName;

    useEffect(() => {
        if (reload) {
            refetch();
        }
    }, [reload]);

    return (
        <Card
            sx={{
                minHeight: "80vh",
                maxHeight: "100vh",
                maxWidth: 800,
                overflow: "auto",
                width: "100%",
                borderRadius: '16px',
                padding: { xs: 1, sm: 2, md: 4 },
                fontFamily: "Poppins, sans-seirf",
            }}
        >
            <Typography variant='h4' gutterBottom>
                In Review: {orgEvents ? orgEvents.length : "Loading ..."}
            </Typography>
            <Box width="100%">
                {orgEvents && orgEvents.map((item: EventValues) => (
                    <Card
                        key={item.id}
                        sx={{
                            gap: 2,
                            mb: 2,
                            borderRadius: '16px',
                            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.1)',
                            border: isDark ? "1px solid #fff" : "none",
                            padding: { xs: 1, sm: 2, md: 2 },
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            "&:hover": {
                                transform: 'translateY(-5px)',
                                border: isDark ? "1px solid #0cc" : "none",
                                boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.2)',
                            }
                        }}
                    >
                        <Box
                            display="flex"
                            flexWrap="wrap"
                            gap={2}
                            width="100%"
                            justifyContent="space-between"
                            sx={{
                                flexDirection: { xs: 'column', md: 'row' }
                            }}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                sx={{
                                    flex: { xs: '1 1 100%', md: '1 1 calc(35% - 8px)' },
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    padding: 1,
                                    mb: 0.5,
                                    backgroundColor: isDark ? "#333" : "none"
                                }}
                            >
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                    {t("eventDescription")}
                                </Typography>
                                <Typography variant='body2'>
                                    {t("submitter")}: {item.submitter.firstName} {item.submitter.lastName}
                                </Typography>
                                <Typography variant='body2'>
                                    {t("subject")}: {item.subject}
                                </Typography>
                                <Typography variant='body2'>
                                    {t("matter")}: {item.matter}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                sx={{
                                    flex: { xs: '1 1 100%', md: '1 1 calc(30% - 8px)' },
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    padding: 1,
                                    mb: 0.5,
                                    backgroundColor: isDark ? "#333" : "none"
                                }}
                            >
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                    {t("eventTime")}
                                </Typography>
                                <Box gap={2}>
                                    <Typography variant='body2'>
                                        {t("startTime")}: {item.time.split(" ")[0]}
                                    </Typography>
                                    <Typography variant='body2'>
                                        {t("startDate")}: {item.date}
                                    </Typography>
                                </Box>
                                <Box gap={2}>
                                    <Typography variant='body2'>
                                        {t("recoveryTime")}: {item.ERTime ? item.ERTime.split(" ")[0] : "N/A"}
                                    </Typography>
                                    <Typography variant='body2'>
                                        {t("recoveryDate")}: {item.ERDate ? item.ERDate : "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                sx={{
                                    flex: { xs: '1 1 100%', md: '1 1 calc(25% - 8px)' },
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    padding: 1,
                                    mb: 0.5,
                                    backgroundColor: isDark ? "#333" : "none"
                                }}
                            >
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                    {t("eventLocation")}
                                </Typography>
                                <Typography variant='body2'>
                                    {t("location")}: {item.location ? item.location : "N/A"}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                sx={{
                                    width: "100%",
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    padding: 1,
                                    mb: 0.5,
                                    backgroundColor: isDark ? "#333" : "none"
                                }}
                            >
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                    {t("eventReview")}
                                </Typography>
                                <TextField
                                    label={t("reviewComment")}
                                    onChange={(e) => {
                                        setReviewComment(e.target.value);
                                    }}
                                    sx={{
                                        borderRadius: '12px',
                                        mb: 1
                                    }}
                                />
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    gap={2}
                                >
                                    <Button
                                        variant='contained'
                                        startIcon={<HighlightOffIcon />}
                                        sx={{
                                            width: '120px',
                                            backgroundColor: 'rgba(180, 0, 0, 0.8)',
                                            fontWeight: 700,
                                            color: "#fff",
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: "scale(1.05)",
                                                fontWeight: 1000
                                            }
                                        }}
                                        onClick={() => handleOpenConfirmDialog(item.id, false, reviewComment)}
                                    >
                                        {t("reject")}
                                    </Button>
                                    <Button
                                        variant='contained'
                                        startIcon={<CheckCircleOutlineIcon />}
                                        sx={{
                                            width: '120px',
                                            backgroundColor: 'rgba(0, 150, 10, 0.8)',
                                            fontWeight: 700,
                                            color: "#fff",
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: "scale(1.05)",
                                                fontWeight: 1000
                                            }
                                        }}
                                        onClick={() => handleOpenConfirmDialog(item.id, true, reviewComment)}
                                    >
                                        {t("approve")}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Card>
    );
};

export default DisplayUnreviewedEvents;