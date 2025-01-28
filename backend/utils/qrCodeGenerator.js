const QRCode = require("qrcode");

// Fungsi untuk menghasilkan QR Code dengan menggunakan QRCode library
const generateQRCode = async (data) => {
  try {
    // Generate QR code sebagai Data URL (base64)
    const qrCode = await QRCode.toDataURL(data);
    return qrCode; // Mengembalikan URL gambar QR Code dalam format base64
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw new Error("Failed to generate QR Code");
  }
};

module.exports = { generateQRCode };
