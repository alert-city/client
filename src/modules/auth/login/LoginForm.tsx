'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CssBaseline, Checkbox, FormControlLabel, InputAdornment } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomButton from '@/modules/common/Button';
import CustomTextField from '@/modules/common/TextField';
import { LOGIN } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validation/schemas/login/login.schema';
import { IS_STAY_SIGNED_IN, LOGIN_INFO, AUTH_TOKEN, USERNAME } from '@/shared/constants/storage';
import { getRouteByKey, getPublicRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import { getPageByKey, PAGE_KEY } from '@/pages/pageConfig';

type LoginFormInputs = {
  username: string;
  password: string;
  isStaySignedIn: boolean;
};

const LoginForm: React.FC = () => {
  const [login] = useMutation(LOGIN);
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    setLoginError(null);
    try {
      const response = await login({ variables: { input: data } });
      const role: string = response.data.login.role;
      const accountType = response.data.login.accountType;
      const organization = response.data.login.organization;

      const loginData = {
        accessToken: response.data.login.accessToken,
        role: role,
        name: response.data.login.name,
        organization: organization,
        accountType: accountType,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOGIN_INFO, JSON.stringify(loginData));
        localStorage.setItem(AUTH_TOKEN, response.data.login.accessToken);
        localStorage.setItem(USERNAME, response.data.login.username);
      }

      if (accountType === getPageByKey(PAGE_KEY.ORGANIZATION).accountType) {
        router.push(getRouteByKey(ROUTE_KEY.ADMIN).path);
      } else if (accountType === getPageByKey(PAGE_KEY.PERSONAL).accountType) {
        if (role.includes('staff')) {
          router.push(getRouteByKey(ROUTE_KEY.STAFF).path);
        } else if (!role.includes('staff')) {
          setLoginError('A normal account is not allowed to login on web platform. Please login on mobile app.');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
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
          <Avatar src="../favicon.ico" alt="icon" sx={{ mb: 2, width: 56, height: 56 }} />
          <Typography component="h1" variant="h5" >
            Welcome to{' '}
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
              label="Username"
              autoComplete="username"
              {...register('username')}
              error={!!errors.username} // MUI 组件的 error 属性用于显示错误样式
              helperText={errors.username ? errors.username.message : ''} // 显示错误消息
            />
            <CustomTextField
              id="password"
              label="Password"
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
                label="Stay signed in"
              />
              <Typography variant="body2" color="primary" className="w-full mt-2 flex justify-center">
                <Link href={getPublicRouteByKey(ROUTE_KEY.RESET_PASSWORD).path}>
                  Forgot password?
                </Link>
              </Typography>
            </Box>

            {loginError && (
              <Typography color="error" variant="body2" className="w-full mt-2 flex justify-center">
                {loginError}
              </Typography>
            )}

            <CustomButton type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </CustomButton>

            <Typography variant="body2" color="primary" className="w-full mt-2 flex justify-center">
              <Link href={getPublicRouteByKey(ROUTE_KEY.REGISTER).path}>
                Don't have an account? Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </FormProvider>
  );
};

export default LoginForm;
