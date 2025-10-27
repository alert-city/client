import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { IS_DARK } from '@/shared/constants/storage';
import "@fontsource/poppins";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} timeout={1000} {...props} />;
});

interface DisplayEventInfoProps {
    open: boolean;
    handleClose: () => void;
    windowTitle: string;
    subject: string;
    matter: string;
    time: string;
    date: string;
    ERTime: string | null;
    ERDate: string | null;
    location: string | null;
};

export default function DisplayEventInfo(
    {
        open,
        handleClose,
        windowTitle,
        subject,
        matter,
        time,
        date,
        ERTime,
        ERDate,
        location
    }: DisplayEventInfoProps
) {
    const t = useTranslations("ReviewPage");
    const isDark = localStorage.getItem(IS_DARK) === "1";

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="event-slide-description"
            fullScreen={false}
            sx={{
                "& .MuiDialog-paper": {
                    width: { xs: '95%', sm: '90%', md: '600px' },  
                    maxWidth: { xs: '95%', sm: '90%', md: '600px' },
                    margin: { xs: 1, sm: 2 },
                    borderRadius: { xs: '12px', md: '16px' },
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)"
                }
            }}
        >
            <DialogTitle sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },  
                color: isDark ? "#ddd" : "#333",
                padding: { xs: 2, sm: 3 } 
            }}>
                {windowTitle}
            </DialogTitle>
            <DialogContent sx={{ padding: { xs: 2, sm: 3 } }}>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={{ xs: 1.5, sm: 2 }}  
                    width="100%"
                    justifyContent="space-between"
                    sx={{
                        flexDirection: { xs: 'column', md: 'row' },
                        paddingBottom: { xs: 1, sm: 2 }
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                            borderRadius: { xs: '8px', sm: '12px' },
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                            padding: { xs: 1.5, sm: 2 }, 
                            backgroundColor: isDark ? "#222" : "#f9f9f9"
                        }}
                    >
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                fontSize: { xs: '1rem', sm: '1.25rem' }  
                            }}
                        >
                            {t("eventDescription")}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}  
                        >
                            {t("subject")}: {subject}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                            {t("matter")}: {matter}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                            {t("location")}: {location ? location : "N/A"}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                            borderRadius: { xs: '8px', sm: '12px' },
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                            padding: { xs: 1.5, sm: 2 },
                            backgroundColor: isDark ? "#222" : "#f9f9f9"
                        }}
                    >
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 'bold',
                                mb: 1,
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                        >
                            {t("eventTime")}
                        </Typography>
                        <Box gap={{ xs: 1, sm: 2 }}>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                                {t("startTime")}: {time.split(" ")[0]}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                                {t("startDate")}: {date}
                            </Typography>
                        </Box>
                        <Box gap={{ xs: 1, sm: 2 }} mt={1}>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                                {t("recoveryTime")}: {ERTime ? ERTime.split(" ")[0] : "N/A"}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                                {t("recoveryDate")}: {ERDate ? ERDate : "N/A"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}