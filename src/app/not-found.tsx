"use client";
import { Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AUTH_STATUS, AUTH_TOKEN } from '../shared/constants/storage';
import { useEffect, useState } from 'react';

export default function NotFoundPage() {
    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN) : null;
        const authStatus = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STATUS) : 'invalid';
        if (token && (authStatus !== 'invalid')) {
            setLoggedIn(true);
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
                backgroundRepeat: 'no-repeat'
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
                404<br />Page Not Found
            </Typography>
            <Typography variant="body1" gutterBottom>
                Sorry, the page you&apos;re looking for doesn&apos;t exist.
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mt: 3,
                    justifyItems: 'center'
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/login')}
                >
                    HomePage
                </Button>
                {loggedIn ? (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                ) : (null)}
            </Box>
        </Container>
    );
}
