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
  Skeleton,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { GENERATE_2FA, VERIFY_2FA_CODE } from '@/graphql/auth';
import { UPDATE_USER } from '@/graphql/user';
import { ACCOUNT_TYPE, ID, ROLE } from '@/shared/constants/storage';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/utils/redirection';
import Cookies from 'js-cookie';
import { useUserInfoStore } from '@/store/profileState';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const TwoFACodeSchema = z.object({
  twoFACode: z.string().min(6, '2FA code must be at least 6 characters').max(
    6, '2FA code must be at most 6 characters'),
});

type Enable2FAValues = z.infer<typeof TwoFACodeSchema>;

interface TwoFAPageProps {
  isFirstLogin?: boolean;
  defaultValue?: boolean;
  setShow2FA?: (value: boolean) => void;
  set2FAEnabled?: (value: boolean) => void;
}

const appOptions = {
  microsoft: 'microsoft',
  google: 'google',
};

const TwoFAPage: React.FC<TwoFAPageProps> = ({ isFirstLogin = true, defaultValue, setShow2FA, set2FAEnabled }) => {
  const t = useTranslations('TwoFAPage');
  const [generate2FA] = useMutation(GENERATE_2FA);
  const [verify2FACode] = useMutation(VERIFY_2FA_CODE);
  const [updateUser] = useMutation(UPDATE_USER);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>('');
  const [id, setId] = useState<string | null>('');
  const [accountType, setAccountType] = useState<string | undefined>('');
  const [role, setRole] = useState<string[] | []>([]);
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
  const [issuer, setIssuer] = useState<string | undefined>('');
  const [verificationCode, setVerificationCode] = useState<string | null>('');
  const [verificationInfo, setVerificationInfo] = useState<string | null>('');
  const [verificationError, setVerificationError] = useState<string | null>('');
  const [showEnableButton, setShowEnableButton] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { twoFARedirect } = useLogin();
  const { setTwoFAStatus } = useUserInfoStore();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const cardWidth = isFirstLogin ? '60%' : '100%';
  const [showToDashboard, setShowToDashboard] = useState(false);

  const {
          register,
          formState: { errors },
          reset,
          handleSubmit,
        } = useForm<Enable2FAValues>({
    resolver: zodResolver(TwoFACodeSchema),
    defaultValues: {
      twoFACode: '',
    },
  });

  useEffect(() => {
    const id = localStorage.getItem(ID);
    const accountType = Cookies.get(ACCOUNT_TYPE);
    const role = Cookies.get(ROLE)?.split(',');
    id && setId(id);
    accountType && setAccountType(accountType || '');
    role && setRole(role);
  }, []);

  useEffect(() => {
    setIs2FAEnabled(defaultValue ?? false);
  }, [defaultValue]);

  const handleCheckboxChange = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const changeIsFirstLogin = async () => {
    const response = await updateUser({
      variables: {
        id: id,
        input: {
          isFirstLogin: false,
        },
      },
    });
    if (response.data.updateUser) {
      twoFARedirect({ accountType, role });
    }
  };

  const generateQrCodeUrl = async (
    issuer: string,
  ) => {
    setShowSkeleton(true);
    setLoading(true);
    setIssuer(issuer);
    setVerificationCode('');
    setVerificationInfo('');
    setVerificationError('');
    try {
      const { data } = await generate2FA({
        variables: {
          issuer,
          id: id,
        },
      });
      if (data?.generate2FA) {
        setQrCodeUrl(data.generate2FA.qrCodeUrl);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    } finally {
      setShowSkeleton(false);
    }
  };

  const handleEnable2FA = async (data: Enable2FAValues) => {
    setLoading(true);
    try {
      const { data } = await verify2FACode({
        variables: {
          id: id,
          code: verificationCode,
        },
      });
      if (data?.verify2FACode) {
        const response = await updateUser({
          variables: {
            id: id,
            input: {
              is2FAEnabled: true,
            },
          },
        });
        if (response.data.updateUser) {
          setShowEnableButton(false);
          set2FAEnabled && set2FAEnabled(true);
          setShowToDashboard(true);
          reset();
          let countdown = 4;
          if (isFirstLogin) {
            setVerificationInfo(
              `${t('verificationInfo')} ${countdown} ${t('seconds')}`);
          } else {
            setVerificationInfo(t('verificationInfoShort'));
          }
          const intervalId = setInterval(async () => {
            countdown -= 1;
            if (isFirstLogin) {
              setVerificationInfo(
                `${t('verificationInfo')} ${countdown} ${t('seconds')}`);
            } else {
              setVerificationInfo(t('verificationInfoShort'));
            }
            if (countdown === 0) {
              clearInterval(intervalId);
              if (isFirstLogin) {
                await changeIsFirstLogin();
              } else {
                setVerificationInfo(t('verificationInfoShort'));
                setShow2FA && setShow2FA(false);
                setTwoFAStatus(true);
              }
            }
          }, 1000);
        }
      }
    } catch (err) {
      setVerificationError((err as Error).message || t('default2FAError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip2FA = async () => {
    await changeIsFirstLogin();
  };

  const handleIssuerChange = async (e: string) => {
    setShowEnableButton(true);
    await generateQrCodeUrl(e);
  };

  return (
    <Card sx={{ padding: '8px', width: cardWidth, borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <CardContent component="form" onSubmit={handleSubmit(handleEnable2FA)}>
        <Typography variant="h6" gutterBottom>
          {t('protectDescription')}
        </Typography>
        <FormGroup>
          {isFirstLogin &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={is2FAEnabled || false}
                  onChange={handleCheckboxChange}
                  name="enable2FA"
                  value={is2FAEnabled}
                />
              }
              label={t('enableDescription')}
            />
          }
          {(is2FAEnabled || !isFirstLogin) && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>{t('chooseApp')}</InputLabel>
                <Select
                  label={t('chooseApp')}
                  value={issuer}
                  onChange={(e) => handleIssuerChange(e.target.value as string)}

                  variant={'outlined'}
                >
                  <MenuItem value={appOptions.microsoft}>{t('microsoftApp')}</MenuItem>
                  <MenuItem value={appOptions.google}>{t('googleApp')}</MenuItem>
                </Select>
              </FormControl>
              {issuer && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom
                              sx={{ display: 'flex', justifyContent: 'center' }}>
                    {t('scanDescription1')} {issuer === 'microsoft' ? t('microsoftApp') : t('googleApp')} {t(
                    'scanDescription2')}
                  </Typography>
                  <Box className="flex justify-center" sx={{ mt: 2, mb: 1 }}>
                    {showSkeleton && <Skeleton variant="rectangular" width={150} height={150} />}
                    {!showSkeleton &&
                      <Box display="flex" justifyContent="center">
                        <img
                          src={qrCodeUrl || ''}
                          alt={t('qrCodeAlt')}
                          style={{ width: '150px', height: '150px' }}
                          hidden={showSkeleton}
                        />
                      </Box>
                    }
                  </Box>
                  <TextField
                    label={t('enterCode')}
                    fullWidth
                    margin="normal"
                    value={verificationCode}
                    {...register('twoFACode', {
                      onChange: (e) => {
                        setVerificationCode(e.target.value);
                        setVerificationError(null);
                        setVerificationInfo(null);
                      },
                    })}
                    error={!!errors.twoFACode}
                    helperText={errors.twoFACode?.message}

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
                {showEnableButton &&
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    type="submit"
                  >
                    {t('enable')}
                  </Button>
                }
                {(showToDashboard && isFirstLogin) &&
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, mb: 4 }}
                    type="button"
                    onClick={() => twoFARedirect({ accountType, role })}
                  >
                    {t('goToDashboard')}
                  </Button>
                }
              </Box>
            </>
          )}
          {(!is2FAEnabled && isFirstLogin) &&
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              type="button"
              onClick={handleSkip2FA}
            >
              {t('skip')}
            </Button>
          }
        </FormGroup>
      </CardContent>
      <LoadingOverlay loading={loading} />
    </Card>
  );
};


export default TwoFAPage;