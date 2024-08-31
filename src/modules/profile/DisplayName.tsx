import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore, handleCancel, handleValueChanged, useUserActions } from '@/store/profileState';
import { useTopbarStore } from '@/store/topBar';

const DisplayName: React.FC = () => {
  const { userInfo, setUserInfo, isEdit, setIsEdit } = useUserInfoStore();
  const { handleSave } = useUserActions();
  const { setUpdatedDisplayName } = useTopbarStore();

  return (
    <>
      <Typography variant="h6" gutterBottom>Display Name</Typography>
      {isEdit.displayName ?
        <TextField
          fullWidth
          label="Display Name"
          margin="normal"
          value={userInfo.displayName || ''}
          onChange={(e) => {
            handleValueChanged('displayName', e);
          }}
        />
        : <Typography>{userInfo.displayName}</Typography>}
      {isEdit.displayName ?
        <>
          <Button variant="contained" sx={{ marginTop: 2 }}
                  onClick={async () => {
                    await handleSave('displayName');
                    setUpdatedDisplayName(userInfo.displayName);
                  }}>
            Submit
          </Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => handleCancel('displayName')}>Cancel</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, displayName: true })}>Edit</Button>
      }
    </>
  );
};

export default DisplayName;