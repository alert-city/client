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
            sx={{
                minWidth: "500px",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
                transition: "transform 0.3s ease-in-out",
                "& .MuiPaper-root": {
                    minWidth: "500px",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)"
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: isDark ? "#ddd" : "#333" }}>
                {windowTitle}
            </DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={2}
                    width="100%"
                    justifyContent="space-between"
                    sx={{
                        flexDirection: { xs: 'column', md: 'row' },
                        paddingBottom: 2
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 5px)' },
                            borderRadius: '12px',
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                            padding: 1,
                            backgroundColor: isDark ? "#222" : "#f9f9f9"
                        }}
                    >
                        <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
                            {t("eventDescription")}
                        </Typography>
                        <Typography variant='body2'>
                            {t("subject")}: {subject}
                        </Typography>
                        <Typography variant='body2'>
                            {t("matter")}: {matter}
                        </Typography>
                        <Typography variant='body2'>
                            {t("location")}: {location ? location : "N/A"}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 calc(40% - 5px)' },
                            borderRadius: '12px',
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                            padding: 1,
                            backgroundColor: isDark ? "#222" : "#f9f9f9"
                        }}
                    >
                        <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
                            {t("eventTime")}
                        </Typography>
                        <Box gap={2}>
                            <Typography variant='body2'>
                                {t("startTime")}: {time.split(" ")[0]}
                            </Typography>
                            <Typography variant='body2'>
                                {t("startDate")}: {date}
                            </Typography>
                        </Box>
                        <Box gap={2}>
                            <Typography variant='body2'>
                                {t("recoveryTime")}: {ERTime ? ERTime.split(" ")[0] : "N/A"}
                            </Typography>
                            <Typography variant='body2'>
                                {t("recoveryDate")}: {ERDate ? ERDate : "N/A"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}