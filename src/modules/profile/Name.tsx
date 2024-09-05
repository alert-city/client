import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore, handleCancel, useUserActions, handleValueChanged } from '@/store/profileState';
import { useTranslations } from 'next-intl';

const Name: React.FC = () => {
  const { userInfo, isEdit, setIsEdit,requestError } = useUserInfoStore();
  const { handleSave } = useUserActions();
  const t = useTranslations('ProfileUpdatePage');

  return (
    <>
      <Typography variant="h6" gutterBottom>{t('navigation.name')}</Typography>
      {(isEdit.name.firstName || isEdit.name.lastName) ?
        <>
          <TextField
            fullWidth
            label={t('name.firstName')}
            margin="normal"
            value={userInfo.name.firstName || ''}
            onChange={(e) => {
              handleValueChanged('firstName', e);
            }}
          />
          <TextField
            fullWidth
            label={t('name.lastName')}
            margin="normal"
            value={userInfo.name.lastName || ''}
            onChange={(e) => {
              handleValueChanged('lastName', e);
            }}
          />
        </> :
        <>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginRight: 1 }}>{`${t(
              'name.firstName')}:`}</Typography>
            <Typography variant="body1">{userInfo.name.firstName}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginRight: 1 }}>{`${t(
              'name.lastName')}:`}</Typography>
            <Typography variant="body1">{userInfo.name.lastName}</Typography>
          </Box>
        </>}
      {requestError && (
        <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error"
                    variant="body2">
          {requestError}
        </Typography>
      )}
      {(isEdit.name.firstName || isEdit.name.lastName) ?
        <>
          <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => handleSave('name')}>{t('submit')}</Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => handleCancel('name')}>{t('cancel')}</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, name: { firstName: true, lastName: true } })}>{t('edit')}</Button>
      }
    </>
  );
};

export default Name;