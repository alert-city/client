'use client';
import React, { useEffect, useState } from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/navigation';
import { getRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';
import { LOGIN_INFO } from '@/shared/constants/storage';
import { getPageByKey, PAGE_KEY } from '@/pages/pageConfig';
import Tooltip from '@mui/material/Tooltip';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PublishIcon from '@mui/icons-material/Publish';
import MailIcon from '@mui/icons-material/Mail';

const iconMap: { [key: string]: React.ReactNode } = {
  Review: <AssignmentTurnedInIcon />,
  Submission: <PublishIcon />,
};

const drawerWidth = 240;

interface LoginInfo {
  role?: string;
  accountType?: string;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

interface SidebarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  const router = useRouter();
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoginInfo(JSON.parse(localStorage.getItem(LOGIN_INFO) || '{}'));
    }
  }, []);

  const accountType = loginInfo?.accountType || '';
  const submissionPath = getRouteByKey(ROUTE_KEY.SUBMISSION).name;
  const reviewPath = getRouteByKey(ROUTE_KEY.REVIEW).name;

  let page:string[] = [];
  if (accountType === getPageByKey(PAGE_KEY.ORGANIZATION).accountType) {
    page = getPageByKey(PAGE_KEY.SIDE_BAR_ADMIN)?.page || [];
  } else if (accountType === getPageByKey(PAGE_KEY.PERSONAL).accountType) {
    page = getPageByKey(PAGE_KEY.SIDE_BAR_PERSONAL)?.page || [];
  }

  const handleClick = (item: string) => {
    if (accountType === getPageByKey(PAGE_KEY.ORGANIZATION).accountType) {
      if (item === 'Submission') {
        router.push(`/admin/${submissionPath}`);
      } else if (item === 'Review') {
        router.push(`/admin/${reviewPath}`);
      }
    } else if (accountType === getPageByKey(PAGE_KEY.PERSONAL).accountType) {
      if (item === 'Submission') {
        router.push(`/staff/${submissionPath}`);
      }
    }
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {page.map((
          item,
        ) => (
          <Tooltip key={item} title={item} placement="right" arrow disableHoverListener={open}>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleClick(item)}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {iconMap[item] || <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={item} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;