import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme
} from "@mui/material";

export default function ErrorDialog(
    {
        open, onClose, title, content
    }: {
        open: boolean,
        onClose: () => void,
        title: string,
        content: string
    }
) {
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
                    color: theme.palette.error.main,
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: theme.spacing(2),
                    textAlign: "center"
                }}
            >
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: theme.spacing(2),
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="success"
                    sx={{
                        borderRadius: "8px",
                        padding: theme.spacing(1, 3),
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                            backgroundColor: theme.palette.success.dark,
                            transform: "translateY(-3px)"
                        }
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
};