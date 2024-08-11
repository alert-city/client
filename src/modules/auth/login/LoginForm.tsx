'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, CssBaseline, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomButton from '@/modules/common/Button';
import CustomTextField from '@/modules/common/TextField';
import { LOGIN } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validation/schemas/login/login.schema';
import { STAY_SIGNED_IN,LOGIN_INFO } from '@/shared/constants/storage';

type LoginFormInputs = {
  username: string;
  password: string;
  stay_signed_in: boolean;
};

const LoginForm: React.FC = () => {
  const [login] = useMutation(LOGIN);
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const methods = useForm({
    defaultValues: {
      username: '',
      password: '',
      stay_signed_in: true,
    },
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, watch,formState: { errors },register, } = methods

  const staySignedIn = watch('stay_signed_in');

  useEffect(() => {
    if (staySignedIn !== undefined && typeof window !== 'undefined') {
      localStorage.setItem(STAY_SIGNED_IN, staySignedIn.toString());
    }
  }, [staySignedIn]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError(null);
    try {
      const response = await login({ variables: { input: data } });
      console.log('response', response);
      const role: string = response.data.login.role;

      const loginData = {
        accessToken: response.data.login.accessToken,
        role: role,
        name: response.data.login.name,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOGIN_INFO, JSON.stringify(loginData));
      }

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'normal') {
        router.push('/normal');
      }
    } catch (err : any) {
      console.error(err);
      setLoginError(err.message || 'Login failed');
    }
  };

  return (
    <FormProvider {...methods}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="flex flex-col items-center mt-[2.5rem]">
          <Typography component="h1" variant="h5">
            Sign in
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
              type="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
            />

            <Box sx={{ justifyContent: 'space-between' }} className="flex items-center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={methods.watch('stay_signed_in')}
                    {...methods.register('stay_signed_in')}
                    color="primary"
                  />
                }
                label="Stay signed in"
              />
              <Typography variant="body2" color="primary" className="w-full mt-2 flex justify-center">
                <Link href="/forgot-password">
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
              <Link href="/register">
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
