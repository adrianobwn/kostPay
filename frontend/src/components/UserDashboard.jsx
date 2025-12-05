import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Upload, Home, Wifi, Wind, Tv, Droplet, Car, Coffee, LogOut } from 'lucide-react';
import { kamarAPI, bookingAPI } from '../api';
import BookingModal from './BookingModal';
import PaymentUploadModal from './PaymentUploadModal';

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
        VERIFIED: "bg-green-100 text-green-700 border-green-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200"
    };

    const icons = {
        PENDING: <Clock size={14} className="mr-1" />,
        VERIFIED: <CheckCircle size={14} className="mr-1" />,
        REJECTED: <XCircle size={14} className="mr-1" />
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PENDING}`}>
            {icons[status]}
            {status}
        </span>
    );
};

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [kamarList, setKamarList] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedKamar, setSelectedKamar] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Fasilitas Kos (static)
    const fasilitasKos = [
        { icon: <Wifi size={20} />, nama: "WiFi Gratis" },
        { icon: <Wind size={20} />, nama: "AC/Kipas" },
        { icon: <Tv size={20} />, nama: "Kamar Mandi Dalam" },
        { icon: <Droplet size={20} />, nama: "Air Panas" },
        { icon: <Car size={20} />, nama: "Parkir Motor" },
        { icon: <Coffee size={20} />, nama: "Dapur Bersama" },
    ];

    useEffect(() => {
        // Get user from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/auth');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchData();
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/auth');
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch available rooms
            const kamarResponse = await kamarAPI.getTersedia();
            setKamarList(kamarResponse.data.kamar || []);

            // Fetch user bookings
            try {
                const bookingsResponse = await bookingAPI.getMy();
                setMyBookings(bookingsResponse.data.bookings || []);
            } catch (error) {
                console.log('No bookings found:', error);
                setMyBookings([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const handleBookKamar = (kamar) => {
        setSelectedKamar(kamar);
        setShowBookingModal(true);
    };

    const handleSubmitBooking = async (bookingData) => {
        try {
            await bookingAPI.create(bookingData);
            alert('Booking berhasil! Silakan upload bukti pembayaran.');
            setShowBookingModal(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Gagal melakukan booking. ' + (error.response?.data?.error || 'Silakan coba lagi.'));
        }
    };

    const handleUploadPayment = (booking) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    const handleSubmitPayment = async (bookingId, paymentProof) => {
        try {
            await bookingAPI.uploadPayment(bookingId, paymentProof);
            alert('Bukti pembayaran berhasil diupload!');
            setShowPaymentModal(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error uploading payment:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Home className="text-blue-600" size={28} />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Kos Pak Le</h1>
                                <p className="text-sm text-gray-500">Dashboard Penghuni</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Info Kos Section */}
                <section className="mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                            <h2 className="text-2xl font-bold mb-2">Selamat Datang di Kos Pak Le!</h2>
                            <p className="text-blue-100">Kos nyaman dengan fasilitas lengkap di lokasi strategis</p>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Fasilitas Kos</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {fasilitasKos.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-blue-600">{item.icon}</div>
                                        <span className="text-sm font-medium text-gray-700">{item.nama}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Available Rooms */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Kamar Tersedia</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kamarList.length > 0 ? (
                            kamarList.map((kamar) => (
                                <div key={kamar.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{kamar.kodeKamar}</h3>
                                                <p className="text-sm text-gray-500">{kamar.tipe?.nama}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                {kamar.statusKamar}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-2xl font-bold text-blue-600">
                                                Rp {kamar.harga?.toLocaleString('id-ID')}
                                                <span className="text-sm text-gray-500 font-normal">/bulan</span>
                                            </p>
                                        </div>
                                        {kamar.tipe?.fasilitas && (
                                            <div className="space-y-2 mb-4">
                                                <p className="text-xs font-semibold text-gray-700">Fasilitas:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {kamar.tipe.fasilitas.map((fas, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                            {fas}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleBookKamar(kamar)}
                                            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Book Kamar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">Tidak ada kamar tersedia saat ini</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* My Bookings Section */}
                {myBookings.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Saya</h2>
                        <div className="space-y-4">
                            {myBookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{booking.kamar?.kodeKamar}</h3>
                                                <p className="text-sm text-gray-500">{booking.kamar?.tipe?.nama}</p>
                                            </div>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Tanggal Masuk</p>
                                                <p className="font-medium">{new Date(booking.tanggalMasuk).toLocaleDateString('id-ID')}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Tanggal Keluar</p>
                                                <p className="font-medium">{booking.tanggalKeluar ? new Date(booking.tanggalKeluar).toLocaleDateString('id-ID') : '-'}</p>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-500">Total Biaya</p>
                                            <p className="text-xl font-bold text-blue-600">
                                                Rp {(() => {
                                                    const harga = booking.kamar?.harga || 0;
                                                    const tanggalMasuk = new Date(booking.tanggalMasuk);
                                                    const tanggalKeluar = new Date(booking.tanggalKeluar);
                                                    const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                                                    return (harga * durasi).toLocaleString('id-ID');
                                                })()}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {(() => {
                                                    const tanggalMasuk = new Date(booking.tanggalMasuk);
                                                    const tanggalKeluar = new Date(booking.tanggalKeluar);
                                                    const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                                                    return `${durasi} bulan × Rp ${booking.kamar?.harga?.toLocaleString('id-ID')}`;
                                                })()}
                                            </p>
                                        </div>
                                        {booking.status === 'PENDING' && !booking.paymentProof && (
                                            <button
                                                onClick={() => handleUploadPayment(booking)}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Upload size={18} />
                                                Upload Bukti Pembayaran
                                            </button>
                                        )}
                                        {booking.paymentProof && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                <p className="text-sm text-yellow-800">
                                                    ✓ Bukti pembayaran sudah diupload. Menunggu verifikasi admin.
                                                </p>
                                            </div>
                                        )}
                                        {booking.status === 'APPROVED' && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <p className="text-sm text-green-800">
                                                    ✓ Booking disetujui! Silakan hubungi admin untuk proses selanjutnya.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Modals */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                kamar={selectedKamar}
                onSubmit={handleSubmitBooking}
            />

            <PaymentUploadModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                booking={selectedBooking}
                onUpload={handleSubmitPayment}
            />
        </div>
    );
};

export default UserDashboard;
