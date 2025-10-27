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
                "& .MuiPaper-root": {
                    borderRadius: "16px",
                    padding: { xs: theme.spacing(2), sm: theme.spacing(3) },
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(8px)",
                    maxWidth: { xs: '90%', sm: '500px' },
                    width: '100%',
                    margin: { xs: 2, sm: 'auto' }
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    paddingBottom: { xs: theme.spacing(0.5), sm: theme.spacing(1) },
                    color: theme.palette.primary.main,
                    padding: { xs: theme.spacing(1), sm: theme.spacing(2) }
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                    textAlign: "center"
                }}>
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                >
                    {content}
                </Typography>
            </DialogContent>
            <Box display="flex" justifyContent="center">
                <DialogActions
                    sx={{
                        width: { xs: '100%', sm: '250px' },
                        padding: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                        display: "flex",
                        justifyContent: "space-between",
                        gap: { xs: 1, sm: 0 }
                    }}
                >
                    <Button
                        onClick={onClose}
                        color="warning"
                        variant="contained"
                        sx={{
                            width: { xs: '45%', sm: '80px' },
                            borderRadius: "8px",
                            color: "#000",
                            fontWeight: "bold",
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            padding: { xs: theme.spacing(0.75, 1), sm: theme.spacing(1, 2) },
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
                            width: { xs: '45%', sm: '80px' },
                            borderRadius: "8px",
                            color: "#000",
                            fontWeight: "bold",
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            padding: { xs: theme.spacing(0.75, 1), sm: theme.spacing(1, 2) },
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