'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Button,
    CircularProgress,
    Box,
    Alert,
    AlertTitle,
    CardMedia, Card,
} from '@mui/material';
import { VALIDATE_EMAIL_LINK, RESEND_ACTIVATION_LINK_EMAIL } from '@/graphql/user';
import { useMutation } from '@apollo/client';
import { RouteConfig } from '@/routes/route';
import { useTranslations } from 'next-intl';
import getIconUrl from '@/utils/getIconUrl';

const emailInfoType = {
    1: {
        title: '1.title',
        successMessage: '1.successMessage',
        successSubMessage: '1.successSubMessage',
        resendButtonText: '1.resendButtonText',
        errorTitle: '1.errorTitle',
        resendSuccessMessage: '1.resendSuccessMessage',
        resendSuccessSubMessage: '1.resendSuccessSubMessage',
        resendErrorMessage: '1.resendErrorMessage',
    },
    2: {
        title: '2.title',
        successMessage: '2.successMessage',
        successSubMessage: '2.successSubMessage',
        resendButtonText: '2.resendButtonText',
        errorTitle: '2.errorTitle',
        resendSuccessMessage: '2.resendSuccessMessage',
        resendSuccessSubMessage: '2.resendSuccessSubMessage',
        resendErrorMessage: '2.resendErrorMessage',
    },
};


const ValidateEmailPage: React.FC = () => {
    const t = useTranslations('ValidationEmailPage');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');
    const username = searchParams?.get('username');
    const newUsername = searchParams?.get('newUsername');
    const id = searchParams?.get('id');
    const emailType = searchParams?.get('emailInfoType') as '1' | '2';
    const iconUrl = getIconUrl();
    const [validateEmailLink] = useMutation(VALIDATE_EMAIL_LINK);
    const [resendActivationLinkEmail] = useMutation(RESEND_ACTIVATION_LINK_EMAIL);
    const [canRedirect, setCanRedirect] = useState(false);
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [resendStatus, setResendStatus] = useState<'loading' | 'success' | 'error' | null>(null);
    const [activationError, setActivationError] = useState<string | null>(null);
    const [resendError, setResendError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            setStatus('loading');
            const activateAccount = async () => {
                try {
                    const { data } = await validateEmailLink({
                        variables: { token, emailInfoType: parseInt(emailType, 10) },
                    });

                    if (data?.validateEmailLink) {
                        setStatus('success');
                        setCanRedirect(true);
                    }
                } catch (error) {
                    setStatus('error');
                    setActivationError((error as Error).message);
                }
            };
            activateAccount().then();
        }
    }, [token]);

    const handleResendLinkEmail = async () => {
        setResendStatus('loading');
        setStatus(null);
        try {
            const variables: { id: string, username: string; emailInfoType: number; newUsername?: string } = {
                username: username || '',
                id: id || '',
                emailInfoType: parseInt(emailType, 10),
            };
            if (newUsername) {
                variables.newUsername = newUsername;
            }
            const { data } = await resendActivationLinkEmail({ variables });
            if (data.resendActivationLinkEmail) {
                setResendStatus('success');
                setActivationError(null);
                setCanRedirect(true);
            }
        } catch (err) {
            setResendStatus('error');
            setResendError((err as Error).message);
        }
    };

    const emailInfo = emailInfoType[emailType] || emailInfoType[1];

    return (
        <div className="min-h-screen flex justify-center items-center px-4 py-6">
            <Card
                sx={{
                    padding: { xs: '24px', sm: '32px', md: '40px' },
                    borderRadius: '16px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    maxWidth: { xs: '100%', sm: '500px', md: '600px' },
                    width: '100%',
                }}
            >
                <Container
                    maxWidth="sm"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: { xs: '0', sm: '0 16px' },
                    }}
                >
                    <CardMedia
                        component="img"
                        height="5"
                        image={iconUrl}
                        alt={t('iconAlt')}
                        sx={{
                            height: { xs: 80, sm: 100 },
                            width: { xs: 80, sm: 100 },
                            objectFit: 'contain',
                            mb: { xs: 3, sm: 4 },
                        }}
                    />
                    <Box textAlign="center" sx={{ width: '100%' }}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                mb: 2,
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                            }}
                        >
                            {t(emailInfo.title)}
                        </Typography>
                        {(status === 'loading' || resendStatus === 'loading') && (
                            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 3 }}>
                                <CircularProgress
                                    sx={{
                                        width: { xs: '40px !important', sm: '48px !important' },
                                        height: { xs: '40px !important', sm: '48px !important' },
                                    }}
                                />
                            </Box>
                        )}
                        {status === 'success' && (
                            <Alert
                                severity="success"
                                sx={{
                                    textAlign: 'left',
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                    },
                                }}
                            >
                                <AlertTitle sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                                    {t('successTitle')}
                                </AlertTitle>
                                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    {t(emailInfo.successMessage)}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{
                                        color: 'blue',
                                        mt: 1,
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                >
                                    <strong>{t(emailInfo.successSubMessage)}</strong>
                                </Typography>
                            </Alert>
                        )}
                        {status === 'error' && (
                            <Alert
                                severity="error"
                                sx={{
                                    textAlign: 'left',
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                    },
                                }}
                            >
                                <AlertTitle sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                                    {t('errorTitle')}
                                </AlertTitle>
                                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    {`${t(emailInfo.errorTitle)}: ${activationError}!`}
                                </Typography>
                            </Alert>
                        )}

                        {resendStatus === 'success' && (
                            <Alert
                                severity="success"
                                sx={{
                                    textAlign: 'left',
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                    },
                                }}
                            >
                                <AlertTitle sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                                    {t('successTitle')}
                                </AlertTitle>
                                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    {t(emailInfo.resendSuccessMessage)}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{
                                        color: 'blue',
                                        mt: 1,
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                >
                                    <strong>{t(emailInfo.resendSuccessSubMessage)}</strong>
                                </Typography>
                            </Alert>
                        )}

                        {resendStatus === 'error' && (
                            <Alert
                                severity="error"
                                sx={{
                                    mt: 2,
                                    textAlign: 'left',
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                    },
                                }}
                            >
                                <AlertTitle sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                                    {t('errorTitle')}
                                </AlertTitle>
                                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    {`${t(emailInfo.resendErrorMessage)}: ${resendError}!`}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{
                                        mt: 1,
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                >
                                    {t('tryAgain')}
                                </Typography>
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: { xs: 2, sm: 2 },
                                mt: { xs: 3, sm: 4 },
                            }}
                        >
                            {activationError &&
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleResendLinkEmail}
                                    disabled={resendStatus === 'loading'}
                                    sx={{
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        padding: { xs: '8px 16px', sm: '10px 20px' },
                                    }}
                                >
                                    {resendStatus === 'loading' ? t('resending') : t(emailInfo.resendButtonText)}
                                </Button>
                            }
                            {canRedirect &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => router.push(RouteConfig.Login.Path)}
                                    sx={{
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        padding: { xs: '8px 16px', sm: '10px 20px' },
                                    }}
                                >
                                    {t('returnToLogin')}
                                </Button>
                            }
                        </Box>
                    </Box>
                </Container>
            </Card>
        </div>
    );
};

export default ValidateEmailPage;