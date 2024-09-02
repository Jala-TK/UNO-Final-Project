import { useEffect, useState } from 'react';
import { getPerfilWithPhoto } from '@/services/authService';

function getMimeType(byteArray) {
  const signatures = {
    '89504E47': 'image/png',
    '47494638': 'image/gif',
    FFD8FF: 'image/jpeg',
    '49492A00': 'image/tiff',
    '424D': 'image/bmp',
    '4D4D002A': 'image/tiff',
    '52494646': 'image/webp',
  };

  const header = Array.from(byteArray.subarray(0, 4))
    .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
    .join('');

  return signatures[header] || 'application/octet-stream';
}

export function usePhoto(username) {
  const [photoBlob, setPhotoBlob] = useState<string | null>(null);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const getPhoto = await getPerfilWithPhoto(username);
        if (
          !getPhoto.success ||
          !getPhoto.data.data ||
          !Array.isArray(getPhoto.data.data)
        ) {
          console.error('Invalid photo data:', getPhoto);
          return;
        }

        const byteArray = new Uint8Array(getPhoto.data.data);
        const mimeType = getMimeType(byteArray);
        const blob = new Blob([byteArray], { type: mimeType });

        const objectURL = URL.createObjectURL(blob);
        setPhotoBlob(objectURL);
      } catch (error) {
        console.error('Error fetching photo:', error);
      }
    };

    if (username) {
      loadPhoto();
    }
  }, [username]);

  return photoBlob;
}
