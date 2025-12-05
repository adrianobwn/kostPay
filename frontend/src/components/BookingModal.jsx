import React, { useState } from 'react';
import { X, Calendar, User, Phone, Briefcase, Upload, AlertCircle } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, kamar, onSubmit }) => {
    const [formData, setFormData] = useState({
        tanggalMasuk: '',
        durasi: '1',
        nomorHP: '',
        kontakDarurat: '',
        pekerjaan: 'mahasiswa',
        ktp: null,
        foto: null
    });

    const [errors, setErrors] = useState({});
    const [ktpPreview, setKtpPreview] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB before compression)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, [type]: 'Ukuran file maksimal 5MB' }));
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, [type]: 'File harus berupa gambar' }));
                return;
            }

            // Compress and convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality

                    setFormData(prev => ({ ...prev, [type]: compressedBase64 }));

                    if (type === 'ktp') {
                        setKtpPreview(compressedBase64);
                    } else {
                        setFotoPreview(compressedBase64);
                    }

                    // Clear error
                    setErrors(prev => ({ ...prev, [type]: null }));
                };
            };
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.tanggalMasuk) {
            newErrors.tanggalMasuk = 'Tanggal masuk harus diisi';
        } else {
            const selectedDate = new Date(formData.tanggalMasuk);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.tanggalMasuk = 'Tanggal masuk tidak boleh di masa lalu';
            }
        }

        if (!formData.nomorHP) {
            newErrors.nomorHP = 'Nomor HP harus diisi';
        } else if (!/^08[0-9]{8,11}$/.test(formData.nomorHP)) {
            newErrors.nomorHP = 'Nomor HP harus dimulai dengan 08 dan 10-13 digit';
        }

        if (!formData.kontakDarurat) {
            newErrors.kontakDarurat = 'Kontak darurat harus diisi';
        } else if (!/^08[0-9]{8,11}$/.test(formData.kontakDarurat)) {
            newErrors.kontakDarurat = 'Nomor HP harus dimulai dengan 08 dan 10-13 digit';
        }

        if (!formData.ktp) {
            newErrors.ktp = 'Foto KTP harus diupload';
        }

        if (!formData.foto) {
            newErrors.foto = 'Foto diri harus diupload';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit({
            ...formData,
            idKamar: kamar.id
        });
    };

    const totalBiaya = kamar?.harga * parseInt(formData.durasi) || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Booking Kamar</h2>
                        <p className="text-sm text-gray-500">{kamar?.kodeKamar} - {kamar?.tipe?.nama}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Tanggal Masuk */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar size={16} className="inline mr-2" />
                            Tanggal Masuk
                        </label>
                        <input
                            type="date"
                            name="tanggalMasuk"
                            value={formData.tanggalMasuk}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.tanggalMasuk ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.tanggalMasuk && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.tanggalMasuk}
                            </p>
                        )}
                    </div>

                    {/* Durasi Sewa */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Durasi Sewa
                        </label>
                        <select
                            name="durasi"
                            value={formData.durasi}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="1">1 Bulan</option>
                            <option value="3">3 Bulan</option>
                            <option value="6">6 Bulan</option>
                            <option value="12">1 Tahun</option>
                        </select>
                    </div>

                    {/* Nomor HP */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Phone size={16} className="inline mr-2" />
                            Nomor HP
                        </label>
                        <input
                            type="tel"
                            name="nomorHP"
                            value={formData.nomorHP}
                            onChange={handleChange}
                            placeholder="08123456789"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nomorHP ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.nomorHP && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.nomorHP}
                            </p>
                        )}
                    </div>

                    {/* Kontak Darurat */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Phone size={16} className="inline mr-2" />
                            Kontak Darurat
                        </label>
                        <input
                            type="tel"
                            name="kontakDarurat"
                            value={formData.kontakDarurat}
                            onChange={handleChange}
                            placeholder="Nomor HP orang tua/wali"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.kontakDarurat ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.kontakDarurat && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.kontakDarurat}
                            </p>
                        )}
                    </div>

                    {/* Pekerjaan/Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Briefcase size={16} className="inline mr-2" />
                            Status/Pekerjaan
                        </label>
                        <select
                            name="pekerjaan"
                            value={formData.pekerjaan}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="karyawan">Karyawan</option>
                            <option value="wiraswasta">Wiraswasta</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>

                    {/* Upload KTP */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Upload size={16} className="inline mr-2" />
                            Upload KTP
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'ktp')}
                            className="hidden"
                            id="ktp-upload"
                        />
                        <label
                            htmlFor="ktp-upload"
                            className={`block w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${errors.ktp ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            {ktpPreview ? (
                                <img src={ktpPreview} alt="KTP Preview" className="max-h-40 mx-auto rounded" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <Upload size={32} className="mx-auto mb-2" />
                                    <p className="text-sm">Klik untuk upload foto KTP</p>
                                </div>
                            )}
                        </label>
                        {errors.ktp && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.ktp}
                            </p>
                        )}
                    </div>

                    {/* Upload Foto Diri */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <User size={16} className="inline mr-2" />
                            Upload Foto Diri
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'foto')}
                            className="hidden"
                            id="foto-upload"
                        />
                        <label
                            htmlFor="foto-upload"
                            className={`block w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${errors.foto ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            {fotoPreview ? (
                                <img src={fotoPreview} alt="Foto Preview" className="max-h-40 mx-auto rounded" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <User size={32} className="mx-auto mb-2" />
                                    <p className="text-sm">Klik untuk upload foto diri</p>
                                </div>
                            )}
                        </label>
                        {errors.foto && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle size={14} className="mr-1" />
                                {errors.foto}
                            </p>
                        )}
                    </div>

                    {/* Total Biaya */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Total Biaya ({formData.durasi} bulan):</span>
                            <span className="text-2xl font-bold text-blue-600">
                                Rp {totalBiaya.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Booking Sekarang
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
