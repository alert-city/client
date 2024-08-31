import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useUserInfoStore,handleCancel, handleValueChanged, useUserActions } from '@/store/profileState';

const OrgName: React.FC = () => {
  const { userInfo, setUserInfo, isEdit, setIsEdit,requestError } = useUserInfoStore();
  const { handleSave } = useUserActions();

  return (
    <>
      <Typography variant="h6" gutterBottom>Organization Name</Typography>
      {isEdit.orgName ?
        <TextField
          fullWidth
          label="Organization Name"
          margin="normal"
          value={userInfo.orgName || ''}
          onChange={(e) => {
            handleValueChanged('orgName', e);
          }}
        />
        : <Typography>{userInfo.orgName}</Typography>}
      {requestError && (
        <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error"
                    variant="body2">
          {requestError}
        </Typography>
      )}
      {isEdit.orgName ?
        <>
          <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => handleSave('orgName')}>Submit</Button>
          <Button variant="contained" sx={{ marginTop: 2, marginLeft: 2 }}
                  onClick={() => handleCancel('orgName')}>Cancel</Button>
        </>
        :
        <Button variant="contained" sx={{ marginTop: 2 }}
                onClick={() => setIsEdit({ ...isEdit, orgName: true })}>Edit</Button>
      }
    </>
  );
};

export default OrgName;