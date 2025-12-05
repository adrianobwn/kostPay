import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { MapPin, Wifi, Wind, Droplet, Car, Coffee, Utensils, Shield, Phone, Mail, Instagram, CheckCircle } from 'lucide-react';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthForm from './components/AuthForm';

// Data Kos Pak Le
const kosData = {
  nama: "Kos Pak Le",
  lokasi: "Jl. Prof. Sudarto, Tembalang, Semarang",
  deskripsi: "Kos nyaman dan strategis untuk mahasiswa Teknik Industri Undip",
  kontak: {
    wa: "081234567890",
    email: "kospakle@gmail.com",
    instagram: "@kospakle"
  },
  fasilitas: [
    { icon: <Wifi size={24} />, nama: "WiFi Gratis", desc: "100 Mbps" },
    { icon: <Wind size={24} />, nama: "AC/Kipas", desc: "Sesuai tipe" },
    { icon: <Droplet size={24} />, nama: "Kamar Mandi Dalam", desc: "Air panas" },
    { icon: <Car size={24} />, nama: "Parkir Mobil", desc: "Aman & luas" },
    { icon: <Coffee size={24} />, nama: "Dapur Bersama", desc: "Gratis" },
    { icon: <Utensils size={24} />, nama: "Kulkas Bersama", desc: "Tersedia" },
  ],
  tipeKamar: [
    {
      id: 1,
      nama: "Kamar AC",
      harga: 1600000,
      fasilitas: ["AC", "Kasur", "Lemari", "Meja Belajar", "Kamar Mandi Dalam"],
      tersedia: 3,
      total: 5,
      image: "/room-ac.png"
    },
    {
      id: 2,
      nama: "Kamar Non-AC",
      harga: 1200000,
      fasilitas: ["Kipas Angin", "Kasur", "Lemari", "Meja Belajar", "Kamar Mandi Dalam"],
      tersedia: 2,
      total: 5,
      image: "/room-non-ac.png"
    }
  ]
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{kosData.nama}</h1>
              <p className="text-xs text-gray-500">Teknik Industri Undip</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Masuk / Daftar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6">
                ✨ Kos Terbaik di Kampus Undip
              </div>
              <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Kos Nyaman untuk <br />
                <span className="text-blue-600">Mahasiswa Undip</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Lokasi strategis dekat Teknik Industri, fasilitas lengkap, harga terjangkau.
                Solusi hunian terbaik untuk mahasiswa.
              </p>
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="text-blue-600" size={24} />
                <span className="text-gray-700 font-medium">{kosData.lokasi}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Sewa Sekarang
                </button>
                <a
                  href={`https://wa.me/6282151543859`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-blue-300 transition-all flex items-center gap-2"
                >
                  <Phone size={20} />
                  Hubungi Kami
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="/kos-exterior.png"
                alt="Kos Pak Le"
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10</div>
                    <div className="text-sm text-gray-500">Kamar Tersedia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipe Kamar */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Pilihan Kamar</h3>
            <p className="text-gray-600 text-lg">Pilih tipe kamar sesuai kebutuhan dan budget Anda</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {kosData.tipeKamar.map((tipe) => (
              <div key={tipe.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tipe.image}
                    alt={tipe.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-gray-600">{tipe.tersedia}/{tipe.total} Tersedia</span>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{tipe.nama}</h4>
                  <div className="text-3xl font-extrabold text-blue-600 mb-6">
                    Rp {tipe.harga.toLocaleString('id-ID')}
                    <span className="text-lg text-gray-500 font-normal">/bulan</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    {tipe.fasilitas.map((fas, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle size={20} className="text-blue-600" />
                        <span>{fas}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Pilih Kamar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Fasilitas Lengkap</h3>
            <p className="text-gray-600 text-lg">Semua yang Anda butuhkan untuk kenyamanan tinggal</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {kosData.fasilitas.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-2xl text-center hover:bg-blue-50 hover:shadow-lg transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                  {item.icon}
                </div>
                <h5 className="font-bold text-gray-900 mb-1">{item.nama}</h5>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Lokasi Strategis</h3>
              <p className="text-gray-600 mb-6">
                Berada di area kampus Teknik Industri Undip, sangat dekat dengan fakultas dan fasilitas kampus.
              </p>
              <div className="flex items-start gap-3 mb-6">
                <MapPin className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">{kosData.lokasi}</p>
                  <p className="text-gray-600 text-sm">Tembalang, Semarang, Jawa Tengah</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
                <p className="text-gray-500">[ Peta Google Maps akan ditampilkan di sini ]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-4">Siap Pindah ke Kos Pak Le?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Dapatkan kamar terbaik sebelum kehabisan. Daftar sekarang dan nikmati promo spesial!
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:-translate-y-1"
          >
            Daftar Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-xl mb-4">{kosData.nama}</h4>
              <p className="text-gray-400 mb-4">{kosData.deskripsi}</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Kontak</h5>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone size={18} />
                  <span>{kosData.kontak.wa}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  <span>{kosData.kontak.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Instagram size={18} />
                  <span>{kosData.kontak.instagram}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-4">Lokasi</h5>
              <p className="text-gray-400">{kosData.lokasi}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {kosData.nama}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// App Utama
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
