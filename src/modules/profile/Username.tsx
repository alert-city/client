'use client';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { handleCancel, useUserInfoStore } from '@/store/profileState';
import { useLogout } from '@/hooks/useLogout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useValidationSchemas } from '@/validation/schemas/update-profile/update-profile.schema';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { SEND_UPDATE_USERNAME_EMAIL } from '@/graphql/user';
import { useTranslations } from 'next-intl';

const Username: React.FC = () => {
  const t = useTranslations('ProfileUpdatePage');
  const {
          userInfo, setUserInfo, isEdit, setIsEdit, setLoading, initialUserInfo, storedId,
        } = useUserInfoStore();
  const [updateUsernameError, setUpdateUsernameError] = useState<string | null>(null);
  const [updateUsernameInfo, setUpdateUsernameInfo] = useState<string | null>(null);
  const [isSendSuccess, setIsSendSuccess] = useState(false);
  const [sendUpdateUsernameEmail] = useMutation(SEND_UPDATE_USERNAME_EMAIL);
  const { updateUsernameSchema } = useValidationSchemas();
  const { revokeTokens } = useLogout();

  type UpdateUsernameFormValues = z.infer<typeof updateUsernameSchema>;
  const {
          register,
          handleSubmit,
          setValue,
          formState: { errors },
        } = useForm<UpdateUsernameFormValues>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: userInfo.username,
    },
  });

  const handleUsernameUpdate = async (formData: UpdateUsernameFormValues) => {
    setLoading(true);
    try {
      const { data } = await sendUpdateUsernameEmail({
        variables: {
          id: storedId,
          input: {
            newUsername: formData.username,
          },
        },
      });
      if (data.sendUpdateUsernameEmail) {
        setIsSendSuccess(true);
        let countdown = 4;
        setUpdateUsernameInfo(
          `${t('username.updateUsernameInfo')} ${countdown} ${t('username.seconds')}`);
        const intervalId = setInterval(() => {
          countdown -= 1;
          setUpdateUsernameInfo(
            `${t('username.updateUsernameInfo')} ${countdown} ${t('username.seconds')}`);
          if (countdown === 0) {
            clearInterval(intervalId);
            revokeTokens();
          }
        }, 1000);
      }
    } catch (error) {
      setUserInfo({ ...userInfo, username: initialUserInfo.username });
      setUpdateUsernameError((error as Error).message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleUsernameUpdate)}>
      <Typography variant="h6" gutterBottom>{t('navigation.username')}</Typography>
      {isEdit.username ? <>
        <TextField
          fullWidth
          label={t('navigation.username')}
          placeholder="Enter an valid email address"
          margin="normal"
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register('username', {
            onChange: (e) => {
              setUserInfo({
                ...userInfo, username: e.target.value,
              });
              setUpdateUsernameError(null);
              setUpdateUsernameInfo(null);
            },
          })}
        />
        <Box
          className="flex justify-center">
          {updateUsernameInfo &&
            (<Typography
              sx={{
                mt: 1.5, display: 'flex', justifyContent: 'center',
              }}
              color="primary"
              variant="body2"
            >
              {updateUsernameInfo}
            </Typography>)}
          {updateUsernameError &&
            (<Typography
              sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}
              color="error"
              variant="body2"
            >
              {updateUsernameError}
            </Typography>)}
        </Box>
      </> : <Typography>{userInfo.username}</Typography>}

      {!isSendSuccess && (isEdit.username ?
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outlined" sx={{ marginTop: 2 }}
                    onClick={() => {
                      handleCancel('username');
                      setUserInfo({ ...userInfo, username: initialUserInfo.username });
                      setValue('username', initialUserInfo.username);
                    }}>{t('cancel')}</Button>
            <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }} type="submit">
              {t('submit')}
            </Button>
          </Box>
          :
          <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => setIsEdit({ ...isEdit, username: true })}>
            {t('edit')}
          </Button>
      )}
    </form>
  );
};

export default Username;