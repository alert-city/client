import React from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

interface ReminderModalProps {
  open: boolean;
  handleClose: () => void;
  content: React.ReactNode;
  onSubmit: () => void;
  value?: string;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ open, handleClose, content, onSubmit,value }) => {
  const handleSubmit = () => {
    onSubmit();
    // handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
            <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
              Reminder
            </Typography>
            <Box id="modal-description" mb={2}>
              {`Are you sure you want to update ${content} to ${value}?`}
            </Box>
            <Box display="flex" justifyContent="flex-end" sx={{ gap: 2 }}>
              <Button onClick={handleClose} sx={{ marginRight: 1 }}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Box>
      </Box>
    </Modal>
  );
};

export default ReminderModal;