import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore, handleCancel, useUserActions, handleValueChanged } from '@/store/profileState';
import { useValidationSchemas } from '@/validation/schemas/update-profile/update-profile.schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

const PhoneNumber: React.FC = () => {
  const t = useTranslations('ProfileUpdatePage');
  const { userInfo, setUserInfo, isEdit, setIsEdit, requestError } = useUserInfoStore();
  const { handleSave } = useUserActions();
  const { updatePhoneNumberSchema } = useValidationSchemas();

  type UpdatePhoneNumberFormValues = z.infer<typeof updatePhoneNumberSchema>;
  const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm<UpdatePhoneNumberFormValues>({
    resolver: zodResolver(updatePhoneNumberSchema),
    defaultValues: {
      phoneNumber: userInfo.phoneNumber,
    },
  });

  const handlePhoneNumberUpdate = async () => {
    await handleSave('phoneNumber');
  };

  return (
    <form onSubmit={handleSubmit(handlePhoneNumberUpdate)}>
      <Typography variant="h6" gutterBottom>{t('navigation.phoneNumber')}</Typography>
      {isEdit.phoneNumber ?
        <TextField
          fullWidth
          label={t('phoneNumber')}
          margin="normal"
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          {...register('phoneNumber', {
            onChange: (e) => {
              setUserInfo({
                ...userInfo, phoneNumber: e.target.value,
              });
              handleValueChanged('phoneNumber', e);
            },
          })}
        />
        : <Typography>{userInfo.phoneNumber ? userInfo.phoneNumber : t('phoneNotProvided') }</Typography>}
      {requestError && (
        <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error"
                    variant="body2">
          {requestError}
        </Typography>
      )}
      {isEdit.phoneNumber ?
        <>
          <Button variant="outlined" sx={{ marginTop: 2 }}
                  onClick={() => handleCancel('phoneNumber')}>{t('cancel')}</Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }} type="submit">{t('submit')}</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, phoneNumber: true })}>{t('edit')}</Button>
      }
    </form>
  );
};

export default PhoneNumber;