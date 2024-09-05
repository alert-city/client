'use client';
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  FormHelperText, InputAdornment,
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useMutation } from '@apollo/client';
import { z } from 'zod';
import { createUserSchema } from '@/validation/schemas/user/user.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CREATE_USER } from '@/graphql/user';
import { useRouter } from '@/i18n/routing';
import { RouteConfig } from '@/routes/route';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useTranslations } from 'next-intl';

const accountTypeOptions = {
  personal: 'Personal',
  organization: 'Organization',
};

type RegistrationValues = z.infer<typeof createUserSchema>;

const RegistrationPage: React.FC = () => {
  const t = useTranslations('RegistrationPage');
  const router = useRouter();
  const [createUser] = useMutation(CREATE_USER);
  const [accountType, setAccountType] = useState<string>('Personal');
  const [registrationStatus, setRegistrationStatus] = useState<Boolean>(false);
  const [registrationInfo, setRegistrationInfo] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [captchaStatus, setCaptchaStatus] = useState<'unverified' | 'verified' | 'expired'>('unverified');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
          register,
          handleSubmit,
          setValue,
          formState: { errors },
          reset,
        } = useForm<RegistrationValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      orgName: '',
      username: '',
      password: '',
      displayName: '',
      accountType: 'Personal',
      mobilePhone: '',
      captchaVerified: false,
    },
  });

  useEffect(() => {
    register('captchaVerified');
  }, [register]);


  const onSubmit = async (data: RegistrationValues) => {
    setLoading(true);
    setRegistrationError(null);

    let role = '';
    if (data.accountType === 'Personal') {
      role = 'normal';
    } else {
      role = 'admin';
    }

    const formData = {
      ...data,
      role: [role],
    };

    if (formData.accountType === 'Personal') {
      delete formData.orgName;
    }

    if (formData.accountType === 'Organization') {
      delete formData.firstName;
      delete formData.lastName;
    }

    const { captchaVerified, ...filteredData } = formData;
    try {
      const response = await createUser({
        variables: {
          input: {
            ...filteredData,
            emailInfoType: 1,
          },
        },
      });
      if (response?.data?.createUser) {
        reset();
        setRegistrationStatus(true);
        let countdown = 4;
        setRegistrationInfo(`${t('RegistrationInfo')} ${countdown} ${t('seconds')}`);
        const intervalId = setInterval(() => {
          countdown -= 1;
          setRegistrationInfo(`${t('RegistrationInfo')} ${countdown} ${t('seconds')}`);
          if (countdown === 0) {
            clearInterval(intervalId);
            router.push(RouteConfig.Login.Path);
          }
        }, 1000);
        setLoading(false);
      }
    } catch (err) {
      setRegistrationError((err as Error).message || t('defaultRegistrationError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaStatus('verified');
      setValue('captchaVerified', true, { shouldValidate: true });
    } else {
      setCaptchaStatus('expired');
      setValue('captchaVerified', false, { shouldValidate: true });
    }
  };

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleClickShowConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={3}
      sx={{ borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}
    >
      <Box
        component="div"
        sx={{
          width: '100%',
          maxWidth: 800,
          border: '1px solid #ddd',
          borderRadius: 4,
          boxShadow: 3,
          padding: 4,
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', mb: 6 }}>
          <Tooltip title={t('return')} placement="right">
            <IconButton
              onClick={() => router.back()}
              sx={{ position: 'absolute' }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h4" gutterBottom>
          {t('title')}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          width="100%"
        >

          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('accountInformation')}
              </Typography>
              <Box display="flex" flexDirection="column" gap={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>{t('accountType')}</InputLabel>
                  <Select
                    label={t('accountType')}
                    defaultValue="Personal"
                    {...register('accountType', {
                      onChange: (e) => {
                        if (e.target.value) {
                          setAccountType(e.target.value);
                        }
                      },
                    })}
                  >
                    <MenuItem value={accountTypeOptions.personal}>{t('personal')}</MenuItem>
                    <MenuItem value={accountTypeOptions.organization}>{t('organization')}</MenuItem>
                  </Select>
                  {errors.accountType && (
                    <FormHelperText>{errors.accountType.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label={t('username')}
                  {...register('username', {
                      onChange: (e) => {
                        setRegistrationInfo(null);
                      },
                    },
                  )}
                  fullWidth
                  placeholder={t('usernamePlaceholder')}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
                <TextField
                  label={t('displayName')}
                  fullWidth
                  {...register('displayName')}
                  error={!!errors.displayName}
                  helperText={errors.displayName?.message}
                />
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label={t('password')}
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
                <TextField
                  label={t('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
              </Box>
            </CardContent>
          </Card>


          {/* Basic Information */}
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('basicInformation')}
              </Typography>
              {(accountType === 'Personal') &&
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    label={t('firstName')}
                    fullWidth
                    {...register('firstName')}
                    error={!!errors?.firstName}
                    helperText={errors.firstName?.message}
                  />
                  <TextField
                    label={t('lastName')}
                    fullWidth
                    {...register('lastName')}
                    error={!!errors?.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Box>
              }
              <Box display="flex" gap={2} mb={2}>
                {(accountType === 'Organization') &&
                  <TextField
                    label={t('orgName')}
                    fullWidth
                    {...register('orgName')}
                    error={!!errors.orgName}
                    helperText={errors.orgName?.message}
                  />
                }
                <TextField
                  label={t('mobilePhone')}
                  fullWidth
                  {...register('mobilePhone')}
                  error={!!errors.mobilePhone}
                  helperText={errors.mobilePhone?.message}
                />
              </Box>
            </CardContent>
          </Card>

          {/* CAPTCHA */}
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('verification')}
              </Typography>
              <FormControl error={!!errors.captchaVerified} fullWidth>
                <Box display="flex" justifyContent="center">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={handleCaptchaChange}
                  />
                </Box>
                {errors.captchaVerified && (
                  <FormHelperText sx={{ textAlign: 'center', marginTop: 2 }}>
                    {errors.captchaVerified.message}
                  </FormHelperText>
                )}
              </FormControl>
            </CardContent>
          </Card>

          <Box className="flex justify-center">
            {registrationInfo &&
              <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="primary" variant="body2">
                {registrationInfo}
              </Typography>
            }
            {registrationError &&
              <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error" variant="body2">
                {registrationError}
              </Typography>
            }
          </Box>

          {!registrationStatus &&
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('register')}
            </Button>
          }
          {!registrationStatus &&
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => router.back()}
            >
              {t('returnToLogin')}
            </Button>
          }
          {registrationStatus &&
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => router.push(RouteConfig.Login.Path)}
            >
              {t('nextPage')}
            </Button>
          }
          <Typography variant="body2" mt={2} color="primary">
            <RouteConfig.Login.Link>
              {t('alreadyHaveAccount')}
            </RouteConfig.Login.Link>
          </Typography>
        </Box>
      </Box>
      <LoadingOverlay loading={loading} />
    </Box>
  );
};

export default RegistrationPage;