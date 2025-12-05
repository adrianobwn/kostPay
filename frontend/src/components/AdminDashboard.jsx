import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Home, FileText, LogOut, Search, Bell, CheckCircle, XCircle, ExternalLink, Plus, Edit, Trash2, User } from 'lucide-react';
import { adminAPI, kamarAPI } from '../api';
import KamarModal from './KamarModal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pembayaranList, setPembayaranList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [kamarList, setKamarList] = useState([]);
    const [tipeKamarList, setTipeKamarList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    // Modal states
    const [showKamarModal, setShowKamarModal] = useState(false);
    const [editingKamar, setEditingKamar] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/auth');
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }

        setUser(parsedUser);
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Admin: Fetching pembayaran...');
            const pembayaranRes = await adminAPI.getAllPembayaran();
            console.log('Admin: Pembayaran data:', pembayaranRes.data);
            setPembayaranList(pembayaranRes.data.payments || []);

            console.log('Admin: Fetching kamar...');
            const kamarRes = await kamarAPI.getAll();
            console.log('Admin: Kamar data:', kamarRes.data);
            setKamarList(kamarRes.data.kamar || []);

            console.log('Admin: Fetching tipe kamar...');
            const tipeRes = await kamarAPI.getTipeKamar();
            console.log('Admin: Tipe kamar data:', tipeRes.data);
            setTipeKamarList(tipeRes.data.tipeKamar || []);

            // Fetch bookings
            try {
                console.log('Admin: Fetching bookings...');
                const bookingsRes = await adminAPI.getAllBookings();
                console.log('Admin: Bookings data:', bookingsRes.data);
                setBookingsList(bookingsRes.data.bookings || []);
            } catch (error) {
                console.log('No bookings found:', error);
                setBookingsList([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            console.error('Error response:', error.response);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/auth');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifikasi = async (id, status) => {
        try {
            await adminAPI.verifikasiPembayaran(id, status);
            fetchData();
            alert(`Pembayaran berhasil ${status === 'VERIFIED' ? 'diverifikasi' : 'ditolak'}!`);
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Gagal memverifikasi pembayaran');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleNotification = () => {
        const pending = pembayaranList.filter(p => p.status === 'PENDING');
        if (pending.length > 0) {
            alert(`Ada ${pending.length} pembayaran yang menunggu verifikasi!`);
        } else {
            alert('Tidak ada notifikasi baru');
        }
    };

    // Kamar CRUD handlers
    const handleAddKamar = () => {
        setEditingKamar(null);
        setShowKamarModal(true);
    };

    const handleEditKamar = (kamar) => {
        setEditingKamar(kamar);
        setShowKamarModal(true);
    };

    const handleDeleteKamar = async (id, nomorKamar) => {
        if (window.confirm(`Yakin ingin menghapus kamar ${nomorKamar}?`)) {
            try {
                await kamarAPI.delete(id);
                fetchData();
                alert('Kamar berhasil dihapus!');
            } catch (error) {
                console.error('Error deleting kamar:', error);
                alert(error.response?.data?.error || 'Gagal menghapus kamar');
            }
        }
    };

    const handleSubmitKamar = async (formData) => {
        try {
            if (editingKamar) {
                await kamarAPI.update(editingKamar.id, formData);
                alert('Kamar berhasil diupdate!');
            } else {
                await kamarAPI.create(formData);
                alert('Kamar berhasil ditambahkan!');
            }
            setShowKamarModal(false);
            setEditingKamar(null);
            fetchData();
        } catch (error) {
            console.error('Error submitting kamar:', error);
            alert(error.response?.data?.error || 'Gagal menyimpan kamar');
        }
    };

    const handleApproveBooking = async (id) => {
        if (!window.confirm('Setujui booking ini?')) {
            return;
        }

        try {
            await adminAPI.updateBookingStatus(id, 'APPROVED');
            fetchData();
            alert('Booking berhasil disetujui!');
        } catch (error) {
            console.error('Error approving booking:', error);
            alert('Gagal menyetujui booking');
        }
    };

    const handleVerifikasiPembayaran = async (id, newStatus) => {
        if (!window.confirm(`${newStatus === 'VERIFIED' ? 'Verifikasi' : 'Tolak'} pembayaran ini?`)) {
            return;
        }

        try {
            await adminAPI.verifikasiPembayaran(id, newStatus);
            fetchData();
            alert(`Pembayaran berhasil ${newStatus === 'VERIFIED' ? 'diverifikasi' : 'ditolak'}!`);
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Gagal memverifikasi pembayaran');
        }
    };

    const handleRejectBooking = async (id) => {
        if (!window.confirm('Tolak booking ini?')) {
            return;
        }

        try {
            await adminAPI.updateBookingStatus(id, 'REJECTED');
            fetchData();
            alert('Booking berhasil ditolak!');
        } catch (error) {
            console.error('Error rejecting booking:', error);
            alert('Gagal menolak booking');
        }
    };

    const filteredPembayaran = pembayaranList.filter(item =>
        item.booking?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.booking?.kamar?.kodeKamar?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get unique penghuni from TERISI kamar (not from pembayaran to avoid duplicates)
    const penghuniMap = new Map();
    kamarList.forEach(kamar => {
        if (kamar.statusKamar === 'TERISI') {
            // Find active booking for this kamar
            const payment = pembayaranList.find(p =>
                p.booking?.kamar?.id === kamar.id &&
                p.booking?.status === 'APPROVED'
            );

            if (payment && payment.booking?.user && !penghuniMap.has(payment.booking.user.id)) {
                penghuniMap.set(payment.booking.user.id, {
                    id: payment.booking.user.id,
                    name: payment.booking.user.name || payment.booking.user.email,
                    email: payment.booking.user.email,
                    nomor_hp: payment.booking.user.phone || '-',
                    kamar: kamar.kodeKamar,
                    status_sewa: payment.booking.status
                });
            }
        }
    });
    const penghuniList = Array.from(penghuniMap.values());

    // Calculate total pendapatan with duration
    const totalPendapatan = pembayaranList
        .filter(p => p.status === 'VERIFIED')
        .reduce((sum, p) => {
            if (p.booking?.kamar?.harga && p.booking?.tanggalMasuk && p.booking?.tanggalKeluar) {
                const harga = p.booking.kamar.harga;
                const tanggalMasuk = new Date(p.booking.tanggalMasuk);
                const tanggalKeluar = new Date(p.booking.tanggalKeluar);
                const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                return sum + (harga * durasi);
            }
            return sum;
        }, 0);

    const kamarTerisi = kamarList.filter(k => k.statusKamar === 'TERISI').length;
    const totalKamar = kamarList.length;
    const perluVerifikasi = pembayaranList.filter(p => p.status === 'PENDING').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 fixed h-full z-10 hidden md:block">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">K</div>
                    <span className="text-xl font-bold text-gray-900">Kos Pak Le</span>
                </div>

                <nav className="p-4 space-y-1">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('kamar')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'kamar' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}>
                        <Home size={20} /> Data Kamar
                    </button>
                    <button onClick={() => setActiveTab('penghuni')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'penghuni' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}>
                        <Users size={20} /> Data Penghuni
                    </button>
                    <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'bookings' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}>
                        <FileText size={20} /> Bookings
                    </button>
                    <button onClick={() => setActiveTab('laporan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'laporan' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}>
                        <FileText size={20} /> Laporan
                    </button>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl font-medium transition-colors">
                        <LogOut size={20} /> Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 px-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'dashboard' && 'Overview'}
                        {activeTab === 'kamar' && 'Data Kamar'}
                        {activeTab === 'penghuni' && 'Data Penghuni'}
                        {activeTab === 'laporan' && 'Laporan'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button onClick={handleNotification} className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
                            <Bell size={20} />
                            {perluVerifikasi > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-gray-900">{user?.name || 'Admin'}</div>
                                <div className="text-xs text-gray-500">Pemilik</div>
                            </div>
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin+Kost&background=2563eb&color=fff" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-gray-500 text-sm mb-1">Total Pendapatan (Lunas)</div>
                                    <div className="text-2xl font-bold text-gray-900">Rp {totalPendapatan.toLocaleString('id-ID')}</div>
                                    <div className="text-xs text-gray-400 mt-1">Dari {pembayaranList.filter(p => p.status === 'LUNAS').length} pembayaran</div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-gray-500 text-sm mb-1">Kamar Terisi</div>
                                    <div className="text-2xl font-bold text-gray-900">{kamarTerisi} / {totalKamar}</div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full mt-3">
                                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${totalKamar > 0 ? (kamarTerisi / totalKamar * 100) : 0}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="text-gray-500 text-sm mb-1">Perlu Verifikasi</div>
                                    <div className="text-2xl font-bold text-yellow-600">{perluVerifikasi} Pembayaran</div>
                                    <div className="text-xs text-gray-400 mt-1">Segera cek data masuk</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <h3 className="font-bold text-gray-900">Verifikasi Pembayaran</h3>
                                    <div className="relative">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Cari penyewa atau kamar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Nama Penyewa</th>
                                                <th className="px-6 py-3 font-medium">Kamar</th>
                                                <th className="px-6 py-3 font-medium">Bulan</th>
                                                <th className="px-6 py-3 font-medium">Jumlah</th>
                                                <th className="px-6 py-3 font-medium">Bukti</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                                <th className="px-6 py-3 font-medium text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredPembayaran.length > 0 ? filteredPembayaran.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{item.booking?.user?.name || '-'}</td>
                                                    <td className="px-6 py-4 text-gray-600">{item.booking?.kamar?.kodeKamar || '-'}</td>
                                                    <td className="px-6 py-4 text-gray-600">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                                                    <td className="px-6 py-4 font-medium">
                                                        Rp {(() => {
                                                            if (item.booking?.kamar?.harga && item.booking?.tanggalMasuk && item.booking?.tanggalKeluar) {
                                                                const harga = item.booking.kamar.harga;
                                                                const tanggalMasuk = new Date(item.booking.tanggalMasuk);
                                                                const tanggalKeluar = new Date(item.booking.tanggalKeluar);
                                                                const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                                                                return (harga * durasi).toLocaleString('id-ID');
                                                            }
                                                            return '0';
                                                        })()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.paymentProof ? <a href={item.paymentProof} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Lihat <ExternalLink size={14} /></a> : <span className="text-gray-400">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                            item.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>{item.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleVerifikasiPembayaran(item.id, 'VERIFIED')} disabled={item.status !== 'PENDING'} className={`p-1 rounded transition-colors ${item.status === 'PENDING' ? 'text-green-600 hover:bg-green-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`} title="Terima"><CheckCircle size={18} /></button>
                                                            <button onClick={() => handleVerifikasiPembayaran(item.id, 'REJECTED')} disabled={item.status !== 'PENDING'} className={`p-1 rounded transition-colors ${item.status === 'PENDING' ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`} title="Tolak"><XCircle size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">{searchQuery ? 'Tidak ada data yang cocok' : 'Belum ada data pembayaran'}</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Data Kamar Tab */}
                    {activeTab === 'kamar' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Daftar Semua Kamar</h3>
                                <button onClick={handleAddKamar} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    <Plus size={18} /> Tambah Kamar
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Nomor Kamar</th>
                                            <th className="px-6 py-3 font-medium">Tipe</th>
                                            <th className="px-6 py-3 font-medium">Lantai</th>
                                            <th className="px-6 py-3 font-medium">Harga/Bulan</th>
                                            <th className="px-6 py-3 font-medium">Fasilitas</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {kamarList.map((kamar) => (
                                            <tr key={kamar.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{kamar.kodeKamar}</td>
                                                <td className="px-6 py-4 text-gray-600">{kamar.tipe?.nama || '-'}</td>
                                                <td className="px-6 py-4 text-gray-600">-</td>
                                                <td className="px-6 py-4 font-medium">Rp {kamar.harga?.toLocaleString('id-ID') || '0'}</td>
                                                <td className="px-6 py-4 text-gray-600 text-xs">{kamar.tipe?.fasilitas?.join(', ') || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${kamar.statusKamar === 'TERSEDIA' ? 'bg-green-100 text-green-700' : kamar.statusKamar === 'TERISI' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{kamar.statusKamar}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => handleEditKamar(kamar)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteKamar(kamar.id, kamar.nomor_kamar)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Data Penghuni Tab */}
                    {activeTab === 'penghuni' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100"><h3 className="font-bold text-gray-900">Daftar Penghuni Aktif</h3></div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Nama</th>
                                            <th className="px-6 py-3 font-medium">Email</th>
                                            <th className="px-6 py-3 font-medium">No. HP</th>
                                            <th className="px-6 py-3 font-medium">Kamar</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {penghuniList.length > 0 ? penghuniList.map((penghuni) => (
                                            <tr key={penghuni.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{penghuni.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{penghuni.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{penghuni.nomor_hp || '-'}</td>
                                                <td className="px-6 py-4 text-gray-600">{penghuni.kamar}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${penghuni.status_sewa === 'AKTIF' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{penghuni.status_sewa}</span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada penghuni aktif</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">Daftar Booking</h3>
                                    <p className="text-sm text-gray-500">Total: {bookingsList.length} booking</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kamar</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Dokumen</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {bookingsList.length > 0 ? bookingsList.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                                                        <div className="text-xs text-gray-500">{booking.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{booking.kamar?.kodeKamar}</div>
                                                        <div className="text-xs text-gray-500">{booking.kamar?.tipe?.nama}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">{new Date(booking.tanggalMasuk).toLocaleDateString('id-ID')}</div>
                                                        <div className="text-xs text-gray-500">s/d {booking.tanggalKeluar ? new Date(booking.tanggalKeluar).toLocaleDateString('id-ID') : '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-2">
                                                            {booking.ktp ? (
                                                                <a href={booking.ktp} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">
                                                                    <FileText size={12} /> KTP
                                                                </a>
                                                            ) : <span className="text-xs text-gray-400">No KTP</span>}
                                                            {booking.foto ? (
                                                                <a href={booking.foto} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">
                                                                    <User size={12} /> Foto
                                                                </a>
                                                            ) : <span className="text-xs text-gray-400">No Foto</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {booking.status === 'PENDING' && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleApproveBooking(booking.id)}
                                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                    title="Setujui"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectBooking(booking.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Tolak"
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {booking.status === 'APPROVED' && (
                                                            <span className="text-xs text-green-600 font-medium">✓ Disetujui</span>
                                                        )}
                                                        {booking.status === 'REJECTED' && (
                                                            <span className="text-xs text-red-600 font-medium">✗ Ditolak</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                        Belum ada booking
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Laporan Tab */}
                    {activeTab === 'laporan' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4">Ringkasan Keuangan</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Pendapatan (Lunas)</span>
                                            <span className="font-bold text-green-600">Rp {totalPendapatan.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Menunggu Verifikasi</span>
                                            <span className="font-bold text-yellow-600">Rp {pembayaranList.filter(p => p.status === 'PENDING').reduce((sum, p) => {
                                                if (p.booking?.kamar?.harga && p.booking?.tanggalMasuk && p.booking?.tanggalKeluar) {
                                                    const harga = p.booking.kamar.harga;
                                                    const tanggalMasuk = new Date(p.booking.tanggalMasuk);
                                                    const tanggalKeluar = new Date(p.booking.tanggalKeluar);
                                                    const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                                                    return sum + (harga * durasi);
                                                }
                                                return sum;
                                            }, 0).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Ditolak</span>
                                            <span className="font-bold text-red-600">Rp {pembayaranList.filter(p => p.status === 'REJECTED').reduce((sum, p) => {
                                                if (p.booking?.kamar?.harga && p.booking?.tanggalMasuk && p.booking?.tanggalKeluar) {
                                                    const harga = p.booking.kamar.harga;
                                                    const tanggalMasuk = new Date(p.booking.tanggalMasuk);
                                                    const tanggalKeluar = new Date(p.booking.tanggalKeluar);
                                                    const durasi = Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24 * 30));
                                                    return sum + (harga * durasi);
                                                }
                                                return sum;
                                            }, 0).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4">Tingkat Hunian</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Kamar Terisi</span>
                                            <span className="font-bold text-blue-600">{kamarTerisi} kamar</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Kamar Tersedia</span>
                                            <span className="font-bold text-green-600">{totalKamar - kamarTerisi} kamar</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Persentase Hunian</span>
                                            <span className="font-bold text-gray-900">{totalKamar > 0 ? Math.round((kamarTerisi / totalKamar) * 100) : 0}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4">Status Pembayaran</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-green-50 rounded-xl">
                                        <div className="text-sm text-green-700 mb-1">Lunas</div>
                                        <div className="text-2xl font-bold text-green-600">{pembayaranList.filter(p => p.status === 'VERIFIED').length}</div>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-xl">
                                        <div className="text-sm text-yellow-700 mb-1">Menunggu</div>
                                        <div className="text-2xl font-bold text-yellow-600">{pembayaranList.filter(p => p.status === 'PENDING').length}</div>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-xl">
                                        <div className="text-sm text-red-700 mb-1">Ditolak</div>
                                        <div className="text-2xl font-bold text-red-600">{pembayaranList.filter(p => p.status === 'REJECTED').length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Kamar Modal */}
            <KamarModal
                isOpen={showKamarModal}
                onClose={() => {
                    setShowKamarModal(false);
                    setEditingKamar(null);
                }}
                onSubmit={handleSubmitKamar}
                kamar={editingKamar}
                tipeKamarList={tipeKamarList}
            />
        </div>
    );
};

export default AdminDashboard;
