'use client';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useLogout } from '@/hooks/useLogout';
import { IndexConfig } from '@/routes';
import { RouteConfig } from '@/routes/route';
import { DISPLAY_NAME, AVATAR_URL } from '@/shared/constants/storage';
import { useTopbarStore } from '@/store/topBarState';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { AccountCircle } from '@mui/icons-material';
import Tune from '@mui/icons-material/Tune';
import Logout from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import { VpnKey } from '@mui/icons-material';
import getIconUrl from '@/utils/getIconUrl';

interface TopBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  profile: <AccountCircle />,
  resetPassword: <VpnKey />,
  preferences: <Tune />,
  logout: <Logout />,
};

const StyledAppBar = styled(AppBar)<{ open: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240,
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar: React.FC<TopBarProps> = ({ open, handleDrawerOpen }) => {
  const t = useTranslations('TopBar');
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const logout = useLogout();
  const { avatarUrl: avatarUrlFromStore, displayName: displayNameFromStore } = useTopbarStore();
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const iconUrl = getIconUrl();

  useEffect(() => {
    setAvatarUrl(localStorage.getItem(AVATAR_URL) || '');
    setDisplayName(localStorage.getItem(DISPLAY_NAME) || '');
  }, []);

  useEffect(() => {
    if (avatarUrlFromStore) {
      setAvatarUrl(avatarUrlFromStore);
    }
    if (displayNameFromStore) {
      setDisplayName(displayNameFromStore);
    }
  }, [avatarUrlFromStore, displayNameFromStore]);

  useEffect(() => {
    if (avatarUrl) {
      const img = new Image();
      img.src = avatarUrl;
      img.onload = () => {
        setIsAvatarLoading(false);
      };
      img.onerror = () => {
        setIsAvatarLoading(false);
      };
    } else {
      setIsAvatarLoading(false);
    }
  }, [avatarUrl]);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = IndexConfig.Setting.Page || [];

  const handleSettingClick = async (setting: string) => {
    handleCloseUserMenu();
    if (setting === t('logout')) {
      await logout();
    } else if (setting === t('profile')) {
      router.push(RouteConfig.Profile.Path);
    } else if (setting === t('resetPassword')) {
      router.push(RouteConfig.ResetPassword.Path);
    } else if (setting === t('preferences')) {
      router.push(RouteConfig.Preferences.Path);
    }
  };

  return (
    <StyledAppBar position="fixed" open={open}>
      <Box sx={{ width: '100%' }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', display: 'flex', padding: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '25px' }}>
            <Tooltip title={t('openSidebarHover')}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 1,
                  visibility: open ? 'hidden' : 'visible',
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Avatar src={iconUrl} alt="icon" sx={{ ml: 1, mr: 2 }} />
            <Typography
              variant="h6" noWrap onClick={async (e) => {
              await logout();
            }}
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Alert City
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '30px' }}>
            <Tooltip title={t('openSettingHover')}>
              <IconButton onClick={handleOpenUserMenu}
                          sx={{ p: 0, '&:hover': { backgroundColor: 'transparent', shadowboxShadow: 'none' } }}>
                {isAvatarLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt="Avatar" src={avatarUrl || undefined} />
                )
                }
                <Typography sx={{ ml: 2, fontWeight: 'bold', color: '#FFFFFF' }}>
                  {displayName}
                </Typography>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser || undefined}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings && settings.map((setting: string) => (
                <MenuItem key={setting} onClick={() => handleSettingClick(t(setting))}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {iconMap[setting] || <MailIcon />}
                    <Typography textAlign="center">{t(setting)}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Box>
    </StyledAppBar>
  );
};

export default TopBar;