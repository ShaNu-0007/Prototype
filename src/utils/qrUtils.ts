import QRCode from 'qrcode';
import { QRData } from '../types';

export const generateQRCode = async (data: QRData): Promise<string> => {
  try {
    const jsonString = JSON.stringify(data);
    const qrCodeDataURL = await QRCode.toDataURL(jsonString, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const parseQRData = (qrString: string): QRData | null => {
  try {
    return JSON.parse(qrString);
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
};

export const generateSessionId = (): string => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.getHours().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `Sess${date}-${time}${random}`;
};