'use client';
import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Collapse, InputAdornment,
} from '@mui/material';
import { getCodeSchema, resetPasswordSchema } from '@/validation/schemas/reset-password/reset-password.schema';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { GET_VERIFICATION_CODE, RESET_PASSWORD } from '@/graphql/user';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN, USERNAME } from '@/shared/constants/storage';
import { useRevokeTokens } from '@/hooks/useRevokeTokens';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import { RouteConfig } from '@/routes/route';
import Cookies from 'js-cookie';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useTranslations } from 'next-intl';

type GetCodeFormValues = z.infer<typeof getCodeSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const t = useTranslations('ResetPasswordPage');
  const revokeTokens = useRevokeTokens();
  const router = useRouter();
  const [getCode] = useMutation(GET_VERIFICATION_CODE);
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [getCodeReminder, setGetCodeReminder] = useState<string | null>(null);
  const [getCodeError, setGetCodeError] = useState<string | null>(null);
  const [resetReminder, setResetReminder] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<boolean | null>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? Cookies.get(ACCESS_TOKEN) : null;
    const user = localStorage.getItem(USERNAME);
    setAccessToken(accessToken || null);
    setUsername(user);
  }, []);

  // useForm to get verification code
  const {
    register: registerGetCode,
    handleSubmit: handleSubmitGetCode,
    getValues: getCodeValue,
    setValue: setCodeValue,
    reset: resetGetCode,
    formState: { errors: getCodeErrors },
  } = useForm<GetCodeFormValues>({
    resolver: zodResolver(getCodeSchema),
    defaultValues: {
      username: '',
    },
  });

  useEffect(() => {
    if (username) {
      setCodeValue('username', username);
    }
  }, [username, setCodeValue]);

  const {
    register: registerResetPassword,
    handleSubmit: handleSubmitResetPassword,
    setValue: setResetPasswordValue,
    reset: resetResetPassword,
    formState: { errors: resetPasswordErrors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onGetCodeSubmit: SubmitHandler<GetCodeFormValues> = async (data) => {
    setLoading(true);
    setResetPasswordValue('verificationCode', '');
    setIsCodeEntered(false);
    let timeLeft = 60;
    setCountdown(timeLeft);

    const intervalId = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setCountdown(null);
      }
    }, 1000);

    try {
      const response = await getCode(
        { variables: { input: { username: data.username, emailInfoType: 1 } } },
      );
      if (response.data.sendVerificationEmail) {
        setGetCodeReminder(t('getCodeReminder'));
        setGetCodeError(null);
        setLoading(false);
      }
    } catch (err) {
      setGetCodeError((err as Error).message || 'Get Code failed');
      setGetCodeReminder(null);
    } finally {
      setLoading(false);
    }
  };

  const onResetPasswordSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    setLoading(true);
    const username = getCodeValue('username');
    try {
      const response = await resetPassword(
        {
          variables: {
            username: username,
            input: {
              password: data.password,
              confirmPassword: data.confirmPassword,
              verificationCode: data.verificationCode.trim(),
            },
          },
        },
      );
      if (response.data.resetPassword) {
        setCodeValue('username', '');
        setResetPasswordValue('verificationCode', '');
        setResetPasswordValue('password', '');
        setResetPasswordValue('confirmPassword', '');
        setGetCodeReminder(null);
        setGetCodeError(null);

        setResetError(null);
        setResetStatus(true);

        let countdown = 4;
        setResetReminder(`${t('resetReminder')} ${countdown} ${t('seconds')}`);
        const intervalId = setInterval(() => {
          countdown -= 1;
          setResetReminder(`${t('resetReminder')} ${countdown} ${t('seconds')}`);
          if (countdown === 0) {
            clearInterval(intervalId);
            revokeTokens();
          }
        }, 1000);
      }
    } catch (err) {
      setResetError((err as Error).message || 'Reset Password failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Container sx={{ borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }} maxWidth="xs">
      {!accessToken &&
        <Box sx={{ position: 'relative', width: '100%', mb: 5 }}>
          <Tooltip title={t('return')} placement="right">
            <IconButton
              onClick={() => router.back()}
              sx={{ position: 'absolute', top: 8 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {t('title')}
        </Typography>
        <Box component="form" onSubmit={handleSubmitGetCode(onGetCodeSubmit)} sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('username')}
                {...registerGetCode('username', {
                  onChange: (e) => {
                    if (e.target.value) {
                      setGetCodeError(null);
                      setResetStatus(null);
                      setIsCodeEntered(false);
                    }
                  },
                })}
                InputProps={{
                  readOnly: !!username,
                  endAdornment: !!username && (
                    <LockIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                  ),
                  style: {
                    backgroundColor: !!username ? '#f0f0f0' : 'inherit', // 背景颜色改变
                  },
                }}
                error={!!getCodeErrors.username}
                helperText={getCodeErrors.username?.message}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ height: '100%' }}
                disabled={!!countdown}
              >
                {`${t('getCode')} ${countdown ? `(${countdown})` : ''}`}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder={t('codePlaceholder')}
                label={t('verificationCode')}
                {...registerResetPassword('verificationCode', {
                  onChange: (e) => {
                    if (e.target.value) {
                      setGetCodeReminder(null);
                      setResetError(null);
                      setResetReminder(null);
                    }
                    if (e.target.value.length >= 6) {
                      setIsCodeEntered(true);
                    } else {
                      setIsCodeEntered(false);
                    }
                  },
                })}
                error={!!resetPasswordErrors.verificationCode}
                helperText={resetPasswordErrors.verificationCode?.message}
              />
            </Grid>
          </Grid>
          <Box>
            {getCodeReminder && (
              <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="primary" variant="body2">
                {getCodeReminder}
              </Typography>
            )}
            {getCodeError && (
              <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error" variant="body2">
                {getCodeError}
              </Typography>
            )}
          </Box>
        </Box>
        <Collapse in={isCodeEntered}>
          <Box component="form" onSubmit={handleSubmitResetPassword(onResetPasswordSubmit)}>
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('newPassword')}
                  type={showPassword ? 'text' : 'password'}
                  {...registerResetPassword('password',
                    {
                      onChange: (e) => {
                        if (e.target.value) {
                          setResetError(null);
                          setResetReminder(null);
                        }
                      },
                    })}
                  error={!!resetPasswordErrors.password}
                  helperText={resetPasswordErrors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle new password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerResetPassword('confirmPassword',
                    {
                      onChange: (e) => {
                        if (e.target.value) {
                          setResetError(null);
                          setResetReminder(null);
                        }
                      },
                    })}
                  error={!!resetPasswordErrors.confirmPassword}
                  helperText={resetPasswordErrors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm new password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Box className="flex justify-center">
              {resetReminder && (
                <Typography sx={{ mt: 1.5, mb: accessToken ? 4 : 0, display: 'flex', justifyContent: 'center' }}
                            color="primary" variant="body2">
                  {resetReminder}
                </Typography>
              )}
              {resetError && (
                <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error" variant="body2">
                  {resetError}
                </Typography>
              )}
            </Box>
            {!resetStatus &&
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 4 }}
                type="submit"
              >
                {t('resetPassword')}
              </Button>}
            {(resetStatus && !accessToken) &&
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 2, mb: 4 }}
                type="button"
                onClick={() => router.push(RouteConfig.Login.Path)}
              >
                {t('returnToLogin')}
              </Button>}
          </Box>
        </Collapse>
      </Box>
      <LoadingOverlay loading={loading} />
    </Container>
  );
};

export default ResetPassword;