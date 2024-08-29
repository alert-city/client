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
import { ACCOUNT_TYPE } from '@/shared/constants/storage';
import Tooltip from '@mui/material/Tooltip';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MailIcon from '@mui/icons-material/Mail';
import PeopleIcon from '@mui/icons-material/People';
import { IndexConfig } from '@/routes';
import { RouteConfig } from '@/routes/route';
import Cookies from 'js-cookie';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const iconMap: { [key: string]: React.ReactNode } = {
  Dashboard: <SpaceDashboardIcon />,
  Review: <AssignmentTurnedInIcon />,
  Emergency: <WarningIcon />,
  Routine: <CalendarMonthIcon />,
  Staff: <PeopleIcon />,
};

const drawerWidth = 240;

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
  const t = useTranslations('Sidebar');
  const theme = useTheme();
  const router = useRouter();
  const [accountType, setAccountType] = useState<String | null>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
      setAccountType(accountType || "");
    }
  }, []);

  let page: string[] = [];
  if (accountType === IndexConfig.Organization.AccountType) {
    page = IndexConfig.SideBarAdmin.Page || [];
  } else if (accountType === IndexConfig.Personal.AccountType) {
    page = IndexConfig.SideBarPersonal.Page || [];
  }

  const handleClick = (item: string) => {
    if (accountType === IndexConfig.Organization.AccountType) {
      if (item === t('Dashboard')) {
        router.push('/admin' + RouteConfig.Dashboard.Path);
      } else if (item === t('Emergency')) {
        router.push('/admin' + RouteConfig.Submission.Path + RouteConfig.EmergencySubmission.Path);
      } else if (item === t('Routine')) {
        router.push('/admin' + RouteConfig.Submission.Path + RouteConfig.RoutineSubmission.Path);
      } else if (item === t('Review')) {
        router.push('/admin' + RouteConfig.Review.Path);
      } else if (item === t('Staff')) {
        router.push('/admin' + RouteConfig.StaffManagement.Path);
      }
    } else if (accountType === IndexConfig.Personal.AccountType) {
      if (item === t('Routine')) {
        router.push('/staff' + RouteConfig.Dashboard.Path);
      } else if (item === t('Routine')) {
        router.push('/staff' + RouteConfig.Submission.Path + RouteConfig.RoutineSubmission.Path);
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
          <Tooltip key={item} title={t(item)} placement="right" arrow disableHoverListener={open}>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleClick(t(item))}>
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
                <ListItemText primary={t(item)} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;