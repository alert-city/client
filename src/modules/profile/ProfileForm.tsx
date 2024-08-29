'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import SideBar from '@/modules/profile/Sidebar';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import DeleteAccount from '@/modules/profile/DeleteAccount';
import AvatarEditor from '@/modules/profile/AvatarEditor';
import Contact from '@/modules/profile/Contact';
import TwoFA from '@/modules/profile/TwoFA';
import DisplayName from '@/modules/profile/DisplayName';
import Username from '@/modules/profile/Username';
import OrgName from '@/modules/profile/OrgName';
import Name from '@/modules/profile/Name';
import { useUserInfoStore } from '@/store/profileState';
import { useFindOneUserById } from '@/modules/profile/useHandleRequest';
import { USERNAME, ID } from '@/shared/constants/storage';
import { useTranslations } from 'next-intl';

const ProfileForm: React.FC = () => {
        const t = useTranslations('ProfileUpdatePage');
        const {
                userInfo,
                setUserInfo,
                isEdit,
                setIsEdit,
                isValueChange,
                setIsValueChange,
                selectedSection,
                setSelectedSection,
                initialUserInfo,
                setInitialUserInfo,
                loading,
                setLoading,
                storedUsername,
                storedId,
                setStoredId,
                setStoredUsername,
                setRequestError,
              } = useUserInfoStore();

        useEffect(() => {
          const id = localStorage.getItem(ID) || '';
          const username = localStorage.getItem(USERNAME) || '';
          setStoredId(id);
          setStoredUsername(username);
        }, []);

        const { data } = useFindOneUserById(storedId);
        useEffect(() => {
          if (data) {
            const newUserInfo = {
              displayName: data.displayName || '',
              mobilePhone: data.mobilePhone || '',
              username: data.username || '',
              avatarUrl: data.avatarUrl || '',
              name: {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
              },
              is2FAEnabled: data.is2FAEnabled || false,
              orgName: data.orgName || '',
            };
            setUserInfo(newUserInfo);
            setInitialUserInfo(newUserInfo);
          }
        }, [data]);

        const handleSectionClick = (section: string) => {
          setSelectedSection(section);
          setRequestError('');
        };

        return (
          <Box sx={{ padding: 3, width: '100%', maxWidth: 1000, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>{t('title')}</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ width: { xs: '100%', md: '25%' }, flexGrow: 1 }}>
                <SideBar selectedSection={selectedSection} handleSectionClick={handleSectionClick} />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '75%' }, flexGrow: 2 }}
              >
                <Card>
                  <CardContent>
                    {(selectedSection === 'Avatar' && userInfo) && (
                      <AvatarEditor />
                    )}
                    {(selectedSection === 'Name' && userInfo) && (
                      <Name />
                    )}
                    {(selectedSection === 'OrgName' && userInfo) && (
                      <OrgName />
                    )}
                    {(selectedSection === 'Contact' && userInfo) && (
                      <Contact />
                    )}
                    {(selectedSection === 'Username' && userInfo) && (
                      <Username />
                    )}
                    {(selectedSection === 'DisplayName' && userInfo) && (
                      <DisplayName />
                    )}
                    {selectedSection === 'Security' && (
                      <TwoFA />
                    )}
                    {(selectedSection === 'DeleteAccount' && userInfo) && (
                      <DeleteAccount />
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
            <LoadingOverlay loading={loading} />
          </Box>
        );
      }
;

export default ProfileForm;