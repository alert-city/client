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
  FormHelperText,
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useMutation } from '@apollo/client';
import { z } from 'zod';
import { createUserSchema } from '@/validation/schemas/user/user.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CREATE_USER } from '@/graphql/user';
import { TEMP_USERNAME } from '@/shared/constants/storage';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type RegistrationValues = z.infer<typeof createUserSchema>;

const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [createUser] = useMutation(CREATE_USER);
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<string>('Personal');
  const [registrationStatus, setRegistrationStatus] = useState<Boolean>(false);
  const [registrationInfo, setRegistrationInfo] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [canRegister, setCanRegister] = useState<boolean>(true);
  const [captchaStatus, setCaptchaStatus] = useState<'unverified' | 'verified' | 'expired'>('unverified');

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: {
        firstName: '',
        lastName: '',
      },
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
    setCanRegister(false);
    setRegistrationError(null);
    console.log('data: ', data);

    let role = '';
    if (data.accountType === 'Personal') {
      role = 'normal';
    } else {
      role = 'Organization';
    }

    const formData = {
      ...data,
      role: [role],
    };

    const { captchaVerified, ...filteredData } = formData;

    try {
      const response = await createUser({
        variables: {
          input: filteredData,
        },
      });
      if (response?.data?.createUser) {
        setRegistrationInfo('Register successful. You will receive an email to verify your account. Redirecting to next page...');
        setCanRegister(true);
        localStorage.setItem(TEMP_USERNAME, data.username);
        setRegistrationStatus(true);
        setTimeout(async () => {
          router.push(RouteConfig.Enable2FA.Path);
        }, 4000);
      }
    } catch (err) {
      setCanRegister(true);
      setRegistrationError((err as Error).message || 'Reset Password failed');
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
          <Tooltip title="Return" placement="right">
            <IconButton
              onClick={() => router.back()}
              sx={{ position: 'absolute'}}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h4" gutterBottom>
          Registration
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

          {/* Account Information */}
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account information
              </Typography>
              <Box display="flex" flexDirection="column" gap={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    label="Account Type"
                    defaultValue="Personal"
                    {...register('accountType', {
                      onChange: (e) => {
                        if (e.target.value) {
                          setAccountType(e.target.value);
                        }
                      },
                    })}
                  >
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Organization">Organization</MenuItem>
                  </Select>
                  {errors.accountType && (
                    <FormHelperText>{errors.accountType.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="Username"
                  {...register('username', {
                      onChange: (e) => {
                        setRegistrationInfo(null);
                      },
                    },
                  )}
                  fullWidth
                  placeholder="Please Enter your valid email address"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
                <TextField
                  label="Display Name"
                  fullWidth
                  {...register('displayName')}
                  error={!!errors.displayName}
                  helperText={errors.displayName?.message}
                />
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Box>
            </CardContent>
          </Card>


          {/* Basic Information */}
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              {(accountType === 'Personal') &&
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    label="First Name"
                    fullWidth
                    {...register('name.firstName')}
                    error={!!errors.name?.firstName}
                    helperText={errors.name?.firstName?.message}
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    {...register('name.lastName')}
                    error={!!errors.name?.lastName}
                    helperText={errors.name?.lastName?.message}
                  />
                </Box>
              }
              <Box display="flex" gap={2} mb={2}>
                {(accountType === 'Organization') &&
                  <TextField
                    label="Organization Name"
                    fullWidth
                    // sx={{ width: '50%' }}
                    {...register('orgName')}
                    error={!!errors.orgName}
                    helperText={errors.orgName?.message}
                  />
                }
                <TextField
                  label="Mobile Phone"
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
                Verification
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
              disabled={!canRegister}
            >
              Register
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
              Return to Login
            </Button>
          }
          {registrationStatus &&
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => router.push(RouteConfig.Enable2FA.Path)}
            >
              Next Page
            </Button>
          }

          <Typography variant="body2" mt={2} color="primary">
            <RouteConfig.Login.Link>
              Already have an account? Log in
            </RouteConfig.Login.Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationPage;