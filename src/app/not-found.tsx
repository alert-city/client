"use client";
import { Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ACCESS_TOKEN } from '@/shared/constants/storage';
import { useEffect, useState } from 'react';
import { getPublicRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';
import Cookies from 'js-cookie';

export default function NotFoundPage() {
    const router = useRouter();

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
                {!isAuthenticated && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(getPublicRouteByKey(ROUTE_KEY.LOGIN).path)}
                    >
                        Return to Login
                    </Button>
                )}
                {isAuthenticated && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                )}
            </Box>
        </Container>
    );
}
