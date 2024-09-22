import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme,
    Typography,
    Box
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
                    padding: theme.spacing(3),
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)"
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    paddingBottom: theme.spacing(1),
                    color: theme.palette.primary.main,
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: theme.spacing(2),
                    textAlign: "center"
                }}>
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >
                    {content}
                </Typography>
            </DialogContent>
            <Box display="flex" justifyContent="center">
                <DialogActions
                    sx={{
                        width: "250px",
                        padding: theme.spacing(2),
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        onClick={onClose}
                        color="warning"
                        variant="contained"
                        sx={{
                            width: "80px",
                            borderRadius: "8px",
                            color: "#000",
                            fontWeight: "bold",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            "&:hover": {
                                color: "#fff",
                                backgroundColor: theme.palette.warning.dark,
                                transform: "translateY(-3px)"
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
                            width: "80px",
                            borderRadius: "8px",
                            color: "#000",
                            fontWeight: "bold",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            "&:hover": {
                                color: "#fff",
                                backgroundColor: theme.palette.primary.dark,
                                transform: "translateY(-3px)"
                            }
                        }}
                    >
                        {t("confirm")}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
};