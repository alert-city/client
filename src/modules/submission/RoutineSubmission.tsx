'use client';
import React, { useState } from 'react';
import { ID, ROUTINE } from '@/shared/constants/storage';
import { z } from 'zod';
import { createEventSchema } from '@/validation/schemas/event/event.schema';
import { useQuery, useMutation } from '@apollo/client';
import { FIND_ONE_USER } from '@/graphql/user';
import { CREATE_EVENT } from '@/graphql/event';
import RoutineSection from '@/modules/submission/RoutineSection';
import { useTranslations } from 'next-intl';

type EventValues = z.infer<typeof createEventSchema>;

const RoutineSubmissionPage: React.FC = () => {
  const t = useTranslations('RoutineSubmissionPage');
  const userId = localStorage.getItem(ID);
  const { data } = useQuery(FIND_ONE_USER, { variables: { id: userId }, skip: !userId });
  const [createEvent] = useMutation(CREATE_EVENT);
  const [submissionStatus, setSubmissionStatus] = useState<boolean>(false);
  const [submissionInfo, setSubmissionInfo] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const onSubmit = async (eventData: EventValues) => {
    const formattedData = {
      ...eventData,
      eventType: ROUTINE,
      submitter: data?.findOneUser?.id,
      orgName: data?.findOneUser?.orgName,
    };
    try {
      const { data } = await createEvent({ variables: { input: formattedData } });
      if (data?.createEvent) {
        setSubmissionStatus(true);
        setSubmissionInfo(t('submissionInfo'));
        let countDown = 3;
        const intervalId = setInterval(() => {
          countDown -= 1;
          if (countDown === 0) {
            clearInterval(intervalId);
            setSubmissionStatus(false);
            setSubmissionInfo(null);
            setSubmissionError(null);
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
      submissionStatus={submissionStatus}
      submissionInfo={submissionInfo}
      submissionError={submissionError}
    />
  );
};

export default RoutineSubmissionPage;