'use client';
import React, { useEffect, useState } from 'react';
import { Container, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Snackbar, Card, Typography, Grid, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { IndexConfig } from '@/routes';
import { useTranslations } from 'next-intl';
import { useLanguage } from '@/utils/switchLanguage';
import { Locales } from '@/i18n/routing';
import useTheme from '@/utils/switchTheme';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN } from '@/shared/constants/storage';

interface PreferencesProps {
    showCloseButton?: boolean;
    onClose?: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ showCloseButton = false, onClose }) => {
    const t = useTranslations('Preferences');
    const { currentLocale, languageSwitcher } = useLanguage();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { toggleTheme, displayTheme } = useTheme();
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = typeof window !== 'undefined' ? Cookies.get(ACCESS_TOKEN) : null;
        setAccessToken(accessToken || null);
    }, []);

    const languageOptions = IndexConfig.languageOptions.map(option => ({
        ...option,
        label: t(option.key),
    }));

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedTheme = event.target.value;
        toggleTheme(selectedTheme);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 400 },
                padding: { xs: '16px', sm: '20px' },
                borderRadius: '16px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                margin: { xs: '16px', sm: '0' },
                position: 'relative',
            }}
        >
            {showCloseButton && onClose && (
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        zIndex: 1,
                    }}
                >
                    <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </IconButton>
            )}
            <Container sx={{ padding: { xs: '0', sm: '0 16px' } }}>
                <Box sx={{ width: '100%', marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            mb: { xs: 2, sm: 3 },
                        }}
                    >
                        {t('title')}
                    </Typography>
                    <Box sx={{ mb: 3, mt: 2, width: '100%' }}>
                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                            <Grid item xs={12}>
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend" sx={{ mb: 1 }}>{t('theme')}</FormLabel>
                                    <RadioGroup
                                        value={displayTheme}
                                        onChange={handleThemeChange}
                                    >
                                        <FormControlLabel value="system" control={<Radio />} label={t('system')} />
                                        <FormControlLabel value="light" control={<Radio />} label={t('light')} />
                                        <FormControlLabel value="dark" control={<Radio />} label={t('dark')} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="country-select-demo"
                                    fullWidth
                                    options={languageOptions}
                                    autoHighlight
                                    getOptionLabel={(option) => option.label}
                                    value={languageOptions.find(option => option.key === currentLocale)}
                                    onChange={async (event, newValue) => {
                                        if (newValue) {
                                            const locale = newValue.key as Locales;
                                            languageSwitcher({ locale });
                                        }
                                    }}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            <Box
                                                key={key}
                                                component="li"
                                                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                                {...optionProps}
                                            >
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                    alt=""
                                                />
                                                {option.label}
                                            </Box>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('language')}
                                            slotProps={{
                                                htmlInput: {
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    {accessToken &&
                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={3000}
                            onClose={handleSnackbarClose}
                            message={t('snackbarMessage')}
                        />
                    }
                </Box>
            </Container>
        </Card>
    );
};

export default Preferences;