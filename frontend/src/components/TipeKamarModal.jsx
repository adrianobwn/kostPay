import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TipeKamarModal = ({ isOpen, onClose, onSubmit, tipeKamar }) => {
    const [formData, setFormData] = useState({
        nama: '',
        harga: '',
        fasilitas: []
    });
    const [fasilitasInput, setFasilitasInput] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tipeKamar) {
            // Edit mode
            setFormData({
                nama: tipeKamar.nama,
                harga: tipeKamar.harga,
                fasilitas: tipeKamar.fasilitas || []
            });
            setFasilitasInput(tipeKamar.fasilitas ? tipeKamar.fasilitas.join(', ') : '');
        } else {
            // Add mode
            setFormData({
                nama: '',
                harga: '',
                fasilitas: []
            });
            setFasilitasInput('');
        }
        setErrors({});
    }, [tipeKamar, isOpen]);

    const validate = () => {
        const newErrors = {};

        if (!formData.nama.trim()) {
            newErrors.nama = 'Nama tipe kamar harus diisi';
        }

        if (!formData.harga || formData.harga < 0) {
            newErrors.harga = 'Harga harus diisi dan tidak boleh negatif';
        }

        if (formData.fasilitas.length === 0) {
            newErrors.fasilitas = 'Minimal harus ada 1 fasilitas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            onSubmit({
                ...formData,
                harga: parseInt(formData.harga)
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFasilitasChange = (e) => {
        const value = e.target.value;
        setFasilitasInput(value);

        // Parse fasilitas (comma separated)
        const fasilitasArray = value
            .split(',')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        setFormData(prev => ({
            ...prev,
            fasilitas: fasilitasArray
        }));

        if (errors.fasilitas && fasilitasArray.length > 0) {
            setErrors(prev => ({
                ...prev,
                fasilitas: ''
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">
                        {tipeKamar ? 'Edit Tipe Kamar' : 'Tambah Tipe Kamar Baru'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nama Tipe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Tipe Kamar <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Contoh: Standard, Deluxe, VIP"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.nama ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.nama && (
                            <p className="mt-1 text-sm text-red-500">{errors.nama}</p>
                        )}
                    </div>

                    {/* Harga */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Harga per Bulan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                            <input
                                type="number"
                                name="harga"
                                value={formData.harga}
                                onChange={handleChange}
                                min="0"
                                placeholder="800000"
                                className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.harga ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        {errors.harga && (
                            <p className="mt-1 text-sm text-red-500">{errors.harga}</p>
                        )}
                        {formData.harga && (
                            <p className="mt-1 text-xs text-gray-500">
                                {parseInt(formData.harga).toLocaleString('id-ID')}
                            </p>
                        )}
                    </div>

                    {/* Fasilitas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fasilitas <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={fasilitasInput}
                            onChange={handleFasilitasChange}
                            placeholder="Pisahkan dengan koma. Contoh: Kasur, Lemari, AC, WiFi"
                            rows="3"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.fasilitas ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.fasilitas && (
                            <p className="mt-1 text-sm text-red-500">{errors.fasilitas}</p>
                        )}
                        {formData.fasilitas.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.fasilitas.map((f, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info jika edit */}
                    {tipeKamar && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Perubahan harga akan berlaku untuk semua kamar dengan tipe ini
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            {tipeKamar ? 'Update' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TipeKamarModal;
