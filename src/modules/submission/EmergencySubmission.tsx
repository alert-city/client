"use client";
import React, { useEffect, useState } from 'react';
import { ACCOUNT_TYPE, EVENT_TYPE, DARK, LIGHT } from '@/shared/constants/storage';
import { useRouter } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { Box } from '@mui/material';
import { RouteConfig } from "@/routes/route";
import { IndexConfig } from "@/routes";
import { z } from "zod";
import { createEventSchema } from '@/validation/schemas/event/event.schema';
import { useQuery, useMutation } from '@apollo/client';
import { FIND_USER_BY_USERNAME } from '@/graphql/user';
import { CREATE_EVENT } from '@/graphql/event';
import { USERNAME } from '@/shared/constants/storage';
import ConfirmationDialog from "@/modules/dialog/ConfirmationDialog";
import SuccessDialog from '@/modules/dialog/SuccessDialog';
import EasyToPostSection from '@/modules/submission/EasyToPostSection';
import Cookies from 'js-cookie';
import useTheme from '@/utils/switchTheme';

type EventValues = z.infer<typeof createEventSchema>;

const EmergencySubmissionPage: React.FC = () => {
    const t = useTranslations("EmergencySubmissionPage");
    const t_matter = useTranslations("EasyToPostSection");
    const router = useRouter();
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedMatter, setSelectedMatter] = useState<string | null>(null);
    const [matterTKey, setMatterTKey] = useState<string | null>(null);
    const [checked, setChecked] = useState<boolean>(false);
    const [accountType, setAccountType] = useState<string | null>(null);
    const username = localStorage.getItem(USERNAME);
    const { data } = useQuery(FIND_USER_BY_USERNAME, { variables: { username } });
    const [createEvent] = useMutation(CREATE_EVENT);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {displayTheme, isSystemDark} = useTheme();
    const isDark = displayTheme === DARK ? true : (displayTheme === LIGHT ? false : isSystemDark);

    useEffect(() => {
        const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
        setAccountType(accountType!);
    }, []);

    const handleOpenConfirmDialog = (subject: string, matter: string, matter_t_key: string) => {
        setSelectedSubject(subject);
        setSelectedMatter(matter);
        setMatterTKey(matter_t_key);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

    const handleConfirm = async () => {
        setOpenConfirmDialog(false);
        localStorage.setItem(EVENT_TYPE, "Emergency");
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

    const getDialogContent = () => {
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
            eventType: localStorage.getItem(EVENT_TYPE),
            submitter: data?.findUserByUsername?.id,
            orgName: data?.findUserByUsername?.orgName
        };
        try {
            const { data } = await createEvent({ variables: { input: formattedData } });
            if (data?.createEvent) {
                handleOpenSuccessDialog();
                if (!openSuccessDialog) {
                    setTimeout(async () => {
                        if (accountType === IndexConfig.Organization.AccountType) {
                            router.push(RouteConfig.Admin.Path)
                        } else {
                            router.push(RouteConfig.Staff.Path)
                        }
                    }, 3000);
                }
            }
        } catch (err: any) {
            setSubmitError((err as Error).message);
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
                borderRadius: '16px'
            }}
        >
            <EasyToPostSection
                handleOpenDialog={handleOpenConfirmDialog}
                checked={checked}
                handleChange={handleChange}
                isDark={isDark}
            />
            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                onConfirm={handleConfirm}
                onMouseDown={handleMouseDownConfirm}
                title={t('confirm')}
                content={getDialogContent()}
            />
            <SuccessDialog
                open={openSuccessDialog}
                onClose={handleCloseSuccessDialog}
                title={t('submissionSuccessful')}
                content={t('theEventHasBeenSubmitted')}
            />
        </Box>
    );
};

export default EmergencySubmissionPage;