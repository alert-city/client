import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore, handleCancel, handleValueChanged, useUserActions } from '@/store/profileState';
import { useTopbarStore } from '@/store/topBar';
import { useTranslations } from 'next-intl';

const DisplayName: React.FC = () => {
  const t = useTranslations('ProfileUpdatePage');
  const { userInfo, setUserInfo, isEdit, setIsEdit } = useUserInfoStore();
  const { handleSave } = useUserActions();
  const { setUpdatedDisplayName } = useTopbarStore();

  return (
    <>
      <Typography variant="h6" gutterBottom>{t('navigation.displayName')}</Typography>
      {isEdit.displayName ?
        <TextField
          fullWidth
          label={t('navigation.displayName')}
          margin="normal"
          value={userInfo.displayName || ''}
          onChange={(e) => {
            handleValueChanged('displayName', e);
          }}
        />
        : <Typography>{userInfo.displayName}</Typography>}
      {isEdit.displayName ?
        <>
          <Button variant="contained" sx={{ marginTop: 2 }}
                  onClick={async () => {
                    await handleSave('displayName');
                    setUpdatedDisplayName(userInfo.displayName);
                  }}>
            {t('submit')}
          </Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => handleCancel('displayName')}>{t('cancel')}</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, displayName: true })}>{t('edit')}</Button>
      }
    </>
  );
};

export default DisplayName;