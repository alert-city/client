'use client';
import React, { useEffect, useState } from 'react';
import { Container, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Switch, Snackbar, Card, CardContent, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { IndexConfig } from '@/routes';
import { useTranslations } from 'next-intl';
import { useLanguage } from '@/utils/switchLanguage';
import { Locales } from '@/i18n/routing';
import { useTheme } from '@/utils/switchTheme';

const Preferences: React.FC = () => {
  const t = useTranslations('Preferences');
  const { currentLocale, languageSwitcher } = useLanguage();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { currentTheme, themeSwitcher } = useTheme();

  const languageOptions = IndexConfig.languageOptions.map(option => ({
    ...option,
    label: t(option.key),
  }));

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTheme = event.target.checked ? 'dark' : 'light';
    themeSwitcher(selectedTheme);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }} maxWidth="xs">
      <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {t('title')}
        </Typography>
        <Box p={3} display="flex" flexDirection="column" gap={3}>
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">{t('theme')}</FormLabel>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentTheme === 'dark'}
                      onChange={handleThemeChange}
                      name="themeToggle"
                    />
                  }
                  label={currentTheme === 'dark' ? t('dark') : t('light')}
                />
              </FormControl>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Autocomplete
                id="country-select-demo"
                sx={{ width: 300 }}
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
            </CardContent>
          </Card>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={t('snackbarMessage')}
        />
      </Box>
    </Container>
  );
};

export default Preferences;