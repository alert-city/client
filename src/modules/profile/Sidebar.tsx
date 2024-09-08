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
import Person from '@mui/icons-material/Person';
import Badge from '@mui/icons-material/Badge';
import PersonPin from '@mui/icons-material/PersonPin';
import BadgeIcon from '@mui/icons-material/Badge';
import Business from '@mui/icons-material/Business';
import ContactPhone from '@mui/icons-material/ContactPhone';
import Security from '@mui/icons-material/Security';
import DeleteForever from '@mui/icons-material/DeleteForever';

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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Person />
              <ListItemText primary={t('navigation.avatar')} />
            </Box>
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Badge />
              <ListItemText primary={t('navigation.username')} />
            </Box>
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <PersonPin />
              <ListItemText primary={t('navigation.displayName')} />
            </Box>
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
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <BadgeIcon />
                <ListItemText primary={t('navigation.name')} />
              </Box>
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
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Business />
                <ListItemText primary={t('navigation.orgName')} />
              </Box>
            </ListItemButton>
          )}
          <Divider />
          <ListItemButton
            selected={selectedSection === 'PhoneNumber'}
            onClick={() => handleSectionClick('PhoneNumber')}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: selectedSection === 'PhoneNumber' ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <ContactPhone />
              <ListItemText primary={t('navigation.phoneNumber')} />
            </Box>
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Security />
              <ListItemText primary={t('navigation.2FA')} />
            </Box>
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <DeleteForever />
              <ListItemText primary={t('navigation.deleteAccount')} />
            </Box>
          </ListItemButton>
        </List>
      </CardContent>
    </Card>
  );
};

export default SideBar;
