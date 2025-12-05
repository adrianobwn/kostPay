import React, { useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const PaymentUploadModal = ({ isOpen, onClose, booking, onUpload }) => {
    const [paymentProof, setPaymentProof] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB - reduced for faster upload)
            if (file.size > 2 * 1024 * 1024) {
                setError('Ukuran file maksimal 2MB. Silakan compress gambar terlebih dahulu.');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('File harus berupa gambar');
                return;
            }

            setPaymentProof(file);
            setError('');

            // Create preview with compression
            const reader = new FileReader();
            reader.onloadend = () => {
                // Compress image
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize if too large (max 1024px)
                    const maxSize = 1024;
                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height / width) * maxSize;
                            width = maxSize;
                        } else {
                            width = (width / height) * maxSize;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression (0.7 quality)
                    const compressed = canvas.toDataURL('image/jpeg', 0.7);
                    setPreview(compressed);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentProof) {
            setError('Silakan pilih file bukti pembayaran');
            return;
        }

        if (!preview) {
            setError('Tunggu preview selesai dimuat');
            return;
        }

        setUploading(true);
        try {
            // Use compressed preview instead of original file
            await onUpload(booking.id, preview);
            setUploading(false);
            onClose();
        } catch (err) {
            setError('Gagal mengupload bukti pembayaran');
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <div className="text-white">
                        <h2 className="text-xl font-bold">Upload Bukti Pembayaran</h2>
                        <p className="text-sm text-blue-100">Kamar {booking?.kamar?.kodeKamar}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-blue-800 rounded-full transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Info */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Total Pembayaran:</strong>
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                            Rp {(() => {
                                const harga = booking?.kamar?.harga || 0;
                                const tanggalMasuk = new Date(booking?.tanggalMasuk);
                                const tanggalKeluar = new Date(booking?.tanggalKeluar);
                                const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                                return (harga * durasi).toLocaleString('id-ID');
                            })()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {(() => {
                                const tanggalMasuk = new Date(booking?.tanggalMasuk);
                                const tanggalKeluar = new Date(booking?.tanggalKeluar);
                                const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                                return `${durasi} bulan × Rp ${booking?.kamar?.harga?.toLocaleString('id-ID')}`;
                            })()}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Transfer ke rekening: BCA 1234567890 a.n. Kos Pak Le
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Upload size={16} className="inline mr-2" />
                            Bukti Transfer
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="payment-upload"
                        />
                        <label
                            htmlFor="payment-upload"
                            className={`block w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${error ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            {preview ? (
                                <div className="space-y-2">
                                    <img src={preview} alt="Preview" className="max-h-60 mx-auto rounded" />
                                    <p className="text-center text-sm text-green-600 flex items-center justify-center">
                                        <CheckCircle size={16} className="mr-1" />
                                        File siap diupload
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <Upload size={48} className="mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm font-medium">Klik untuk upload bukti transfer</p>
                                    <p className="text-xs mt-1">PNG, JPG, JPEG (Max 2MB)</p>
                                    <p className="text-xs text-gray-400 mt-1">Gambar akan otomatis di-compress</p>
                                </div>
                            )}
                        </label>
                        {error && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={!paymentProof || uploading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {uploading ? 'Uploading...' : 'Upload Bukti'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default PaymentUploadModal;
