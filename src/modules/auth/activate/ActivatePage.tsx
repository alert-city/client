'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  AlertTitle,
  CardMedia,
} from '@mui/material';
import { ACTIVATE_USER_ACCOUNT, RESEND_ACTIVATION_EMAIL } from '@/graphql/user';
import { useMutation } from '@apollo/client';
import { RouteConfig } from '@/routes/route';

const ActivatePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const username = searchParams?.get('username');
  const [activateUserAccount] = useMutation(ACTIVATE_USER_ACCOUNT);
  const [resendActivationEmail] = useMutation(RESEND_ACTIVATION_EMAIL);
  const [canRedirect, setCanRedirect] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [resendStatus, setResendStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setStatus('loading');
      const activateAccount = async () => {
        try {
          const response = await activateUserAccount({
            variables: { token },
          });

          if (response.data.activateUserAccount) {
            setStatus('success');
            setCanRedirect(true);
          }
        } catch (error) {
          setStatus('error');
          setActivationError((error as Error).message);
        }
      };
      activateAccount().then();
    }
  }, [token]);

  const handleResendActivation = async () => {
    setResendStatus('loading');
    setStatus(null);
    try {
      const { data } = await resendActivationEmail({ variables: { username } });
      console.log('data', data);
      if (data.resendActivationEmail) {
        setResendStatus('success');
        setActivationError(null);
        setCanRedirect(true);
      }
    } catch (err) {
      setResendStatus('error');
      setResendError((err as Error).message);
    }
  };


  return (
    <div className="border-2 border-yellow-600 min-h-screen flex ">
      <Container maxWidth="sm"
                 sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CardMedia
          component="img"
          height="5"
          image="/favicon.ico"
          alt="Alert City Logo"
          sx={{
            height: 100,
            width: 100,
            objectFit: 'contain',
            mb: 4,
          }}
        />
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
            Account Activation
          </Typography>
          {(status === 'loading' || resendStatus === 'loading') && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          )}
          {status === 'success' && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Your account has been activated successfully!
              <Typography
                component="div"
                sx={{ color: 'blue', mt: 1 }}
              >
                <strong>Welcome to Alert City!</strong>
              </Typography>
            </Alert>
          )}
          {status === 'error' && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {`Failed to activate account: ${activationError}!`}
            </Alert>
          )}

          {resendStatus === 'success' && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Activation email has been resent successfully!
              <Typography
                component="div"
                sx={{ color: 'blue', mt: 1 }}
              >
                <strong>Please check your email inbox.</strong>
              </Typography>
            </Alert>
          )}

          {resendStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {`Failed to resend activation email: ${resendError}!`}
              <Typography component="div" sx={{ mt: 1 }}>
                Please try again later.
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {activationError &&
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 4 }}
                onClick={handleResendActivation}
                disabled={resendStatus === 'loading'}
              >
                {resendStatus === 'loading' ? 'Resending...' : 'Resend Activation Email'}
              </Button>
            }
            {canRedirect &&
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                onClick={() => router.push(RouteConfig.Login.Path)}
              >
                Return to Login
              </Button>
            }
          </Box>
        </Box>
      </Container>
    </div>
  );

};

export default ActivatePage;