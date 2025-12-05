import React, { useState } from 'react';

// Komponen Form Sewa Kamar (Desain Premium)
const FormSewa = () => {
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        email: '',
        nomor_hp: '',
        tanggal_masuk: '',
        durasi_bulan: 1,
        id_kamar: ''
    });

    const [sedangMemproses, setSedangMemproses] = useState(false);
    const [pesanStatus, setPesanStatus] = useState('');

    const tanganiPerubahanInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const tanganiSubmit = async (e) => {
        e.preventDefault();
        setSedangMemproses(true);
        setPesanStatus('');

        try {
            // Simulasi delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSedangMemproses(false);
            setPesanStatus('Berhasil! Silakan lanjut ke pembayaran.');
            // alert("Data berhasil dikirim! (Simulasi)");
        } catch (error) {
            setSedangMemproses(false);
            setPesanStatus('Gagal mengirim data. Coba lagi.');
        }
    };

    return (
        <div className="relative p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-lg w-full mx-auto transform transition-all hover:scale-[1.01]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl"></div>

            <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center">
                Sewa Kamar
            </h2>

            <form onSubmit={tanganiSubmit} className="space-y-5">

                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Nama Lengkap</label>
                    <input
                        type="text"
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        onChange={tanganiPerubahanInput}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:bg-white"
                        placeholder="Contoh: Budi Santoso"
                        required
                    />
                </div>

                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={tanganiPerubahanInput}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:bg-white"
                        placeholder="budi@example.com"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Tanggal Masuk</label>
                        <input
                            type="date"
                            name="tanggal_masuk"
                            value={formData.tanggal_masuk}
                            onChange={tanganiPerubahanInput}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:bg-white"
                            required
                        />
                    </div>

                    <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Durasi (Bulan)</label>
                        <input
                            type="number"
                            name="durasi_bulan"
                            min="1"
                            value={formData.durasi_bulan}
                            onChange={tanganiPerubahanInput}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:bg-white"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={sedangMemproses}
                    className={`w-full py-3.5 px-6 rounded-xl shadow-lg text-white font-bold text-lg tracking-wide transform transition-all duration-200 
            ${sedangMemproses
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:-translate-y-1 hover:shadow-xl active:scale-95'}`}
                >
                    {sedangMemproses ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                        </span>
                    ) : 'Ajukan Sewa Sekarang'}
                </button>

                {pesanStatus && (
                    <div className={`mt-4 p-3 rounded-lg text-center font-medium animate-fade-in ${pesanStatus.includes('Berhasil') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {pesanStatus}
                    </div>
                )}

            </form>
        </div>
    );
};

export default FormSewa;
