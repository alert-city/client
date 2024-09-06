import React from 'react';
import Preferences from '@/modules/preferences/Preferences';
import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SettingModalProps {
  open: boolean;
  handleClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          p: 4,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: 'fixed', top: 40, right: 40 }}>
          <CloseIcon />
        </IconButton>
        <Preferences />
      </Box>
    </Modal>
  );
};

export default SettingModal;