import React, { useEffect, useState } from 'react';
import { Box, Switch, Typography } from '@mui/material';
import TwoFAPage from '@/modules/auth/register/TwoFA';
import { useUserInfoStore, handleCancel } from '@/store/profileState';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/graphql/user';
import { useTranslations } from 'next-intl';

const TwoFA: React.FC = () => {
  const { userInfo, setUserInfo, storedId } = useUserInfoStore();
  const [updateUser] = useMutation(UPDATE_USER);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const t = useTranslations('ProfileUpdatePage');
  const [is2FAEnabled, setIs2FAEnabled] = useState(userInfo.is2FAEnabled);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTwoFA(true);
    const enabled = event.target.checked;
    if (!enabled) {
      setIs2FAEnabled(false);
    }
    if (!enabled && is2FAEnabled) {
      setShowTwoFA(false);
      const { data } = await updateUser({
        variables: {
          id: storedId,
          input: {
            is2FAEnabled: false,
            twoFASecret: null,
          },
        },
      });
      data && setIs2FAEnabled(false);
    } else if (!enabled && !is2FAEnabled) {
      setShowTwoFA(false);
    }
    setUserInfo({ ...userInfo, is2FAEnabled: enabled });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 1.5 }}>{t('twoFA.2FATitle')}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {t('twoFA.2FAStatus')} {is2FAEnabled ? t('twoFA.enabled') : t('twoFA.disabled')}
        </Typography>
        <Switch
          checked={userInfo.is2FAEnabled}
          onChange={handleToggle}
          color="primary"
        />
      </Box>
      {showTwoFA && (
        <Box sx={{ mt: 2 }}>
          <TwoFAPage isFirstLogin={false} defaultValue={userInfo.is2FAEnabled} setShow2FA={setShowTwoFA}
                     set2FAEnabled={setIs2FAEnabled} />
        </Box>
      )}
    </>
  );
};

export default TwoFA;