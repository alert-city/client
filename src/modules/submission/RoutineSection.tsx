import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button
} from '@mui/material';
import { LocalizationProvider, DateField, DatePicker, TimeField, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema } from '@/validation/schemas/event/event.schema';
import { IS_DARK } from '@/shared/constants/storage';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@fontsource/poppins';
import { useEffect } from 'react';

type EventValues = z.infer<typeof createEventSchema>;

interface RoutineSectionProps {
    onSubmit: (data: EventValues) => void;
    submissionStatus: boolean;
    submissionInfo: string | null;
    submissionError: string | null;
};

const RoutineSection: React.FC<RoutineSectionProps> = ({
                                                           onSubmit, submissionStatus, submissionInfo, submissionError
                                                       }) => {
    const t = useTranslations('RoutineSection');
    const router = useRouter();
    const isDark = localStorage.getItem(IS_DARK) === "1";

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset
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

    useEffect(() => {
        if (submissionStatus) {
            reset();
        }
    }, [submissionStatus]);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                width: "100%",
                maxWidth: { xs: '100%', sm: 900, md: 1000 },
                maxHeight: "100vh",
                overflow: 'auto',
                border: isDark ? "1px solid #fff" : "1px solid #ddd",
                borderRadius: "24px",
                boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
                padding: { xs: 2, sm: 3, md: 4 },
                fontFamily: "Poppins, sans-serif",
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
                mb={4}
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                    color: isDark ? '#ccc' : '#333',
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
                <Card sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                    width: '100%',
                    maxWidth: { xs: '100%', md: 'calc(50% - 8px)' },
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardContent sx={{ padding: { xs: 2, sm: 2.5, md: 3 } }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
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
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                            <TextField
                                label={t('matter')}
                                multiline
                                rows={4}
                                variant='outlined'
                                placeholder={t('details')}
                                fullWidth
                                {...register('matter')}
                                error={!!errors.matter}
                                helperText={errors.matter?.message}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Event Information */}
                <Card sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                    width: '100%',
                    maxWidth: { xs: '100%', md: 'calc(50% - 8px)' },
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardContent sx={{ padding: { xs: 2, sm: 2.5, md: 3 } }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                        >
                            {t('eventTime')}
                        </Typography>
                        <Box
                            display="flex"
                            gap={2}
                            mb={2}
                            sx={{
                                flexDirection: { xs: 'column', sm: 'row' }
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label={t('startTime')}
                                    defaultValue={dayjs(new Date().getTime())}
                                    onChange={(newValue) => setValue('time', newValue!.toString())}
                                    sx={{
                                        width: '100%',
                                        '& .MuiInputBase-input': {
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }
                                    }}
                                />
                                <DatePicker
                                    label={t('startDate')}
                                    defaultValue={dayjs(new Date().toDateString())}
                                    onChange={(newValue) => setValue('date', newValue!.toString())}
                                    sx={{
                                        width: '100%',
                                        '& .MuiInputBase-input': {
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box
                            display="flex"
                            gap={2}
                            mb={2}
                            sx={{
                                flexDirection: { xs: 'column', sm: 'row' }
                            }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimeField
                                    label={t('estimatedRecoveryTime')}
                                    format="HH:mm"
                                    onChange={(newValue) => setValue('ERTime', newValue?.toString())}
                                    fullWidth
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }
                                    }}
                                />
                                <DateField
                                    label={t('estimatedRecoveryDate')}
                                    onChange={(newValue) => setValue('ERDate', newValue?.toString())}
                                    fullWidth
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </CardContent>
                </Card>

                {/* Event Location */}
                <Card sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                    width: '100%',
                    maxWidth: { xs: '100%', md: 'calc(50% - 8px)' },
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardContent sx={{ padding: { xs: 2, sm: 2.5, md: 3 } }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 500,
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
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
                                sx={{
                                    '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Box width="100%" mt={2}>
                {submissionInfo && (
                    <Typography
                        sx={{
                            mt: 1.5,
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                        color="primary"
                        variant="body2"
                    >
                        {submissionInfo}
                    </Typography>
                )}
                {submissionError && (
                    <Typography
                        sx={{
                            mt: 1.5,
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                        color="error"
                        variant="body2"
                    >
                        {submissionError}
                    </Typography>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                    padding: { xs: '10px', sm: '12px' },
                    fontWeight: 'bold',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    textTransform: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    backgroundColor: '#1976d2',
                    marginTop: 2,
                    '&:hover': {
                        backgroundColor: '#125b9b',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                {t('submit')}
            </Button>
        </Box>
    );
};

export default RoutineSection;