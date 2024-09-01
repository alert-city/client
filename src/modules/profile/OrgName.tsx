import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore,handleCancel, handleValueChanged, useUserActions } from '@/store/profileState';
import { useTranslations } from 'next-intl';

const OrgName: React.FC = () => {
  const { userInfo, setUserInfo, isEdit, setIsEdit,requestError } = useUserInfoStore();
  const { handleSave } = useUserActions();
  const t = useTranslations('ProfileUpdatePage');

  return (
    <>
      <Typography variant="h6" gutterBottom>{t('navigation.orgName')}</Typography>
      {isEdit.orgName ?
        <TextField
          fullWidth
          label={t('navigation.orgName')}
          margin="normal"
          value={userInfo.orgName || ''}
          onChange={(e) => {
            handleValueChanged('orgName', e);
          }}
        />
        : <Typography>{userInfo.orgName}</Typography>}
      {requestError && (
        <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error"
                    variant="body2">
          {requestError}
        </Typography>
      )}
      {isEdit.orgName ?
        <>
          <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => handleSave('orgName')}>{t('submit')}</Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => handleCancel('orgName')}>{t('cancel')}</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, orgName: true })}>{t('edit')}</Button>
      }
    </>
  );
};

export default OrgName;