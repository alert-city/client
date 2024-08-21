'use client';
import React, { useState } from 'react';
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
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormHelperText,
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';
import { getPublicRouteByKey, getRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';
import { getPageByKey, PAGE_KEY } from '@/pages/pageConfig';
import { useMutation } from '@apollo/client';
import { z } from 'zod';
import { createUserSchema } from '@/validation/schemas/user/user.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CREATE_USER } from '@/graphql/user';
import { TEMP_USERNAME } from '@/shared/constants/storage';
import { useRouter } from 'next/navigation';


type InferredRegistrationValues = z.infer<typeof createUserSchema>;
type RegistrationValues = InferredRegistrationValues & {
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  securityQuestion3: string;
  securityAnswer3: string;
};

const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [createUser] = useMutation(CREATE_USER);
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<string>('Personal');
  const [registrationStatus, setRegistrationStatus] = useState<Boolean>(false);
  const [registrationInfo, setRegistrationInfo] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [canRegister, setCanRegister] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<InferredRegistrationValues>({
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
      securityQuestion1: '',
      securityAnswer1: '',
      securityQuestion2: '',
      securityAnswer2: '',
      securityQuestion3: '',
      securityAnswer3: '',
      captchaVerified: false,
    },
  });


  const securityQuestions = getPageByKey(PAGE_KEY.SECURITY_QUESTIONS).question;

  const onSubmit = async (data: InferredRegistrationValues) => {
    // console.log('data', data);
    setCanRegister(false);
    setRegistrationError(null);

    const securityQuestions = [
      {
        question: data.securityQuestion1,
        answer: data.securityAnswer1,
      },
      {
        question: data.securityQuestion2,
        answer: data.securityAnswer2,
      },
      {
        question: data.securityQuestion3,
        answer: data.securityAnswer3,
      },
    ];

    let role = '';
    if (data.accountType === 'Personal') {
      role = 'normal';
    } else {
      role = 'Organization';
    }

    const formData = {
      ...data,
      securityQuestions,
      role: [role],
    };

    const {
      securityQuestion1,
      securityAnswer1,
      securityQuestion2,
      securityAnswer2,
      securityQuestion3,
      securityAnswer3,
      captchaVerified,
      ...filteredData
    } = formData;


    // console.log('filteredData', filteredData);

    try {
      const response = await createUser({
        variables: {
          input: filteredData,
        },
      });
      // console.log('response', response);
      if (response?.data?.createUser) {
        setRegistrationInfo('Registration successful. You will receive an email to verify your account. Redirecting to next page...');
        setCanRegister(true);
        localStorage.setItem(TEMP_USERNAME, data.username);
        setRegistrationStatus(true);
        setTimeout(async () => {
          router.push(getRouteByKey(ROUTE_KEY.ENABLE2FA).path);
        }, 4000);
      }
    } catch (err) {
      setCanRegister(true);
      setRegistrationError((err as Error).message || 'Reset Password failed');
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    const isValid = !!value;
    setCaptchaVerified(isValid);
    setValue('captchaVerified', isValid, { shouldValidate: true });
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

          {/* Security Questions */}
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Questions
              </Typography>
              {[1, 2, 3].map((questionNumber) => (
                <Box key={questionNumber} display="flex" gap={2} mb={2}>
                  <FormControl
                    fullWidth
                    error={!!errors[`securityQuestion${questionNumber}` as keyof RegistrationValues]}>
                    <InputLabel>Security Question {questionNumber}</InputLabel>
                    <Select
                      label={`Security Question ${questionNumber}`}
                      defaultValue=""
                      {...register(`securityQuestion${questionNumber}` as keyof RegistrationValues)}
                    >
                      {securityQuestions?.map((question) => (
                        <MenuItem key={question.value} value={question.value}>
                          {question.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[`securityQuestion${questionNumber}` as keyof RegistrationValues] && (
                      <FormHelperText>
                        {errors[`securityQuestion${questionNumber}` as keyof RegistrationValues]?.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    label={`Answer ${questionNumber}`}
                    fullWidth
                    {...register(`securityAnswer${questionNumber}` as keyof RegistrationValues)}
                    error={!!errors[`securityAnswer${questionNumber}` as keyof RegistrationValues]}
                    helperText={errors[`securityAnswer${questionNumber}` as keyof RegistrationValues]?.message}
                  />
                </Box>
              ))}
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
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={!canRegister}>
              Register
            </Button>
          }

          {registrationStatus &&
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              // sx={{ mt: 2, mb: 4 }}
              type="button"
              onClick={() => router.push(getRouteByKey(ROUTE_KEY.ENABLE2FA).path)}
            >
              Next Page
            </Button>
          }


          <Typography variant="body2" mt={2} color="primary">
            <Link href={getPublicRouteByKey(ROUTE_KEY.LOGIN).path}>
              Already have an account? Log in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationPage;