'use client';
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItemText,
  Divider,
  Card,
  CardContent,
  ListItemButton,
  Typography,
  Box,
} from '@mui/material';
import { ACCOUNT_TYPE } from '@/shared/constants/storage';
import { IndexConfig } from '@/routes';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';

interface SideBarProps {
  selectedSection: string;
  handleSectionClick: (section: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ selectedSection, handleSectionClick }) => {
  const t = useTranslations('ProfileUpdatePage');
  const [accountType, setAccountType] = useState<string>('');

  useEffect(() => {
    const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
    setAccountType(accountType || '');
  }, []);

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          {t('navigation.title')}
        </Typography>
        <List component="nav" sx={{ padding: 0 }}>
          <ListItemButton
            selected={selectedSection === 'Avatar'}
            onClick={() => handleSectionClick('Avatar')}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: selectedSection === 'Avatar' ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <ListItemText primary={t('navigation.avatar')} />
          </ListItemButton>
          <Divider />
          <ListItemButton
            selected={selectedSection === 'Username'}
            onClick={() => handleSectionClick('Username')}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: selectedSection === 'Username' ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <ListItemText primary={t('navigation.username')} />
          </ListItemButton>
          <Divider />
          <ListItemButton
            selected={selectedSection === 'DisplayName'}
            onClick={() => handleSectionClick('DisplayName')}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: selectedSection === 'DisplayName' ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <ListItemText primary={t('navigation.displayName')} />
          </ListItemButton>
          <Divider />
          {accountType === IndexConfig.Personal.AccountType && (
            <ListItemButton
              selected={selectedSection === 'Name'}
              onClick={() => handleSectionClick('Name')}
              sx={{
                borderRadius: 1,
                mb: 1,
                backgroundColor: selectedSection === 'Name' ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              <ListItemText primary={t('navigation.name')} />
            </ListItemButton>
          )}
          {accountType === IndexConfig.Organization.AccountType && (
            <ListItemButton
              selected={selectedSection === 'OrgName'}
              onClick={() => handleSectionClick('OrgName')}
              sx={{
                borderRadius: 1,
                mb: 1,
                backgroundColor: selectedSection === 'OrgName' ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              <ListItemText primary={t('navigation.orgName')} />
            </ListItemButton>
          )}
          <Divider />
          <ListItemButton
            selected={selectedSection === 'Contact'}
            onClick={() => handleSectionClick('Contact')}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: selectedSection === 'Contact' ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <ListItemText primary={t('navigation.contact')} />
          </ListItemButton>
          <Divider />
          <ListItemButton
            selected={selectedSection === 'Security'}
            onClick={() => handleSectionClick('Security')}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: selectedSection === 'Security' ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <ListItemText primary={t('navigation.2FA')} />
          </ListItemButton>
          <Divider />
          <ListItemButton
            selected={selectedSection === 'DeleteAccount'}
            onClick={() => handleSectionClick('DeleteAccount')}
            sx={{
              borderRadius: 1,
              mb: 1,
              color: 'red',
              backgroundColor: selectedSection === 'DeleteAccount' ? 'error.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
              },
            }}
          >
            <ListItemText primary={t('navigation.deleteAccount')} />
          </ListItemButton>
        </List>
      </CardContent>
    </Card>
  );
};

export default SideBar;
