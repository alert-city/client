'use client';
import React, { useEffect, useState } from 'react';
import { Box, Card, Checkbox, Container, CssBaseline, FormControlLabel, InputAdornment, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Divider, Button } from '@mui/material';
import CustomButton from '@/modules/common/Button';
import CustomTextField from '@/modules/common/TextField';
import { LOGIN, OAUTH_LOGIN } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginSchema } from '@/validation/schemas/login/login.schema';
import { ACCESS_TOKEN, ACCOUNT_TYPE, AVATAR_URL, CAN_SHOW_SNACKBAR, DISPLAY_NAME, ID, LOGIN_TYPE, IS_STAY_SIGNED_IN, ROLE, USERNAME } from '@/shared/constants/storage';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import { RouteConfig } from '@/routes/route';
import Cookies from 'js-cookie';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useTranslations } from 'next-intl';
import MouseHoverPopover from '@/modules/auth/login/Popover';
import { useLogin } from '@/utils/redirection';
import { useUserInfoStore } from '@/store/profileState';
import ResendActivationEmail from '@/modules/auth/login/ResendEmail';
import SettingModal from '@/modules/auth/login/SettingModal';
import { z } from 'zod';
import getIconUrl from '@/utils/getIconUrl';
import { signIn, useSession } from 'next-auth/react';

type LoginFormInputs = {
  username: string;
  password: string;
  isStaySignedIn: boolean;
};

const LoginForm: React.FC = () => {
  const t = useTranslations('LoginPage');
  const loginSchema = useLoginSchema();
  const [login] = useMutation(LOGIN);
  const [OAuthLogin] = useMutation(OAUTH_LOGIN);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { loginRedirect, twoFARedirect } = useLogin();
  const { setStoredId } = useUserInfoStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idForResend, setIdForResend] = useState<string | null>(null);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const iconUrl = getIconUrl();
  const { data: session, status } = useSession();

  type LoginValues = z.infer<typeof loginSchema>;
  const {
          register,
          handleSubmit,
          watch,
          getValues,
          formState: { errors },
        } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      isStaySignedIn: localStorage.getItem(IS_STAY_SIGNED_IN) === 'true' || false,
    },
  });

  const isStaySignedIn = watch('isStaySignedIn');

  useEffect(() => {
    if (typeof window !== 'undefined' && isStaySignedIn !== undefined) {
      localStorage.setItem(IS_STAY_SIGNED_IN, isStaySignedIn.toString());
    }
  }, [isStaySignedIn]);

  const setUserInfo = async (userInfo: any) => {
    Cookies.set(ACCESS_TOKEN, userInfo.accessToken);
    Cookies.set(ACCOUNT_TYPE, userInfo.accountType);
    localStorage.setItem(ID, userInfo.id);
    localStorage.setItem(DISPLAY_NAME, userInfo.displayName);
    localStorage.setItem(AVATAR_URL, userInfo.avatarUrl);
    localStorage.setItem(USERNAME, userInfo.username);
    Cookies.set(ROLE, userInfo.role.toString());
    localStorage.setItem(CAN_SHOW_SNACKBAR, 'true');
    setStoredId(userInfo.id);
  };

  useEffect(() => {
    const handleOAuthLoginResult = async () => {
      if (session?.userInfo) {
        try {
          const isStaySignedIn = getValues('isStaySignedIn');
          const input = {
            ...session.userInfo, isStaySignedIn, displayName: session.userInfo.firstName, accountType: 'Personal',
            role: ['normal', 'staff'],
          };
          const response = await OAuthLogin({ variables: { input } });
          const accountType = response.data.OAuthLogin.accountType;
          const role = response.data.OAuthLogin.role;
          if (response.data.OAuthLogin) {
            const userInfo = response.data.OAuthLogin;
            await setUserInfo(userInfo);
            localStorage.setItem(LOGIN_TYPE, 'OAuth');
            twoFARedirect({ accountType, role });
          }
        } catch (err: any) {
          setLoginError(err.message);
        }
      }
    };
    if (status === 'authenticated') {
      setLoading(true);
      handleOAuthLoginResult().then(() => setLoading(false));
    }
  }, [status, session]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setLoginError(null);
    try {
      const response = await login({ variables: { input: data } });
      const role: string[] = response.data.login.role;
      const accountType = response.data.login.accountType;
      const isFirstLogin = response.data.login.isFirstLogin;
      if (response.data.login) {
        const userInfo = response.data.login;
        await setUserInfo(userInfo);
        localStorage.setItem(CAN_SHOW_SNACKBAR, 'true');
        loginRedirect({ isFirstLogin, accountType, role });
      }
    } catch (err: any) {
      const statusCode = err.graphQLErrors[0]?.extensions?.status;
      const id = err.graphQLErrors[0]?.extensions?.data;
      if (statusCode && id && statusCode === 1000) {
        setDialogOpen(true);
        setIdForResend(id);
      } else {
        setLoginError(err.message);
      }
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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSettingsOpen = () => {
    setSettingModalOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingModalOpen(false);
  };

  const handleOAuthLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const provider = e.currentTarget.textContent?.toLowerCase();
    await signIn(provider);
  };

  return (
    <Card
      sx={{
        width: '100%',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        position: 'relative',
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="flex flex-col items-center mt-[1rem]">
          <Tooltip title={t('setting')}>
            <IconButton
              onClick={handleSettingsOpen}
              sx={{ position: 'absolute', top: 16, right: 16 }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Avatar src={iconUrl} alt="icon" sx={{ mb: 3, width: 56, height: 56 }} />
          <Typography component="h1" variant="h5">
            {t('greeting')}{' '}
            <Box
              component="span"
              sx={{ color: '#007BFF', fontWeight: 'bold', letterSpacing: '.1rem' }}
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
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                control={
                  <Checkbox
                    checked={watch('isStaySignedIn')}
                    {...register('isStaySignedIn')}
                    color="primary"
                  />
                }
                label={t('staySignedIn')}
              />
              <MouseHoverPopover anchorEl={anchorEl} onClose={handlePopoverClose} />
              <Typography variant="body2" color="primary" className="mt-2 flex justify-center">
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
        <Box sx={{ width: '100%', textAlign: 'center', my: 2 }}>
          <Divider>{t('quickLogin')}</Divider>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            mt: 2,
            mb: 1.5,
          }}
        >
          <Tooltip title={t('quickLoginHover')}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ width: '150px' }}
              onClick={handleOAuthLogin}
            >
              Google
            </Button>
          </Tooltip>
          {/*<Tooltip title={t('quickLoginHover')}>*/}
          {/*  <Button*/}
          {/*    variant="outlined"*/}
          {/*    startIcon={<FacebookIcon />}*/}
          {/*    sx={{ width: '150px' }}*/}
          {/*  >*/}
          {/*    Facebook*/}
          {/*  </Button>*/}
          {/*</Tooltip>*/}
        </Box>
        <LoadingOverlay loading={loading} />
        <SettingModal open={settingModalOpen} handleClose={handleSettingsClose} />
        {dialogOpen && (
          <ResendActivationEmail
            open={dialogOpen}
            handleClose={handleCloseDialog}
            id={idForResend as string}
          />
        )}
      </Container>
    </Card>
  );
};

export default LoginForm;
