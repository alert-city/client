import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  TextareaAutosize
} from '@mui/material';
import { LocalizationProvider, DateField, DatePicker, TimeField, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema } from '@/validation/schemas/event/event.schema';
import Cookies from 'js-cookie';
import { EVENT_TYPE } from '@/shared/constants/storage';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@fontsource/poppins';

type EventValues = z.infer<typeof createEventSchema>;

interface RoutineSectionProps {
  onSubmit: (data: EventValues) => void;
  isMobile: boolean;
  submissionStatus: boolean;
  submissionInfo: string | null;
  submissionError: string | null;
};

const RoutineSection: React.FC<RoutineSectionProps> = ({
  onSubmit, isMobile, submissionStatus, submissionInfo, submissionError,
}) => {
  const t = useTranslations('RoutineSection');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      date: new Date().toDateString(),
      time: new Date().toTimeString(),
      location: '',
      subject: '',
      matter: '',
      ERTime: '',
      ERDate: '',
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={2}
      alignItems="center"
      padding={isMobile ? 2 : 4}
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', mb: 6 }}>
        <Tooltip title={t('return')} placement="right">
          <IconButton
            onClick={() => router.back()}
            sx={{ position: 'absolute' }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        variant="h5"
        gutterBottom
        mb={2}
        sx={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          color: '#333',
        }}
      >
        {t('routineSubmission')}
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        width="100%"
        justifyContent="space-between"
        sx={{
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        {/* Event Description */}
        <Card sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' }, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
            >
              {t('eventDescription')}
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
              <TextField
                label={t('subject')}
                fullWidth
                {...register('subject')}
                error={!!errors.subject}
                helperText={errors.subject?.message}
              />
              <FormControl
                sx={{
                  padding: 1,
                  border: "1px solid #ddd",
                  borderRadius: '4px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                }}>
                <TextareaAutosize
                  placeholder={t('details')}
                  size="md"
                  minRows={4}
                  sx={{
                    padding: 3,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                  {...register('matter')}
                />
                {errors.matter && (
                  <FormHelperText>{errors.matter.message}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Event Information */}
        <Card sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' }, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
            >
              {t('eventTime')}
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label={t('startTime')}
                  defaultValue={dayjs(new Date().getTime())}
                  onChange={(newValue) => setValue('time', newValue!.toString())}
                  sx={{ width: '100%' }}
                />
                <DatePicker
                  label={t('startDate')}
                  defaultValue={dayjs(new Date().toDateString())}
                  onChange={(newValue) => setValue('date', newValue!.toString())}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  label={t('estimatedRecoveryTime')}
                  format="HH:mm"
                  onChange={(newValue) => setValue('ERTime', newValue?.toString())}
                  fullWidth
                />
                <DateField
                  label={t('estimatedRecoveryDate')}
                  onChange={(newValue) => setValue('ERDate', newValue?.toString())}
                  fullWidth
                />
              </LocalizationProvider>
            </Box>
          </CardContent>
        </Card>

        {/* Event Location */}
        <Card sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' }, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
            >
              {t('eventLocation')}
            </Typography>
            <Box gap={2} mb={2}>
              <TextField
                label={t('location')}
                fullWidth
                {...register('location')}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box className="flex justify-center">
        {submissionInfo && (
          <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="primary" variant="body2">
            {submissionInfo}
          </Typography>
        )}
        {submissionError && (
          <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error" variant="body2">
            {submissionError}
          </Typography>
        )}
      </Box>

      {!submissionStatus && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            padding: '12px',
            fontWeight: 'bold',
            textTransform: 'none',
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#125b9b',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={() => {
            Cookies.set(EVENT_TYPE, 'Routine');
          }}
        >
          {t('submit')}
        </Button>
      )}
    </Box>
  );
};

export default RoutineSection;

