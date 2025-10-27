import Cookies from 'js-cookie';
import { ACCESS_TOKEN } from '@/shared/constants/storage';

interface FileUpload {
    fileUrl: string | null;
}

export const uploadAvatar = async (formData: FormData): Promise<FileUpload> => {
    const url = `${process.env.NEXT_PUBLIC_REST_API_URL}/files/upload`;

    const token = Cookies.get(ACCESS_TOKEN);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }), // 👈 添加 Authorization header
            },
        });

        if (response.ok) {
            const data = await response.json();
            const fileUrl = data.fileUrl;
            return { fileUrl };
        } else {
            return { fileUrl: null };
        }
    } catch (error) {
        throw error;
    }
};