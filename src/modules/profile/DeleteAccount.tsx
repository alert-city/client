import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import { DELETE_USER } from '@/graphql/user';
import { useMutation } from '@apollo/client';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useLogout } from '@/hooks/useLogout';
import { useUserInfoStore } from '@/store/profileState';
import { useTranslations } from 'next-intl';

const DeleteAccount: React.FC = () => {
  const t = useTranslations('ProfileUpdatePage');
  const logout = useLogout();
  const [deleteUser] = useMutation(DELETE_USER);
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { storedUsername, storedId } = useUserInfoStore();

  const handleDelete = async () => {
    if (confirmationText === `${t('deleteAccount.content')} ${storedUsername}`) {
      setLoading(true);
      try {
        const { data } = await deleteUser({ variables: { id: storedId } });
        if (data?.deleteUser) {
          let countdown = 4;
          setDeleteInfo(`${t('deleteAccount.deleteInfo')} ${countdown} ${t('deleteAccount.seconds')}`);
          const intervalId = setInterval(() => {
            countdown -= 1;
            setDeleteInfo(`${t('deleteAccount.deleteInfo')} ${countdown} ${t('deleteAccount.seconds')}`);
            if (countdown === 0) {
              clearInterval(intervalId);
              logout();
            }
          }, 1000);
        }
      } catch (error) {
        setDeleteError((error as Error).message);
      } finally {
        setLoading(false);
        setConfirmationText('');
        setError(null);
      }
    } else {
      setError(t('deleteAccount.contentError'));
    }
  };

  const handleCancel = () => {
    setConfirmationText('');
    setError(null);
    setIsSubmitting(false);
  };

  return (
    <Box>
      <Typography variant="h6" color="error" gutterBottom>
        {t('navigation.deleteAccount')}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {t('deleteAccount.description')}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mb: 2 }}>
        {`${t('deleteAccount.content')} ${storedUsername}`}
      </Typography>
      <Typography variant="body2" color="error" sx={{ mb: 3 }}>
        {t('deleteAccount.riskWarning')}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={confirmationText}
        onChange={(e) => {
          setConfirmationText(e.target.value);
          setIsSubmitting(true);
          setError(null);
          setDeleteError(null);
          setDeleteInfo(null);
        }}
        error={!!error}
        helperText={error}
      />

      <Box className="flex justify-center">
        {deleteInfo && (
          <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}
                      color="primary" variant="body2">
            {deleteInfo}
          </Typography>
        )}
        {deleteError && (
          <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error"
                      variant="body2">
            {deleteError}
          </Typography>
        )}
      </Box>

      {isSubmitting &&
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleCancel}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleDelete}
          >
            {t('submit')}
          </Button>
        </Box>
      }
      <LoadingOverlay loading={loading} />
    </Box>
  );
};

export default DeleteAccount;