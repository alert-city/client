import React from 'react';
import { Box, Switch, Typography } from '@mui/material';
import TwoFAPage from '@/modules/auth/register/TwoFA';
import { useUserInfoStore, handleCancel } from '@/store/profileState';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/graphql/user';
import { useTranslations } from 'next-intl';

const TwoFA: React.FC = () => {
  const { userInfo, setUserInfo, isEdit, setIsEdit,storedId } = useUserInfoStore();
  const [updateUser] = useMutation(UPDATE_USER);
  const [showTwoFA, setShowTwoFA] = React.useState(false);
  const t = useTranslations('ProfileUpdatePage');

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    if (!enabled) {
      const { data } = await updateUser({
        variables: {
          id: storedId,
          input: {
            is2FAEnabled: false,
          },
        },
      });
      if (data?.updateUser) {
        setShowTwoFA(false);
      }
    } else {
      setShowTwoFA(true);
    }
    setUserInfo({ ...userInfo, is2FAEnabled: enabled });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>{t('twoFA.2FATitle')}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {t('twoFA.2FAStatus')} {userInfo.is2FAEnabled ? t('twoFA.enabled') : t('twoFA.disabled')}
        </Typography>
        <Switch
          checked={userInfo.is2FAEnabled}
          onChange={handleToggle}
          color="primary"
        />
      </Box>
      {showTwoFA && (
        <TwoFAPage isRegister={false} defaultValue={userInfo.is2FAEnabled} setShow2FA={setShowTwoFA} />
      )}
    </>
  );

};

export default TwoFA;