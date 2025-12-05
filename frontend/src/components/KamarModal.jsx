import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const KamarModal = ({ isOpen, onClose, onSubmit, kamar, tipeKamarList }) => {
    const [formData, setFormData] = useState({
        nomor_kamar: '',
        tipe_id: '',
        lantai: '',
        status: 'TERSEDIA'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (kamar) {
            // Edit mode
            setFormData({
                nomor_kamar: kamar.nomor_kamar,
                tipe_id: kamar.tipe_id,
                lantai: kamar.lantai,
                status: kamar.status
            });
        } else {
            // Add mode
            setFormData({
                nomor_kamar: '',
                tipe_id: tipeKamarList.length > 0 ? tipeKamarList[0].id : '',
                lantai: '',
                status: 'TERSEDIA'
            });
        }
        setErrors({});
    }, [kamar, tipeKamarList, isOpen]);

    const validate = () => {
        const newErrors = {};

        if (!formData.nomor_kamar.trim()) {
            newErrors.nomor_kamar = 'Nomor kamar harus diisi';
        }

        if (!formData.tipe_id) {
            newErrors.tipe_id = 'Tipe kamar harus dipilih';
        }

        if (!formData.lantai || formData.lantai < 1) {
            newErrors.lantai = 'Lantai harus diisi dan minimal 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
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
                        {kamar ? 'Edit Kamar' : 'Tambah Kamar Baru'}
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
                    {/* Nomor Kamar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nomor Kamar <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nomor_kamar"
                            value={formData.nomor_kamar}
                            onChange={handleChange}
                            placeholder="Contoh: A1, B2, C3"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.nomor_kamar ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.nomor_kamar && (
                            <p className="mt-1 text-sm text-red-500">{errors.nomor_kamar}</p>
                        )}
                    </div>

                    {/* Tipe Kamar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipe Kamar <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="tipe_id"
                            value={formData.tipe_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.tipe_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Pilih Tipe Kamar</option>
                            {tipeKamarList.map(tipe => (
                                <option key={tipe.id} value={tipe.id}>
                                    {tipe.nama} - Rp {tipe.harga.toLocaleString('id-ID')}
                                </option>
                            ))}
                        </select>
                        {errors.tipe_id && (
                            <p className="mt-1 text-sm text-red-500">{errors.tipe_id}</p>
                        )}
                    </div>

                    {/* Lantai */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lantai <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="lantai"
                            value={formData.lantai}
                            onChange={handleChange}
                            min="1"
                            placeholder="1, 2, 3, ..."
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.lantai ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.lantai && (
                            <p className="mt-1 text-sm text-red-500">{errors.lantai}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="TERSEDIA">Tersedia</option>
                            <option value="TERISI">Terisi</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>

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
                            {kamar ? 'Update' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KamarModal;
