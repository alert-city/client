import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore, handleCancel, useUserActions, handleValueChanged } from '@/store/profileState';
import { updateMobilePhoneSchema } from '@/validation/schemas/update-profile/update-profile.schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

type UpdateMobilePhoneFormValues = z.infer<typeof updateMobilePhoneSchema>;

const Contact: React.FC = () => {
  const t = useTranslations('ProfileUpdatePage');
  const { userInfo, setUserInfo, isEdit, setIsEdit,requestError } = useUserInfoStore();
  const { handleSave } = useUserActions();

  const {
          register,
          handleSubmit,
          setValue,
          formState: { errors },
        } = useForm<UpdateMobilePhoneFormValues>({
    resolver: zodResolver(updateMobilePhoneSchema),
    defaultValues: {
      mobilePhone: userInfo.mobilePhone
    },
  });

  const handleMobilePhoneUpdate = async () => {
    await handleSave('mobilePhone');
  };

  return (
    <form onSubmit={handleSubmit(handleMobilePhoneUpdate)}>
      <Typography variant="h6" gutterBottom>{t('navigation.contact')}</Typography>
      {isEdit.mobilePhone ?
        <TextField
          fullWidth
          label={t('contact.mobilePhone')}
          margin="normal"
          error={!!errors.mobilePhone}
          helperText={errors.mobilePhone?.message}
          {...register('mobilePhone', {
            onChange: (e) => {
              setUserInfo({
                ...userInfo, mobilePhone: e.target.value,
              });
              handleValueChanged('mobilePhone', e);
            },
          })}
        />
        : <Typography>{userInfo.mobilePhone}</Typography>}
      {requestError && (
        <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error"
                    variant="body2">
          {requestError}
        </Typography>
      )}
      {isEdit.mobilePhone ?
        <>
          <Button variant="contained" sx={{ marginTop: 2 }} type="submit">{t('submit')}</Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => handleCancel('mobilePhone')}>{t('cancel')}</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, mobilePhone: true })}>{t('edit')}</Button>
      }
    </form>
  );
};

export default Contact;