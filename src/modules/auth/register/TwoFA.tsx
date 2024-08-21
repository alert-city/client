'use client';
import React, { useEffect, useState } from 'react';
import {
  Box, Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel, MenuItem, Select, TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { GENERATE_2FA, VERIFY_2FA_CODE } from '@/graphql/auth';
import { UPDATE_USER_BY_USERNAME } from '@/graphql/user';
import { TEMP_USERNAME } from '@/shared/constants/storage';
import { getPublicRouteByKey, getRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';
import { useRouter } from 'next/navigation';

const TwoFAPage: React.FC = () => {
  const router = useRouter();
  const [generate2FA] = useMutation(GENERATE_2FA);
  const [verify2FACode] = useMutation(VERIFY_2FA_CODE);
  const [updateUserByUsername] = useMutation(UPDATE_USER_BY_USERNAME);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [twoFASecret, setTwoFASecret] = useState<string>('');
  const [authenticatorApp, setAuthenticatorApp] = useState<string>('');
  const [tempUsername, setTempUsername] = useState<string>('');
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [issuer, setIssuer] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationInfo, setVerificationInfo] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');
  const [isEnableSuccess, setIsEnableSuccess] = useState<boolean>(false);

  useEffect(() => {
    const tempUsername = localStorage.getItem(TEMP_USERNAME);
    if (tempUsername) {
      setTempUsername(tempUsername);
    }
  }, []);

  const handleCheckboxChange = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const handleIssuerChange = (e: string) => {
    setIssuer(e);
    setVerificationError('');
  };

  const generateQrCodeUrl = async (
    issuer: string,
  ) => {
    // console.log('issuer', issuer);
    // console.log('username', tempUsername);
    setIssuer(issuer);
    setVerificationCode('');
    setVerificationInfo('');
    setVerificationError('');
    try {
      const { data } = await generate2FA({
        variables: {
          issuer,
          username: tempUsername,
        },
      });
      // console.log('data', data);
      if (data?.generate2FA) {
        setQrCodeUrl(data.generate2FA.qrCodeUrl);
        setTwoFASecret(data.generate2FA.secret);
      }
    } catch (err) {
      console.error('Failed to generate QR code URL.');
    }
  };

  const handleEnable2FA = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await verify2FACode({
        variables: {
          username: tempUsername,
          code: verificationCode,
        },
      });
      // console.log('data', data);
      if (data?.verify2FACode) {
        const response = await updateUserByUsername({
          variables: {
            username: tempUsername,
            input: {
              is2FAEnabled: true,
            },
          },
        });
        // console.log('response', response);
        setVerificationInfo('2FA enabled successfully. You will be redirected to login page in 5 seconds.');
        setIsEnableSuccess(true);
        localStorage.removeItem(TEMP_USERNAME);
        setTimeout(async () => {
          router.push(getPublicRouteByKey(ROUTE_KEY.LOGIN).path);
        }, 4000);
      }
    } catch (err) {
      // console.log('err', err);
      setVerificationError((err as Error).message || 'Failed to verify 2FA code.');
    }
  };

  const handleSkip2FA = async () => {
    if (tempUsername) {
      await updateUserByUsername({
        variables: {
          username: tempUsername,
          input: {
            twoFASecret: null,
          },
        },
      });
    }
    setIs2FAEnabled(false);
    setIssuer('');
    setQrCodeUrl('');
    setTwoFASecret('');
    setTempUsername('');
    setVerificationCode('');
    localStorage.removeItem(TEMP_USERNAME);
    router.push(getPublicRouteByKey(ROUTE_KEY.LOGIN).path);
  };

  return (
    <Card sx={{ padding: '8px', width: '60%', borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <CardContent component="form" onSubmit={handleEnable2FA}>
        <Typography variant="h6" gutterBottom>
          Protect your account with Two-Factor Authentication
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={is2FAEnabled}
                onChange={handleCheckboxChange}
                name="enable2FA"
                value={is2FAEnabled}
              />
            }
            label="Enable Two-Factor Authentication"
          />
          {is2FAEnabled && (
            <>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Choose Authenticator App</InputLabel>
                <Select
                  label={`Choose Authenticator App`}
                  value={issuer}
                  onChange={(e) => generateQrCodeUrl(e.target.value)}
                >
                  <MenuItem value="microsoft">Microsoft Authenticator</MenuItem>
                  <MenuItem value="google">Google Authenticator</MenuItem>
                </Select>
              </FormControl>

              {issuer && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Scan the QR code using
                    your {issuer === 'microsoft' ? 'Microsoft Authenticator' : 'Google Authenticator'} app
                    to add your account.
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <img
                      src={qrCodeUrl}
                      alt="Authenticator QR code" />
                  </Box>
                  <TextField
                    label="Enter Code from App"
                    name="verificationCode"
                    fullWidth
                    margin="normal"
                    required
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setVerificationError('');
                      setVerificationInfo('');
                    }}
                  />
                </Box>
              )}

              <Box className="flex justify-center">
                {verificationInfo && (
                  <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="primary"
                              variant="body2">
                    {verificationInfo}
                  </Typography>
                )}
                {verificationError &&
                  <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error" variant="body2">
                    {verificationError}
                  </Typography>
                }
              </Box>

              <Box>
                {!isEnableSuccess &&
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    type="submit"
                  >
                    Enable 2FA
                  </Button>
                }
                {isEnableSuccess &&
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, mb: 4 }}
                    type="button"
                    onClick={() => router.push(getPublicRouteByKey(ROUTE_KEY.LOGIN).path)}
                  >
                    Return to Login
                  </Button>
                }
              </Box>
            </>
          )}

          {!is2FAEnabled &&
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              type="button"
              onClick={handleSkip2FA}
            >
              Skip
            </Button>
          }
        </FormGroup>
      </CardContent>
    </Card>
  );
};


export default TwoFAPage;