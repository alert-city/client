'use client';
import React, { useEffect, useState } from 'react';
import { ID, ROUTINE, ACCOUNT_TYPE } from '@/shared/constants/storage';
import { z } from 'zod';
import { createEventSchema } from '@/validation/schemas/event/event.schema';
import { useQuery, useMutation } from '@apollo/client';
import { FIND_ONE_USER } from '@/graphql/user';
import { CREATE_EVENT } from '@/graphql/event';
import RoutineSection from '@/modules/submission/RoutineSection';
import { useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { IndexConfig } from '@/routes';
import { Box } from '@mui/material';

type EventValues = z.infer<typeof createEventSchema>;

const RoutineSubmissionPage: React.FC = () => {
    const t = useTranslations('RoutineSubmissionPage');
    const [userId, setUserId] = useState<string | null>(null);
    const { data } = useQuery(FIND_ONE_USER, { variables: { id: userId }, skip: !userId });
    const [createEvent] = useMutation(CREATE_EVENT);
    const [accountType, setAccountType] = useState<string | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<boolean>(false);
    const [submissionInfo, setSubmissionInfo] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    useEffect(() => {
        setUserId(localStorage.getItem(ID)!);
        const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
        if (accountType) {
            setAccountType(accountType);
        }
    }, []);

    const onSubmit = async (eventData: EventValues) => {
        const formattedData = {
            ...eventData,
            eventType: ROUTINE,
            submitter: data?.findOneUser?.id,
            orgName: data?.findOneUser?.orgName,
            isReviewed: accountType === IndexConfig.Organization.AccountType ? true : false,
            isApproved: accountType === IndexConfig.Organization.AccountType ? true : false,
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
        <Box
            component="main"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
            width="100%"
            gap={2}
            mb={2}
            sx={{
                borderRadius: '16px',
                padding: { xs: 2, sm: 3, md: 4 },
                paddingTop: { xs: 20, sm: 6, md: 4 },
            }}
        >
            <RoutineSection
                onSubmit={onSubmit}
                submissionStatus={submissionStatus}
                submissionInfo={submissionInfo}
                submissionError={submissionError}
            />
        </Box>
    );
};

export default RoutineSubmissionPage;