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
    <div>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
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
      >
        <Typography sx={{ p: 1 }}>{t('hoverStaySignedIn')}</Typography>
      </Popover>
    </div>
  );
}
