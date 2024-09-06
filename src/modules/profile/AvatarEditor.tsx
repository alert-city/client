import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  Skeleton, Typography,
} from '@mui/material';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Compressor from 'compressorjs';
import LoadingOverlay from '@/modules/loadingOverlay/LoadingOverlay';
import { useTopbarStore } from '@/store/topBarState';
import { uploadAvatar } from '@/api/uploadAvatar';
import { useUserInfoStore } from '@/store/profileState';
import { AVATAR_URL } from '@/shared/constants/storage';
import { useTranslations } from 'next-intl';

const AvatarEditor: React.FC = () => {
  const t = useTranslations('ProfileUpdatePage');
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<HTMLImageElement>(null);
  const [canReCrop, setCanReCrop] = useState(true);
  const setAvatarUrl = useTopbarStore((state) => state.setAvatarUrl);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { userInfo, setUserInfo, storedId, loading, setLoading } = useUserInfoStore();

  useEffect(() => {
    if (userInfo.avatarUrl) {
      const img = new Image();
      img.src = userInfo.avatarUrl;
      img.onload = () => {
        setIsAvatarLoading(false);
      };
      img.onerror = () => {
        setIsAvatarLoading(false);
      };
    } else {
      setIsAvatarLoading(false);
    }
  }, [userInfo.avatarUrl]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setCroppedImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
    }
  };

  const handleCrop = () => {
    setSubmitError(null);
    setCanReCrop(false);
    const imageElement: any = cropperRef?.current;
    const cropper = imageElement?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            setCroppedImage(previewUrl);
          }
          setCanReCrop(true);
        });
      } else {
        setCanReCrop(true);
      }
    }
  };

  const handleSave = async () => {
    setSubmitError(null);
    if (croppedImage) {
      setLoading(true);
      setIsAvatarLoading(true);
      try {
        const blob = await new Promise<Blob | null>((resolve) => {
          const imageElement: any = cropperRef?.current;
          const cropper = imageElement?.cropper;
          cropper.getCroppedCanvas().toBlob(
            resolve,
            'image/png',
          );
        });

        if (blob) {
          new Compressor(
            blob,
            {
              quality: 0.6,
              success: async (result) => {
                const formData = new FormData();
                formData.append(
                  'file',
                  result,
                  `${storedId}-avatar.png`,
                );
                const response = await uploadAvatar(formData);

                if (response) {
                  const fileUrl = response.fileUrl || '';
                  setAvatarUrl(fileUrl);
                  localStorage.setItem(AVATAR_URL, fileUrl);
                  setUserInfo({ ...userInfo, avatarUrl: fileUrl });
                  setCroppedImage(null);
                  setSelectedImage(null);
                  handleClose();
                }
              },
              error: (error) => {
                setSubmitError((error as Error).message);
              },
            },
          );
        }
      } catch (error) {
        setSubmitError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isAvatarLoading || !userInfo.avatarUrl ? (
        <Skeleton variant="circular" width={150} height={150} sx={{ marginBottom: 4 }} />
      ) : (
        <Avatar
          sx={{ width: 150, height: 150, marginBottom: 4, mt: 1.5 }}
          src={croppedImage || userInfo.avatarUrl || ''}
          alt={t('avatar.avatar')}
        />
      )}
      <Button variant="contained" onClick={handleOpen}>{t('edit')}</Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingOverlay loading={loading} />
          {selectedImage ? (
            <Cropper
              src={selectedImage}
              style={{ height: 400, width: '100%' }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
            />
          ) : (
            <Button sx={{ mt: 0.5 }} variant="contained" component="label">
              {t('avatar.uploadImage')}
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </Button>
          )}
        </DialogContent>
        <Box className="flex justify-center">
          {submitError &&
            <Typography sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }} color="error" variant="body2">
              {submitError}
            </Typography>
          }
        </Box>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={handleClose}>{t('cancel')}</Button>
          {selectedImage && <Button variant="contained" onClick={handleCrop} color="primary" disabled={!canReCrop}>{t(
            'avatar.crop')}</Button>}
          <Button onClick={handleSave} variant="contained" color="success" disabled={!croppedImage}>{t(
            'submit')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvatarEditor;



