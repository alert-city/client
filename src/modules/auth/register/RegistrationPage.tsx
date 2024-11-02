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
import { useCreateUserSchema } from '@/validation/schemas/user/user.schema';
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
import useTheme from '@/utils/switchTheme';
import { DARK, LIGHT } from '@/shared/constants/storage';
import { useLanguage } from '@/utils/switchLanguage';
import ResendActivationEmail from '@/modules/auth/login/ResendEmail';

const accountTypeOptions = {
  personal: 'Personal',
  organization: 'Organization',
};

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { isSystemDark, displayTheme } = useTheme();
  const { currentLocale } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idForResend, setIdForResend] = useState<string | null>(null);
  const { createUserSchema } = useCreateUserSchema();
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const language = currentLocale === 'en' ? 'en' : 'zh-CN';
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    setRecaptchaKey((prevKey) => prevKey + 1);
  }, [theme, language]);

  useEffect(() => {
    if (displayTheme === DARK) {
      setTheme(DARK);
    } else if (displayTheme === LIGHT) {
      setTheme(LIGHT);
    } else {
      isSystemDark ? setTheme(DARK) : setTheme(LIGHT);
    }
  }, [displayTheme, isSystemDark]);

  type RegistrationValues = z.infer<typeof createUserSchema>;
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
      phoneNumber: '',
      captchaVerified: false,
    },
  });

  useEffect(() => {
    register('captchaVerified');
  }, [register]);

  const onSubmit = async (data: RegistrationValues) => {
    setLoading(true);
    setRegistrationError(null);

    let role: string[];
    if (data.accountType === 'Personal') {
      role = ['normal', 'staff'];
    } else {
      role = ['admin'];
    }

    const formData = {
      ...data,
      role: role,
      orgName:"Alert City",
      captchaToken: captchaToken,
    };

    // if (formData.accountType === 'Personal') {
    //   delete formData.orgName;
    // }

    if (formData.accountType === 'Organization') {
      delete formData.firstName;
      delete formData.lastName;
    }

    const { captchaVerified, ...filteredData } = formData;
    try {
      const response = await createUser({
        variables: {
          platform: 'web',
          input: {
            ...filteredData,
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
    } catch (err: any) {
      const statusCode = err.graphQLErrors[0]?.extensions?.status;
      const id = err.graphQLErrors[0]?.extensions?.data;
      if (statusCode && id && statusCode === 1000) {
        setDialogOpen(true);
        setIdForResend(id);
      } else {
        setRegistrationError((err as Error).message || t('defaultRegistrationError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaStatus('verified');
      setCaptchaToken(value);
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

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '20px 40px',
        maxWidth: 800,
        borderRadius: 4,
        minHeight: '100vh',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
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
                    onChange: () => {
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
                label={t('phoneNumber')}
                fullWidth
                {...register('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
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
              <Box display="flex" justifyContent="center"
              >
                <ReCAPTCHA
                  key={recaptchaKey}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={handleCaptchaChange}
                  theme={theme}
                  hl={language}
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
        <Typography variant="body2" color="primary">
          <RouteConfig.Login.Link>
            {t('alreadyHaveAccount')}
          </RouteConfig.Login.Link>
        </Typography>
      </Box>
      <LoadingOverlay loading={loading} />
      {dialogOpen && (
        <ResendActivationEmail
          open={dialogOpen}
          handleClose={handleCloseDialog}
          id={idForResend as string}
          isRegister={true}
        />
      )}
    </Card>
  );
};

export default RegistrationPage;