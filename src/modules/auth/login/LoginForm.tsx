'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CssBaseline, Checkbox, FormControlLabel, InputAdornment } from '@mui/material';
import { useRouter } from '@/i18n/routing';
import CustomButton from '@/modules/common/Button';
import CustomTextField from '@/modules/common/TextField';
import { LOGIN } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validation/schemas/login/login.schema';
import {
  IS_STAY_SIGNED_IN,
  ACCESS_TOKEN,
  USERNAME,
  ACCOUNT_TYPE,
  IS_FIRST_LOGIN,
  DISPLAY_NAME,
  ID,
  AVATAR_URL,
} from '@/shared/constants/storage';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import { IndexConfig } from '@/routes';
import { RouteConfig } from '@/routes/route';
import Cookies from 'js-cookie';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useTranslations } from 'next-intl';

type LoginFormInputs = {
  username: string;
  password: string;
  isStaySignedIn: boolean;
};

const LoginForm: React.FC = () => {
  const t = useTranslations('LoginPage');
  const [login] = useMutation(LOGIN);
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      username: '',
      password: '',
      isStaySignedIn: true,
    },
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, watch, formState: { errors }, register } = methods;
  const isStaySignedIn = watch('isStaySignedIn');

  useEffect(() => {
    if (isStaySignedIn !== undefined && typeof window !== 'undefined') {
      localStorage.setItem(IS_STAY_SIGNED_IN, isStaySignedIn.toString());
    }
  }, [isStaySignedIn]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setLoginError(null);
    try {
      const response = await login({ variables: { input: data } });
      const role: string = response.data.login.role;
      const accountType = response.data.login.accountType;
      const displayName = response.data.login.displayName;

      const saveData = () => {
        if (typeof window !== 'undefined') {
          Cookies.set(ACCESS_TOKEN, response.data.login.accessToken);
          Cookies.set(ACCOUNT_TYPE, accountType);
          localStorage.setItem(ID, response.data.login.id);
          localStorage.setItem(DISPLAY_NAME, displayName);
          localStorage.setItem(AVATAR_URL, response.data.login.avatarUrl);
          localStorage.setItem(USERNAME, response.data.login.username);
          localStorage.setItem(IS_FIRST_LOGIN, 'true');
        }
      };

      if (response.data.login) {
        if (accountType === IndexConfig.Organization.AccountType) {
          saveData();
          router.push(RouteConfig.AdminSubmission.Path);
        } else if (accountType === IndexConfig.Personal.AccountType) {
          if (role.includes('staff')) {
            saveData();
            router.push(RouteConfig.StaffSubmission.Path);
          } else if (!role.includes('staff')) {
            setLoginError(t('accountTypeError'));
            setLoading(false);
            return;
          }
        }
      }

    } catch (err: any) {
      setLoginError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormProvider {...methods}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="flex flex-col items-center mt-[2.5rem]">
          <Avatar src="/images/alertcity.png" alt="icon" sx={{ mb: 2, width: 56, height: 56 }} />
          <Typography component="h1" variant="h5">
            {t('greeting')}{' '}
            <Box
              component="span"
              sx={{
                color: '#007BFF',
                fontWeight: 'bold',
                // fontFamily: 'monospace',
                letterSpacing: '.1rem',
              }}
            >
              Alert City!
            </Box>
          </Typography>
          <Box onSubmit={handleSubmit(onSubmit)} component="form" noValidate sx={{ mt: 1 }}>
            <CustomTextField
              id="username"
              label={t('username')}
              autoComplete="username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : ''}
            />
            <CustomTextField
              id="password"
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
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
            <Box sx={{ justifyContent: 'space-between' }} className="flex items-center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={methods.watch('isStaySignedIn')}
                    {...methods.register('isStaySignedIn')}
                    color="primary"
                  />
                }
                label={t('staySignedIn')}
              />
              <Typography variant="body2" color="primary" className="w-full mt-2 flex justify-center">
                <RouteConfig.ResetPassword.Link>
                  {t('forgotPassword')}
                </RouteConfig.ResetPassword.Link>
              </Typography>
            </Box>

            {loginError && (
              <Typography sx={{ mt: 1 }} color="error" variant="body2" className="flex justify-center">
                {loginError}
              </Typography>
            )}

            <CustomButton type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              {t('signIn')}
            </CustomButton>

            <Typography variant="body2" color="primary" className="w-full mt-2 flex justify-center">
              <RouteConfig.Register.Link>
                {t('noAccount')}
              </RouteConfig.Register.Link>
            </Typography>
          </Box>
        </Box>
      </Container>
      <LoadingOverlay loading={loading} />
    </FormProvider>
  );
};

export default LoginForm;
