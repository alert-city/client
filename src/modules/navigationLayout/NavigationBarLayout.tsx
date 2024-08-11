"use client"
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TopBar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';

const NavigationBarLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: open ? `${240}px` : `calc(${(theme: { spacing: (arg0: number) => any; })  => theme.spacing(7)} + 1px)`,
          ...(open && {
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default NavigationBarLayout;;