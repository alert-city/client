interface FileUpload {
  fileUrl: string | null;
}

export const uploadAvatar = async (formData: FormData): Promise<FileUpload> => {
  const url = process.env.NEXT_PUBLIC_REST_API_URL + '/files/upload';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
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