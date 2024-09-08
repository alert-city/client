import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme,
    Typography
} from "@mui/material";
import { useTranslations } from "next-intl";

export default function ConfirmationDialog(
    {
        open, onClose, onConfirm, onMouseDown, title, content
    }: {
        open: boolean,
        onClose: () => void,
        onConfirm: () => void,
        onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void,
        title: string,
        content: string
    }
) {
    const t = useTranslations("EmergencySubmissionPage");
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
                transition: "transform 0.3s ease-in-out",
                "& .MuiPaper-root": {
                    borderRadius: "16px",
                    padding: theme.spacing(2),
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    paddingBottom: theme.spacing(1),
                    color: theme.palette.primary.main
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", padding: theme.spacing(3) }}>
                <Typography variant="body2" color="textSecondary" border="none">
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: theme.spacing(2),
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        color: theme.palette.error.main,
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "rgba(255, 0, 0, 0.1)"
                        }
                    }}
                >
                    {t("cancel")}
                </Button>
                <Button
                    onClick={onConfirm}
                    onMouseDown={onMouseDown}
                    color="primary"
                    variant="contained"
                    sx={{
                        borderRadius: "8px",
                        padding: theme.spacing(1, 3),
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                            transform: "translateY(-3px)"
                        }
                    }}
                >
                    {t("confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    )
};