"use client";
import React, { useEffect, useState } from 'react';
import { EMERGENCY, ID } from '@/shared/constants/storage';
import { useTranslations } from 'next-intl';
import { Box } from '@mui/material';
import { z } from "zod";
import { createEventSchema } from '@/validation/schemas/event/event.schema';
import { useQuery, useMutation } from '@apollo/client';
import { FIND_ONE_USER } from '@/graphql/user';
import { CREATE_EVENT } from '@/graphql/event';
import ConfirmationDialog from "@/modules/dialog/ConfirmationDialog";
import SuccessDialog from '@/modules/dialog/SuccessDialog';
import EasyToPostSection from '@/modules/submission/EasyToPostSection';
import ErrorDialog from '../dialog/ErrorDialog';

type EventValues = z.infer<typeof createEventSchema>;

const EmergencySubmissionPage: React.FC = () => {
    const t = useTranslations("EmergencySubmissionPage");
    const t_matter = useTranslations("EasyToPostSection");
    const [userId, setUserId] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
    const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedMatter, setSelectedMatter] = useState<string | null>(null);
    const [matterTKey, setMatterTKey] = useState<string | null>(null);
    const [checked, setChecked] = useState<boolean>(false);
    const { data } = useQuery(FIND_ONE_USER, { variables: { id: userId! }, skip: !userId });
    const [createEvent] = useMutation(CREATE_EVENT);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        setUserId(localStorage.getItem(ID)!);
    }, []);

    const handleOpenConfirmDialog = (subject: string, matter: string, matter_t_key: string) => {
        setSelectedSubject(subject);
        setSelectedMatter(matter);
        setMatterTKey(matter_t_key);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

    const handleConfirm = async () => {
        handleCloseConfirmDialog();
        await onSubmit(
            {
                date: new Date().toDateString(),
                time: new Date().toTimeString(),
                subject: selectedSubject!,
                matter: selectedMatter!
            }
        );
    };

    const handleChange = () => setChecked((prev) => !prev);

    const handleOpenSuccessDialog = () => setOpenSuccessDialog(true);

    const handleCloseSuccessDialog = () => setOpenSuccessDialog(false);

    const handleOpenErrorDialog = () => setOpenErrorDialog(true);

    const handleCloseErrorDialog = () => setOpenErrorDialog(false);

    const getConfirmDialogContent = () => {
        if (matterTKey) {
            let content = t("areYouSureYouWantToPost");
            content += " ";
            content += t_matter(matterTKey!);
            content += " ";
            content += t("question");
            return content;
        }
        return "";
    }

    const handleMouseDownConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit = async (eventData: EventValues) => {
        const formattedData = {
            ...eventData,
            eventType: EMERGENCY,
            submitter: data?.findOneUser?.id,
            orgName: data?.findOneUser?.orgName,
            isReviewed: true,
            isApproved: true
        };
        try {
            const { data } = await createEvent({ variables: { input: formattedData } });
            if (data?.createEvent) {
                handleOpenSuccessDialog();
                setSelectedSubject(null);
                setSelectedMatter(null);
                setMatterTKey(null);
                setChecked(false);
            }
        } catch (err: any) {
            setSubmitError((err as Error).message);
            handleOpenErrorDialog();
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
                paddingTop: { xs: 20, sm: 6, md: 4 }
            }}
        >
            <EasyToPostSection
                handleOpenDialog={handleOpenConfirmDialog}
                checked={checked}
                handleChange={handleChange}
            />
            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                onConfirm={handleConfirm}
                onMouseDown={handleMouseDownConfirm}
                title={t('confirm')}
                content={getConfirmDialogContent()}
            />
            <SuccessDialog
                open={openSuccessDialog}
                onClose={handleCloseSuccessDialog}
                title={t('submissionSuccessful')}
                content={t('theEventHasBeenSubmitted')}
            />
            <ErrorDialog
                open={openErrorDialog}
                onClose={handleCloseErrorDialog}
                title={t('submissionError')}
                content={submitError!}
            />
        </Box>
    );
};

export default EmergencySubmissionPage;