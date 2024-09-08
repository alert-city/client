'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import SideBar from '@/modules/profile/Sidebar';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import DeleteAccount from '@/modules/profile/DeleteAccount';
import AvatarEditor from '@/modules/profile/AvatarEditor';
import PhoneNumber from '@/modules/profile/PhoneNumber';
import TwoFA from '@/modules/profile/TwoFA';
import DisplayName from '@/modules/profile/DisplayName';
import Username from '@/modules/profile/Username';
import OrgName from '@/modules/profile/OrgName';
import Name from '@/modules/profile/Name';
import { useUserInfoStore } from '@/store/profileState';
import { useFindOneUserById } from '@/modules/profile/useHandleRequest';
import { useTranslations } from 'next-intl';
import { USER_UPDATED } from '@/graphql/user';
import { useSubscription } from '@apollo/client';

const ProfileForm: React.FC = () => {
        const t = useTranslations('ProfileUpdatePage');
        const { data: updatedData } = useSubscription(USER_UPDATED);
        const {
                userInfo,
                setUserInfo,
                selectedSection,
                setSelectedSection,
                setInitialUserInfo,
                loading,
                setRequestError,
                twoFAStatus,
                initialUserInfo,
                storedId,
                setStoredId,
                setStoredUsername,
              } = useUserInfoStore();

        const { data } = useFindOneUserById(storedId);
        useEffect(() => {
          if (data) {
            const newUserInfo = {
              displayName: data.displayName || '',
              phoneNumber: data.phoneNumber || '',
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
            setStoredUsername(data.username);
            setStoredId(data.id);
            setInitialUserInfo(newUserInfo);
          }
        }, [data, setUserInfo, setInitialUserInfo]);

        useEffect(() => {
          if (updatedData) {
            const newUserInfo = {
              displayName: data.displayName || '',
              phoneNumber: data.phoneNumber || '',
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
            setStoredUsername(data.username);
            setStoredId(data.id);
            setInitialUserInfo(newUserInfo);
          }
        }, [updatedData, setUserInfo]);

        const handleSectionClick = (section: string) => {
          setSelectedSection(section);
          if (section === 'Security') {
            !twoFAStatus && setUserInfo({ ...userInfo, is2FAEnabled: initialUserInfo.is2FAEnabled });
          }
          setRequestError('');
        };

        return (
          <Box sx={{ padding: 3, width: '100%', maxWidth: 1000, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>{t('title')}</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ width: { xs: '100%', md: '35%' }, flexGrow: 1 }}>
                <SideBar selectedSection={selectedSection} handleSectionClick={handleSectionClick} />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '75%' }, flexGrow: 2 }}>
                <Card sx={{ paddingBottom: 0 }}>
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
                    {(selectedSection === 'PhoneNumber' && userInfo) && (
                      <PhoneNumber />
                    )}
                    {(selectedSection === 'Username' && userInfo) && (
                      <Username />
                    )}
                    {(selectedSection === 'DisplayName' && userInfo) && (
                      <DisplayName />
                    )}
                    {(selectedSection === 'Security' && userInfo) && (
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