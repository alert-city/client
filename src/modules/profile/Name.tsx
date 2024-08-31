import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore, handleCancel, useUserActions, handleValueChanged } from '@/store/profileState';

const Name: React.FC = () => {
  const { userInfo, isEdit, setIsEdit } = useUserInfoStore();
  const { handleSave } = useUserActions();

  return (
    <>
      <Typography variant="h6" gutterBottom>Name</Typography>
      {(isEdit.name.firstName || isEdit.name.lastName) ?
        <>
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            value={userInfo.name.firstName || ''}
            onChange={(e) => {
              handleValueChanged('firstName', e);
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            value={userInfo.name.lastName || ''}
            onChange={(e) => {
              handleValueChanged('lastName', e);
            }}
          />
        </> :
        <>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginRight: 1 }}>First
              Name:</Typography>
            <Typography variant="body1">{userInfo.name.firstName}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginRight: 1 }}>Last
              Name:</Typography>
            <Typography variant="body1">{userInfo.name.lastName}</Typography>
          </Box>
        </>}
      {(isEdit.name.firstName || isEdit.name.lastName) ?
        <>
          <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => handleSave('name')}>Submit</Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => handleCancel('name')}>Cancel</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, name: { firstName: true, lastName: true } })}>Edit</Button>
      }
    </>
  );
};

export default Name;