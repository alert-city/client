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

export default function SuccessDialog(
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
                    color: theme.palette.success.main,
                    padding: { xs: theme.spacing(1), sm: theme.spacing(2) }
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                    textAlign: "center"
                }}
            >
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}>
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
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
                        padding: { xs: theme.spacing(0.75, 2), sm: theme.spacing(1, 3) },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        minWidth: { xs: '80px', sm: '100px' },
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