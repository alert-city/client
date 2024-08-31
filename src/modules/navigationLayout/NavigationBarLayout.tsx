'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TopBar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';
import styled from '@mui/material/styles/styled';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open'&& prop !== 'isCentered' })<{
  open?: boolean;
  isCentered?: boolean;
}>(({ theme, open, isCentered }) => ({
  width: '100%',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: isCentered ? 'center' : 'flex-start',
  // justifyContent:  'center',
  alignItems: 'center',
  // height: isCentered ? '100vh' : '100%',
  height: '100vh',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


const NavigationBarLayout: React.FC<React.PropsWithChildren<{ isCentered?: boolean }>> = ({
                                                                                            children,
                                                                                            isCentered = false,
                                                                                          }) => {
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
      <Main open={open} isCentered={isCentered}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default NavigationBarLayout;