import qrcode from "qrcode";

export const generateQrCode = async (url: string) => {
  return await qrcode.toDataURL(url);
};