import React from 'react';
import Preferences from '@/modules/preferences/Preferences';
import { Box, Modal } from '@mui/material';

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
                    width: { xs: '95%', sm: '90%', md: '80%' },
                    maxHeight: { xs: '90vh', sm: '85vh' },
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Preferences showCloseButton={true} onClose={handleClose} />
            </Box>
        </Modal>
    );
};

export default SettingModal;