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
import { USERNAME } from '@/shared/constants/storage';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import LoadingOverlay from '@/modules/LoadingOverlay/LoadingOverlay';

interface TwoFAPageProps {
  isRegister?: boolean;
  defaultValue?: boolean;
  setShow2FA?: (value: boolean) => void;
}

const TwoFAPage: React.FC<TwoFAPageProps> = ({ isRegister = true, defaultValue, setShow2FA }) => {
  const router = useRouter();
  const [generate2FA] = useMutation(GENERATE_2FA);
  const [verify2FACode] = useMutation(VERIFY_2FA_CODE);
  const [updateUserByUsername] = useMutation(UPDATE_USER_BY_USERNAME);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>('');
  const [username, setUsername] = useState<string | null>('');
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [issuer, setIssuer] = useState<string | null>('');
  const [verificationCode, setVerificationCode] = useState<string | null>('');
  const [verificationInfo, setVerificationInfo] = useState<string | null>('');
  const [verificationError, setVerificationError] = useState<string | null>('');
  const [isEnableSuccess, setIsEnableSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const cardWidth = isRegister ? '60%' : '100%';
  useEffect(() => {
    const username = localStorage.getItem(USERNAME);
    if (username) {
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    setIs2FAEnabled(defaultValue ?? false);
  }, [defaultValue]);

  const handleCheckboxChange = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const generateQrCodeUrl = async (
    issuer: string,
  ) => {
    setLoading(true);
    setIssuer(issuer);
    setVerificationCode('');
    setVerificationInfo('');
    setVerificationError('');
    try {
      const { data } = await generate2FA({
        variables: {
          issuer,
          username: username,
        },
      });
      if (data?.generate2FA) {
        setQrCodeUrl(data.generate2FA.qrCodeUrl);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to generate QR code URL.');
      setLoading(false);
    }
  };

  const handleEnable2FA = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await verify2FACode({
        variables: {
          username: username,
          code: verificationCode,
        },
      });
      if (data?.verify2FACode) {
        const response = await updateUserByUsername({
          variables: {
            username: username,
            input: {
              is2FAEnabled: true,
            },
          },
        });
        setIsEnableSuccess(true);
        isRegister && localStorage.removeItem(USERNAME);
        let countdown = 4;
        if (isRegister) {
          setVerificationInfo(`2FA enabled successfully. You will be redirected to login page in ${countdown} seconds.`);
        } else {
          setVerificationInfo('2FA enabled successfully.');
        }
        const intervalId = setInterval(() => {
          countdown -= 1;
          if (isRegister) {
            setVerificationInfo(`2FA enabled successfully. You will be redirected to login page in ${countdown} seconds.`);
          } else {
            setVerificationInfo('2FA enabled successfully.');
          }
          if (countdown === 0) {
            clearInterval(intervalId);
            if (isRegister) {
              router.push(RouteConfig.Login.Path);
            } else {
              setVerificationInfo('2FA enabled successfully.');
              if (setShow2FA) {
                setShow2FA(false);
              }
            }
          }
        }, 1000);
      }
    } catch (err) {
      setVerificationError((err as Error).message || 'Failed to verify 2FA code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip2FA = async () => {
    if (username) {
      await updateUserByUsername({
        variables: {
          username: username,
          input: {
            twoFASecret: null,
          },
        },
      });
    }
    localStorage.removeItem(USERNAME);
    router.push(RouteConfig.Login.Path);
  };

  return (
    <Card sx={{ padding: '8px', width: cardWidth, borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <CardContent component="form" onSubmit={handleEnable2FA}>
        <Typography variant="h6" gutterBottom>
          Protect your account with Two-Factor Authentication
        </Typography>
        <FormGroup>
          {isRegister &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={is2FAEnabled || false}
                  onChange={handleCheckboxChange}
                  name="enable2FA"
                  value={is2FAEnabled}
                />
              }
              label="Enable Two-Factor Authentication"
            />
          }
          {(is2FAEnabled || !isRegister) && (
            <>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Choose Authenticator App</InputLabel>
                <Select
                  label={`Choose Authenticator App`}
                  value={issuer}
                  onChange={(e) => generateQrCodeUrl(e.target.value || '')}
                >
                  <MenuItem value="microsoft">Microsoft Authenticator</MenuItem>
                  <MenuItem value="google">Google Authenticator</MenuItem>
                </Select>
              </FormControl>

              {issuer && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom
                              sx={{ display: 'flex', justifyContent: 'center' }}>
                    Scan the QR code using
                    your {issuer === 'microsoft' ? 'Microsoft Authenticator' : 'Google Authenticator'} app
                    to add your account.
                  </Typography>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <img
                      src={qrCodeUrl || ''}
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
                      setVerificationError(null);
                      setVerificationInfo(null);
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
                {(isEnableSuccess && isRegister) &&
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, mb: 4 }}
                    type="button"
                    onClick={() => router.push(RouteConfig.Login.Path)}
                  >
                    Return to Login
                  </Button>
                }
              </Box>
            </>
          )}

          {(!is2FAEnabled && isRegister) &&
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
      <LoadingOverlay loading={loading} />
    </Card>
  );
};


export default TwoFAPage;