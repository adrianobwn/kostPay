import React from 'react';
import { MapPin, Wifi, Wind, Star } from 'lucide-react';

const RoomCard = ({ kamar }) => {
    // Format harga ke Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
            {/* Gambar Kamar */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={kamar.foto || "https://images.unsplash.com/photo-1522771753035-484980f5a786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={kamar.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                    {kamar.tipe}
                </div>

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm
          ${kamar.status === 'TERSEDIA' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {kamar.status === 'TERSEDIA' ? 'Tersedia' : 'Penuh'}
                </div>
            </div>

            {/* Konten Card */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {kamar.nama}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin size={14} className="mr-1" />
                            <span>Lantai {kamar.lantai}</span>
                        </div>
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm font-bold">
                        <Star size={14} className="fill-current mr-1" />
                        4.8
                    </div>
                </div>

                {/* Fasilitas */}
                <div className="flex gap-3 my-4 text-gray-500">
                    <div className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-md">
                        <Wifi size={14} className="mr-1" /> WiFi
                    </div>
                    <div className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-md">
                        <Wind size={14} className="mr-1" /> AC
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-gray-400 block">Harga per bulan</span>
                        <span className="text-lg font-bold text-indigo-600">
                            {formatRupiah(kamar.harga)}
                        </span>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Pilih
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
