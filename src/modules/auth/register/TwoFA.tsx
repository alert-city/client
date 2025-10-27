'use client';
import React, { useEffect, useState } from 'react';
import {
    Box, Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel, MenuItem, Select, TextField,
    Typography,
    Skeleton,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { GENERATE_2FA, VERIFY_2FA_CODE } from '@/graphql/auth';
import { UPDATE_USER } from '@/graphql/user';
import { ACCOUNT_TYPE, ID, ROLE } from '@/shared/constants/storage';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/utils/redirection';
import Cookies from 'js-cookie';
import { useUserInfoStore } from '@/store/profileState';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const TwoFACodeSchema = z.object({
    twoFACode: z.string().min(6, '2FA code must be at least 6 characters').max(
        6, '2FA code must be at most 6 characters'),
});

type Enable2FAValues = z.infer<typeof TwoFACodeSchema>;

interface TwoFAPageProps {
    isFirstLogin?: boolean;
    defaultValue?: boolean;
    setShow2FA?: (value: boolean) => void;
    set2FAEnabled?: (value: boolean) => void;
}

const appOptions = {
    microsoft: 'microsoft',
    google: 'google',
};

const TwoFAPage: React.FC<TwoFAPageProps> = ({ isFirstLogin = true, defaultValue, setShow2FA, set2FAEnabled }) => {
    const t = useTranslations('TwoFAPage');
    const [generate2FA] = useMutation(GENERATE_2FA);
    const [verify2FACode] = useMutation(VERIFY_2FA_CODE);
    const [updateUser] = useMutation(UPDATE_USER);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>('');
    const [id, setId] = useState<string | null>('');
    const [accountType, setAccountType] = useState<string | undefined>('');
    const [role, setRole] = useState<string[] | []>([]);
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
    const [issuer, setIssuer] = useState<string | undefined>('');
    const [verificationCode, setVerificationCode] = useState<string | null>('');
    const [verificationInfo, setVerificationInfo] = useState<string | null>('');
    const [verificationError, setVerificationError] = useState<string | null>('');
    const [showEnableButton, setShowEnableButton] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { twoFARedirect } = useLogin();
    const { setTwoFAStatus } = useUserInfoStore();
    const [showSkeleton, setShowSkeleton] = useState(false);
    const cardWidth = isFirstLogin ? { xs: '95%', sm: '80%', md: '60%' } : '100%';
    const [showToDashboard, setShowToDashboard] = useState(false);

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<Enable2FAValues>({
        resolver: zodResolver(TwoFACodeSchema),
        defaultValues: {
            twoFACode: '',
        },
    });

    useEffect(() => {
        const id = localStorage.getItem(ID);
        const accountType = Cookies.get(ACCOUNT_TYPE);
        const role = Cookies.get(ROLE)?.split(',');
        id && setId(id);
        accountType && setAccountType(accountType || '');
        role && setRole(role);
    }, []);

    useEffect(() => {
        setIs2FAEnabled(defaultValue ?? false);
    }, [defaultValue]);

    const handleCheckboxChange = () => {
        setIs2FAEnabled(!is2FAEnabled);
    };

    const changeIsFirstLogin = async () => {
        const response = await updateUser({
            variables: {
                id: id,
                input: {
                    isFirstLogin: false,
                },
            },
        });
        if (response.data.updateUser) {
            twoFARedirect({ accountType, role });
        }
    };

    const generateQrCodeUrl = async (issuer: string) => {
        setShowSkeleton(true);
        setLoading(true);
        setIssuer(issuer);
        setVerificationCode('');
        setVerificationInfo('');
        setVerificationError('');

        try {
            const { data } = await generate2FA({
                variables: {
                    issuer,
                    id: id,
                },
            });

            if (data?.generate2FA) {
                setQrCodeUrl(data.generate2FA.qrCodeUrl);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
        } finally {
            setShowSkeleton(false);
        }
    };

    const handleEnable2FA = async (data: Enable2FAValues) => {
        setLoading(true);
        try {
            const { data } = await verify2FACode({
                variables: {
                    id: id,
                    code: verificationCode,
                },
            });
            if (data?.verify2FACode) {
                const response = await updateUser({
                    variables: {
                        id: id,
                        input: {
                            is2FAEnabled: true,
                        },
                    },
                });
                if (response.data.updateUser) {
                    setShowEnableButton(false);
                    set2FAEnabled && set2FAEnabled(true);
                    setShowToDashboard(true);
                    reset();
                    let countdown = 4;
                    if (isFirstLogin) {
                        setVerificationInfo(
                            `${t('verificationInfo')} ${countdown} ${t('seconds')}`);
                    } else {
                        setVerificationInfo(t('verificationInfoShort'));
                    }
                    const intervalId = setInterval(async () => {
                        countdown -= 1;
                        if (isFirstLogin) {
                            setVerificationInfo(
                                `${t('verificationInfo')} ${countdown} ${t('seconds')}`);
                        } else {
                            setVerificationInfo(t('verificationInfoShort'));
                        }
                        if (countdown === 0) {
                            clearInterval(intervalId);
                            if (isFirstLogin) {
                                await changeIsFirstLogin();
                            } else {
                                setVerificationInfo(t('verificationInfoShort'));
                                setShow2FA && setShow2FA(false);
                                setTwoFAStatus(true);
                            }
                        }
                    }, 1000);
                }
            }
        } catch (err) {
            setVerificationError((err as Error).message || t('default2FAError'));
        } finally {
            setLoading(false);
        }
    };

    const handleSkip2FA = async () => {
        await changeIsFirstLogin();
    };

    const handleIssuerChange = async (e: string) => {
        setShowEnableButton(true);
        await generateQrCodeUrl(e);
    };

    return (
        <Card
            sx={{
                padding: { xs: '16px', sm: '20px', md: '24px' },
                width: cardWidth,
                maxWidth: { xs: '100%', sm: '500px', md: '600px' },
                borderRadius: '16px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                margin: { xs: '16px', sm: '0' },
            }}
        >
            <CardContent
                component="form"
                onSubmit={handleSubmit(handleEnable2FA)}
                sx={{ padding: { xs: '8px', sm: '16px' } }}
            >
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '1.125rem', sm: '1.25rem' },
                        mb: { xs: 2, sm: 3 },
                    }}
                >
                    {t('protectDescription')}
                </Typography>
                <FormGroup>
                    {isFirstLogin &&
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={is2FAEnabled || false}
                                    onChange={handleCheckboxChange}
                                    name="enable2FA"
                                    value={is2FAEnabled}
                                    sx={{
                                        padding: { xs: '6px', sm: '9px' },
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    {t('enableDescription')}
                                </Typography>
                            }
                        />
                    }
                    {(is2FAEnabled || !isFirstLogin) && (
                        <>
                            <FormControl fullWidth margin="normal">
                                <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    {t('chooseApp')}
                                </InputLabel>
                                <Select
                                    label={t('chooseApp')}
                                    value={issuer}
                                    onChange={(e) => handleIssuerChange(e.target.value as string)}
                                    variant={'outlined'}
                                    sx={{
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                >
                                    <MenuItem value={appOptions.microsoft}>{t('microsoftApp')}</MenuItem>
                                    <MenuItem value={appOptions.google}>{t('googleApp')}</MenuItem>
                                </Select>
                            </FormControl>
                            {issuer && (
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        gutterBottom
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                            textAlign: 'center',
                                            px: { xs: 1, sm: 0 },
                                        }}
                                    >
                                        {t('scanDescription1')} {issuer === 'microsoft' ? t('microsoftApp') : t('googleApp')} {t(
                                        'scanDescription2')}
                                    </Typography>
                                    <Box
                                        className="flex justify-center"
                                        sx={{
                                            mt: 2,
                                            mb: 1,
                                            px: { xs: 2, sm: 0 },
                                        }}
                                    >
                                        {showSkeleton &&
                                            <Skeleton
                                                variant="rectangular"
                                                sx={{
                                                    width: { xs: 120, sm: 150 },
                                                    height: { xs: 120, sm: 150 },
                                                }}
                                            />
                                        }
                                        {!showSkeleton &&
                                            <Box display="flex" justifyContent="center">
                                                <img
                                                    src={qrCodeUrl || ''}
                                                    alt={t('qrCodeAlt')}
                                                    style={{
                                                        width: window.innerWidth < 600 ? '120px' : '150px',
                                                        height: window.innerWidth < 600 ? '120px' : '150px',
                                                    }}
                                                    hidden={showSkeleton}
                                                />
                                            </Box>
                                        }
                                    </Box>
                                    <TextField
                                        label={t('enterCode')}
                                        fullWidth
                                        margin="normal"
                                        value={verificationCode}
                                        {...register('twoFACode', {
                                            onChange: (e) => {
                                                setVerificationCode(e.target.value);
                                                setVerificationError(null);
                                                setVerificationInfo(null);
                                            },
                                        })}
                                        error={!!errors.twoFACode}
                                        helperText={errors.twoFACode?.message}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                            <Box className="flex justify-center" sx={{ px: { xs: 1, sm: 0 } }}>
                                {verificationInfo && (
                                    <Typography
                                        sx={{
                                            mt: 1.5,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                            textAlign: 'center',
                                        }}
                                        color="primary"
                                        variant="body2"
                                    >
                                        {verificationInfo}
                                    </Typography>
                                )}
                                {verificationError &&
                                    <Typography
                                        sx={{
                                            mt: 1.5,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                            textAlign: 'center',
                                        }}
                                        color="error"
                                        variant="body2"
                                    >
                                        {verificationError}
                                    </Typography>
                                }
                            </Box>
                            <Box>
                                {showEnableButton &&
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            mt: 2,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            padding: { xs: '8px 16px', sm: '10px 20px' },
                                        }}
                                        type="submit"
                                    >
                                        {t('enable')}
                                    </Button>
                                }
                                {(showToDashboard && isFirstLogin) &&
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            mt: 2,
                                            mb: 4,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            padding: { xs: '8px 16px', sm: '10px 20px' },
                                        }}
                                        type="button"
                                        onClick={() => twoFARedirect({ accountType, role })}
                                    >
                                        {t('goToDashboard')}
                                    </Button>
                                }
                            </Box>
                        </>
                    )}
                    {(!is2FAEnabled && isFirstLogin) &&
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            sx={{
                                mt: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                padding: { xs: '8px 16px', sm: '10px 20px' },
                            }}
                            type="button"
                            onClick={handleSkip2FA}
                        >
                            {t('skip')}
                        </Button>
                    }
                </FormGroup>
            </CardContent>
            <LoadingOverlay loading={loading} />
        </Card>
    );
};


export default TwoFAPage;