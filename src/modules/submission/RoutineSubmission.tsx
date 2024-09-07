'use client';
import React, { useEffect, useState } from 'react';
import { ACCOUNT_TYPE, EVENT_TYPE } from '@/shared/constants/storage';
import { useRouter } from '@/i18n/routing';
import { useTheme, useMediaQuery } from '@mui/material';
import { RouteConfig } from '@/routes/route';
import { IndexConfig } from '@/routes';
import { z } from 'zod';
import { createEventSchema } from '@/validation/schemas/event/event.schema';
import { useQuery, useMutation } from '@apollo/client';
import { FIND_USER_BY_USERNAME } from '@/graphql/user';
import { CREATE_EVENT } from '@/graphql/event';
import { USERNAME } from '@/shared/constants/storage';
import RoutineSection from '@/modules/submission/RoutineSection';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';

type EventValues = z.infer<typeof createEventSchema>;

const RoutineSubmissionPage: React.FC = () => {
  const t = useTranslations('RoutineSubmissionPage');
  const router = useRouter();
  const [accountType, setAccountType] = useState<string | null>(null);
  const username = localStorage.getItem(USERNAME);
  const { data } = useQuery(FIND_USER_BY_USERNAME, { variables: { username } });
  const [createEvent] = useMutation(CREATE_EVENT);
  const [submissionStatus, setSubmissionStatus] = useState<boolean>(false);
  const [submissionInfo, setSubmissionInfo] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
    setAccountType(accountType!);
  }, []);

  const onSubmit = async (eventData: EventValues) => {
    const formattedData = {
      ...eventData,
      eventType: Cookies.get(EVENT_TYPE),
      submitter: data?.findUserByUsername?.id,
      orgName: data?.findUserByUsername?.orgName,
    };
    try {
      const { data } = await createEvent({ variables: { input: formattedData } });
      if (data?.createEvent) {
        setSubmissionStatus(true);
        let countdown = 4;
        setSubmissionInfo(`${t('submissionInfo')} ${countdown} ${t('seconds')}`);
        const intervalId = setInterval(() => {
          countdown -= 1;
          setSubmissionInfo(`${t('submissionInfo')} ${countdown} ${t('seconds')}`);
          if (countdown === 0) {
            clearInterval(intervalId);
            if (accountType === IndexConfig.Organization.AccountType) {
              router.push(RouteConfig.Admin.Path);
            } else {
              router.push(RouteConfig.Staff.Path);
            }
          }
        }, 1000);
      }
    } catch (err: any) {
      setSubmissionError((err as Error).message);
    }
  };

  return (
    <RoutineSection
      onSubmit={onSubmit}
      isMobile={isMobile}
      submissionStatus={submissionStatus}
      submissionInfo={submissionInfo}
      submissionError={submissionError}
    />
  );
};

export default RoutineSubmissionPage;