'use client';
import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IS_FIRST_LOGIN, DISPLAY_NAME, CAN_SHOW_SNACKBAR } from '@/shared/constants/storage';
import { useTranslations } from 'next-intl';

const WelcomeSnackbar = () => {
  const [open, setOpen] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const t = useTranslations('WelcomeSnackbar');

  useEffect(() => {
    const displayName = typeof localStorage.getItem(DISPLAY_NAME) === 'string' ? localStorage.getItem(DISPLAY_NAME) : '';
    setDisplayName(displayName || '');
    const timer = setTimeout(() => {
      setOpen(false);
      localStorage.setItem(CAN_SHOW_SNACKBAR, 'false');
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      localStorage.setItem(IS_FIRST_LOGIN, 'false');
      return;
    }
    localStorage.setItem(IS_FIRST_LOGIN, 'false');
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        sx={{
          width: '100%',
          backgroundColor: '#4caf50',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          boxShadow: '0px 3px 6px rgba(0,0,0,0.16)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {`🎉 ${t('content')}${t('comma')}${displayName}${t('exclamation')}`}
      </Alert>
    </Snackbar>
  );
};

export default WelcomeSnackbar;