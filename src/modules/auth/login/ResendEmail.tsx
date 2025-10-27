import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { RESEND_ACTIVATION_LINK_EMAIL } from '@/graphql/user';
import { useMutation } from '@apollo/client';
import { useTranslations } from 'next-intl';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useRouter } from '@/i18n/routing';
import { RouteConfig } from '@/routes/route';

interface ResendEmailProps {
    open: boolean;
    handleClose: () => void;
    id: string;
    isRegister?: boolean;
}

const ResendActivationEmail: React.FC<ResendEmailProps> = ({ open, handleClose, id, isRegister }) => {
    const t = useTranslations('LoginPage');
    const [resendActivationLinkEmail] = useMutation(RESEND_ACTIVATION_LINK_EMAIL);
    const [loading, setLoading] = useState(false);
    const [resendInfo, setResendInfo] = useState<string | null>(null);
    const [resendError, setResendError] = useState<string | null>(null);
    const [showClose, setShowClose] = useState(false);
    const router = useRouter();

    const handleResend = async () => {
        setLoading(true);
        try {
            const { data } = await resendActivationLinkEmail({
                variables: { id: id, emailInfoType: 1 },
            });

            if (data?.resendActivationLinkEmail) {
                setShowClose(true);
                let countdown = 4;
                setResendInfo(`${t('resendSuccess')} ${countdown} ${t('seconds')}`);
                const intervalId = setInterval(() => {
                    countdown -= 1;
                    setResendInfo(`${t('resendSuccess')} ${countdown} ${t('seconds')}`);
                    if (countdown === 0) {
                        clearInterval(intervalId);
                        setResendInfo('');
                        setResendError('');
                        if (isRegister) {
                            handleClose();
                            router.push(RouteConfig.Login.Path);
                        }
                        !isRegister && handleClose();
                    }
                }, 1000);
            }
        } catch (error) {
            setResendError(t('resendError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            component={Dialog}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            PaperProps={{
                sx: {
                    padding: { xs: '16px', sm: '20px' },
                    borderRadius: '12px',
                    margin: { xs: '16px', sm: '32px' },
                    width: { xs: 'calc(100% - 32px)', sm: 'auto' },
                    maxWidth: { xs: '100%', sm: '444px' },
                },
            }}
        >
            <CardContent sx={{ padding: { xs: '8px', sm: '16px' } }}>
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        padding: { xs: '8px 16px', sm: '16px 24px' },
                    }}
                >
                    {t('resendEmailTitle')}
                </DialogTitle>
                <DialogContent sx={{ padding: { xs: '8px 16px', sm: '20px 24px' } }}>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{
                            textAlign: 'center',
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            color: '#666',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                        }}
                    >
                        {isRegister ? t('resendEmailDescriptionRegister') : t('resendEmailDescription')}
                    </DialogContentText>
                </DialogContent>
                <Box
                    sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        px: { xs: 2, sm: 0 },
                    }}
                >
                    {resendInfo && (
                        <Typography
                            sx={{
                                mt: 1.5,
                                display: 'flex',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: 'primary.main',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                            }}
                            variant="body2"
                        >
                            {resendInfo}
                        </Typography>
                    )}
                    {resendError && (
                        <Typography
                            sx={{
                                mt: 1.5,
                                display: 'flex',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: 'error.main',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                            }}
                            variant="body2"
                        >
                            {resendError}
                        </Typography>
                    )}
                </Box>
                <DialogActions
                    sx={{
                        display: 'flex',
                        gap: { xs: 2, sm: 4 },
                        justifyContent: 'center',
                        paddingBottom: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        px: { xs: 2, sm: 0 },
                    }}
                >
                    {!showClose &&
                        <>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                color="secondary"
                                sx={{
                                    width: { xs: '100%', sm: 100 },
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                }}
                            >
                                {t('cancel')}
                            </Button>

                            <Button
                                onClick={handleResend}
                                variant="contained"
                                color="primary"
                                sx={{
                                    width: { xs: '100%', sm: 100 },
                                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                }}
                            >
                                {t('resend')}
                            </Button>
                        </>
                    }
                    {showClose &&
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            color="primary"
                            sx={{
                                width: { xs: '100%', sm: 100 },
                                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                            }}
                        >
                            {t('close')}
                        </Button>
                    }
                </DialogActions>
            </CardContent>
            <LoadingOverlay loading={loading} />
        </Card>
    );
};

export default ResendActivationEmail;