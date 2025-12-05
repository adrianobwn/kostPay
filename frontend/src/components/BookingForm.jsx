import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, CheckCircle } from 'lucide-react';

const BookingForm = ({ hargaPerBulan }) => {
    const [tanggalMasuk, setTanggalMasuk] = useState('');
    const [durasi, setDurasi] = useState(1);
    const [totalHarga, setTotalHarga] = useState(0);

    // Hitung total harga real-time
    useEffect(() => {
        setTotalHarga(hargaPerBulan * durasi);
    }, [durasi, hargaPerBulan]);

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Mulai Sewa</h3>
                <span className="text-sm text-gray-500">
                    <span className="font-bold text-indigo-600 text-lg">{formatRupiah(hargaPerBulan)}</span> / bulan
                </span>
            </div>

            <form className="space-y-4">
                {/* Input Tanggal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Masuk</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={tanggalMasuk}
                            onChange={(e) => setTanggalMasuk(e.target.value)}
                        />
                    </div>
                </div>

                {/* Input Durasi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Sewa</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 3, 6, 12].map((bulan) => (
                            <button
                                key={bulan}
                                type="button"
                                onClick={() => setDurasi(bulan)}
                                className={`py-2 rounded-lg text-sm font-medium border transition-all
                  ${durasi === bulan
                                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                                        : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                            >
                                {bulan} Bulan
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ringkasan Biaya */}
                <div className="bg-gray-50 rounded-xl p-4 mt-6 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Harga Sewa x {durasi} bulan</span>
                        <span>{formatRupiah(totalHarga)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Biaya Layanan</span>
                        <span>Rp 10.000</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-lg">
                        <span>Total Bayar</span>
                        <span className="text-indigo-600">{formatRupiah(totalHarga + 10000)}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle size={20} />
                    Ajukan Sewa
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                    Anda belum akan dikenakan biaya pada tahap ini.
                </p>
            </form>
        </div>
    );
};

export default BookingForm;
