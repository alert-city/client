'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TopBar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';
import styled from '@mui/material/styles/styled';
import { useMediaQuery, useTheme } from '@mui/material';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isCentered' })<{
  open?: boolean;
  isCentered?: boolean;
  isLargeScreen?: boolean;
}>(({ theme, open, isCentered, isLargeScreen }) => ({
  width: '100%',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyItems: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  height: isLargeScreen ? '100vh' : '100%',
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
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


const NavigationBarLayout: React.FC<React.PropsWithChildren<{ isCentered?: boolean }>> = ({
  children,
  isCentered = false,
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

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
      <Main open={open} isCentered={isCentered} isLargeScreen={isLargeScreen}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default NavigationBarLayout;