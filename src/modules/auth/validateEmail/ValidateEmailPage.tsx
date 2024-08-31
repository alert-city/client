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
import { VALIDATE_EMAIL_LINK, RESEND_ACTIVATION_LINK_EMAIL } from '@/graphql/user';
import { useMutation } from '@apollo/client';
import { RouteConfig } from '@/routes/route';

const emailInfoType = {
  1: {
    title: 'Account Activation',
    successMessage: 'Your account has been activated successfully!',
    successSubMessage: 'Welcome to Alert City!',
    resendButtonText: 'Resend Activation Email',
    errorTitle: 'Failed to activate account',
    resendSuccessMessage: 'Activation email has been resent successfully!',
    resendSuccessSubMessage: 'Please check your email inbox.',
    resendErrorMessage: 'Failed to resend activation email',
  },
  2: {
    title: 'Update Username',
    successMessage: 'Your username has been updated successfully!',
    successSubMessage: 'Your new username is now active.',
    resendButtonText: 'Resend Username Update Email',
    errorTitle: 'Failed to update username',
    resendSuccessMessage: 'Username update email has been resent successfully!',
    resendSuccessSubMessage: 'Please check your email inbox.',
    resendErrorMessage: 'Failed to resend username update email',
  },
};

const ValidateEmailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const username = searchParams?.get('username');
  const newUsername = searchParams?.get('newUsername');
  const emailType = searchParams?.get('emailInfoType') as '1' | '2';

  const [validateEmailLink] = useMutation(VALIDATE_EMAIL_LINK);
  const [resendActivationLinkEmail] = useMutation(RESEND_ACTIVATION_LINK_EMAIL);
  const [canRedirect, setCanRedirect] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [resendStatus, setResendStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  console.log('emailType: ', emailType);
  console.log('emailType: ', typeof emailType);
  console.log('emailType: ', typeof parseInt(emailType, 10));

  useEffect(() => {
    if (token) {
      setStatus('loading');
      const activateAccount = async () => {
        try {
          const { data } = await validateEmailLink({
            variables: { token, emailInfoType: parseInt(emailType, 10) },
          });

          if (data?.validateEmailLink) {
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

  const handleResendLinkEmail = async () => {
    setResendStatus('loading');
    setStatus(null);

    try {
      const variables: { username: string; emailInfoType: number; newUsername?: string } = {
        username: username || '',
        emailInfoType: parseInt(emailType, 10),
      };
      if (newUsername) {
        variables.newUsername = newUsername;
      }
      const { data } = await resendActivationLinkEmail({ variables });
      if (data.resendActivationLinkEmail) {
        setResendStatus('success');
        setActivationError(null);
        setCanRedirect(true);
      }
    } catch (err) {
      setResendStatus('error');
      setResendError((err as Error).message);
    }
  };

  const emailInfo = emailInfoType[emailType] || emailInfoType[1];

  return (
    <div className="border-2 border-yellow-600 min-h-screen flex ">
      <Container maxWidth="sm"
                 sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
            {emailInfo.title}
          </Typography>
          {(status === 'loading' || resendStatus === 'loading') && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          )}
          {status === 'success' && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              {emailInfo.successMessage}
              <Typography
                component="div"
                sx={{ color: 'blue', mt: 1 }}
              >
                <strong>{emailInfo.successSubMessage}</strong>
              </Typography>
            </Alert>
          )}
          {status === 'error' && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {`${emailInfo.errorTitle}: ${activationError}!`}
            </Alert>
          )}

          {resendStatus === 'success' && (
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              {emailInfo.resendSuccessMessage}
              <Typography
                component="div"
                sx={{ color: 'blue', mt: 1 }}
              >
                <strong>{emailInfo.resendSuccessSubMessage}</strong>
              </Typography>
            </Alert>
          )}

          {resendStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {`${emailInfo.resendErrorMessage}: ${resendError}!`}
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
                onClick={handleResendLinkEmail}
                disabled={resendStatus === 'loading'}
              >
                {resendStatus === 'loading' ? 'Resending...' : emailInfo.resendButtonText}
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

export default ValidateEmailPage;