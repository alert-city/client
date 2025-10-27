import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';

interface MouseHoverPopoverProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

export default function MouseHoverPopover({ anchorEl, onClose }: MouseHoverPopoverProps) {
    const open = Boolean(anchorEl);
    const t = useTranslations('LoginPage');

    return (
        <Popover
            id="mouse-over-popover"
            sx={{
                pointerEvents: 'none',
                maxWidth: { xs: '90vw', sm: '400px', md: '66rem' },
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            onClose={onClose}
            disableRestoreFocus
            PaperProps={{
                sx: {
                    maxWidth: { xs: '90vw', sm: '400px', md: '66rem' },
                },
            }}
        >
            <Typography
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                }}
            >
                {t('hoverStaySignedIn')}
            </Typography>
        </Popover>
    );
}