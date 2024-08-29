'use client';
import { Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { ACCESS_TOKEN } from '@/shared/constants/storage';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { RouteConfig } from '@/routes/route';
import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const router = useRouter();
  const t = useTranslations('NotFoundPage');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? Cookies.get(ACCESS_TOKEN) : null;
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        backgroundImage: 'url(/images/bg-404.jpg)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          mb: 4,
        }}
      >
        <Image
          src="/images/404.jpg"
          alt="404 Error"
          width={400}
          height={300}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>
      <Typography variant="h3" component="h1" gutterBottom>
        404<br />{t('title')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t('description')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 3,
          justifyItems: 'center',
        }}
      >
        {!isAuthenticated && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(RouteConfig.Login.Path)}
          >
            {t('returnToLogin')}
          </Button>
        )}
        {isAuthenticated && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.back()}
          >
            {t('goBack')}
          </Button>
        )}
      </Box>
    </Container>
  );
}
