"use client";
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_EVENT } from '@/graphql/event';
import { useTranslations } from 'next-intl';
import '@fontsource/poppins';
import {z} from "zod";
import { reviewEventSchema } from '@/validation/schemas/review-event/review-event.schema';
import DisplayUnreviewedEvents from '@/modules/review/DisplayUnreviewedEvents';
import ConfirmationDialog from '@/modules/dialog/ConfirmationDialog';
import SuccessDialog from '@/modules/dialog/SuccessDialog';
import ErrorDialog from '@/modules/dialog/ErrorDialog';

type ReviewValues = z.infer<typeof reviewEventSchema>;

const ReviewModule: React.FC = () => {
    const t = useTranslations("ReviewPage");
    const [eventId, setEventId] = useState<string | null>(null);
    const [approved, setApproved] = useState<boolean | null>(null);
    const [reviewComment, setReviewComment] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
    const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [reloadEvents, setReloadEvents] = useState<boolean>(false);
    const [updateEvent] = useMutation(UPDATE_EVENT);

    const handleOpenConfirmDialog = (
        eventId: string,
        passed: boolean,
        reviewComment: string | null
    ) => {
        setEventId(eventId);
        setApproved(passed);
        setReviewComment(reviewComment);
        setOpenConfirmDialog(true)
    };

    const handleConfirm = async () => {
        setOpenConfirmDialog(false);
        await handleReview({
            id: eventId!,
            isReviewed: true,
            isApproved: approved!,
            reviewComment: reviewComment || undefined
        });
    };

    const handleMouseDownConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleReview = async (reviewData: ReviewValues) => {
        try {
            const { data } = await updateEvent({ variables: {input: reviewData} });
            if (data?.updateEvent) {
                setOpenSuccessDialog(true);
                setEventId(null);
                setApproved(null);
                setReviewComment(null);
            }
        } catch (err: any) {
            setUpdateError((err as Error).message);
            setOpenErrorDialog(true);
        }
    };

    useEffect(() => {
        if (openSuccessDialog) {
            setReloadEvents(true);
            setTimeout(() => setReloadEvents(false), 1000);
        }
    }, [openSuccessDialog]);

    return (
        <>
            <DisplayUnreviewedEvents
                handleOpenConfirmDialog={handleOpenConfirmDialog}
                reload={reloadEvents}
            />
            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                onConfirm={handleConfirm}
                onMouseDown={handleMouseDownConfirm}
                title={t("confirm")}
                content={t("confirmSubmission")}
            />
            <SuccessDialog
                open={openSuccessDialog}
                onClose={() => setOpenSuccessDialog(false)}
                title={t("reviewSubmitted")}
                content={t("hasBeenSubmited")}
            />
            <ErrorDialog
                open={openErrorDialog}
                onClose={() => setOpenErrorDialog(false)}
                title={t("submissionError")}
                content={updateError!}
            />
        </>
    );
};

export default ReviewModule;