'use client';
import React from 'react';
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
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useRevokeTokens } from '@/hooks/useRevokeTokens';
import { IndexConfig } from '@/routes';
import { RouteConfig } from '@/routes/route';


interface TopBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

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
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const revokeTokens = useRevokeTokens();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = IndexConfig.Setting.Page || [];

  const handleSettingClick = async (setting: string) => {
    handleCloseUserMenu();
    if (setting === 'Logout') {
      await revokeTokens()
    } else if (setting === 'Profile') {
      router.push(RouteConfig.Profile.Path);
    } else if (setting === 'Reset Password') {
      router.push(RouteConfig.ResetPassword.Path);
    }
  };

  return (
    <StyledAppBar position="fixed" open={open}>
      <Box sx={{ width: '100%' }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', display: 'flex', padding: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '30px' }}>
              <Tooltip title="Open Sidebar">
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
            <Avatar src="../favicon.ico" alt="icon" sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={RouteConfig.Login.Path}
              onClick={ async (e) => {
                await revokeTokens();
              }}
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                // letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Alert City
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '30px' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
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