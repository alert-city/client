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
import { getPublicRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';
import { AUTH_TOKEN, USERNAME } from '@/shared/constants/storage';
import { useRevokeTokens } from '@/hooks/useRevokeTokens';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';

// get verification code schema
type GetCodeFormValues = z.infer<typeof getCodeSchema>;
// get reset password schema
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const revokeTokens = useRevokeTokens();
  const router = useRouter();
  const [getCode] = useMutation(GET_VERIFICATION_CODE);
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [getCodeReminder, setGetCodeReminder] = useState<string | null>(null);
  const [getCodeError, setGetCodeError] = useState<string | null>(null);
  const [resetReminder, setResetReminder] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetStatus, setResetStatus] = useState<boolean | null>(false);
  const [key, setKey] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    const user = localStorage.getItem(USERNAME);
    setAuthToken(token);
    setUsername(user);
  }, []);

  // useForm to get verification code
  const {
    register: registerGetCode,
    handleSubmit: handleSubmitGetCode,
    getValues: getCodeValue,
    setValue: setCodeValue,
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

  // useForm to reset password
  const {
    register: registerResetPassword,
    handleSubmit: handleSubmitResetPassword,
    setValue: setResetPasswordValue,
    formState: { errors: resetPasswordErrors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onGetCodeSubmit: SubmitHandler<GetCodeFormValues> = async (data) => {
    setResetPasswordValue('verificationCode', '');
    setIsCodeEntered(false);
    let timeLeft = 60; // 1 minute
    setCountdown(timeLeft);

    const intervalId = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setCountdown(null);
      }
    }, 1000); // update every 1 second

    try {
      const response = await getCode(
        { variables: { input: { username: data.username } } },
      );
      if (response.data.sendVerificationEmail) {
        setGetCodeReminder('Verification code has been sent to your email, it will expire in 10 minutes.');
        setGetCodeError(null);
      }
    } catch (err) {
      setGetCodeError((err as Error).message || 'Get Code failed');
      setGetCodeReminder(null);
    }
  };

  const onResetPasswordSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
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
        setResetReminder('Reset Password successfully');
        setResetError(null);
        setResetStatus(true);
        setKey(prevKey => prevKey + 1); // reset form
        setTimeout(async () => {
          if (authToken) {
            await revokeTokens();
          }
        }, 3000);
      }
    } catch (err) {
      setResetError((err as Error).message || 'Reset Password failed');
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
      {!authToken &&
        <Box sx={{ position: 'relative', width: '100%', mb: 5 }}>
          <Tooltip title="Return" placement="right">
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
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmitGetCode(onGetCodeSubmit)} sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                key={key}
                fullWidth
                label="Username"
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
            <Grid item xs={12}>
              <TextField
                key={key}
                fullWidth
                label="Verification Code"
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
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                key={key}
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ height: '100%' }}
                disabled={!!countdown}
              >
                {`Get Code ${countdown ? `(${countdown})` : ''}`}
              </Button>
            </Grid>
          </Grid>
          <Box>
            {getCodeReminder && (
              <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="primary" variant="body2">
                {`Verification code has been sent to your email, it will expire in 10 minutes.`}
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
                  key={key}
                  fullWidth
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  {...registerResetPassword('password')}
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
                  key={key}
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerResetPassword('confirmPassword')}
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
                <Typography sx={{ mt: 1.5, mb: authToken ? 4 : 0, display: 'flex', justifyContent: 'center' }}
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
                Reset Password
              </Button>}
            {(resetStatus && !authToken) &&
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 2, mb: 4 }}
                type="button"
                onClick={() => router.push(getPublicRouteByKey(ROUTE_KEY.LOGIN).path)}
              >
                Return to Login
              </Button>}
          </Box>
        </Collapse>
      </Box>
    </Container>
  );
};

export default ResetPassword;