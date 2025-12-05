require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import controllers
const AuthController = require('./controllers/AuthController');
const KamarController = require('./controllers/KamarController');
const PembayaranController = require('./controllers/PembayaranController');
const TipeKamarController = require('./controllers/TipeKamarController');
const BookingController = require('./controllers/BookingController');

// Import middleware
const { authenticate, isAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Auth routes (public)
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);
app.get('/api/auth/me', authenticate, AuthController.getMe);

// Kamar routes (public)
app.get('/api/kamar', KamarController.getAllKamar);
app.get('/api/kamar/tersedia', KamarController.getKamarTersedia);
app.get('/api/kamar/tipe', KamarController.getTipeKamar);
app.get('/api/kamar/:id', KamarController.getKamarById);

// Admin: Kamar CRUD (protected)
app.post('/api/kamar', authenticate, isAdmin, KamarController.createKamar);
app.put('/api/kamar/:id', authenticate, isAdmin, KamarController.updateKamar);
app.delete('/api/kamar/:id', authenticate, isAdmin, KamarController.deleteKamar);

// TipeKamar routes
app.get('/api/tipe-kamar', TipeKamarController.getAllTipeKamar);
app.get('/api/tipe-kamar/:id', TipeKamarController.getTipeKamarById);
app.post('/api/tipe-kamar', authenticate, isAdmin, TipeKamarController.createTipeKamar);
app.put('/api/tipe-kamar/:id', authenticate, isAdmin, TipeKamarController.updateTipeKamar);
app.delete('/api/tipe-kamar/:id', authenticate, isAdmin, TipeKamarController.deleteTipeKamar);

// Pembayaran routes (protected)
app.get('/api/pembayaran/saya', authenticate, PembayaranController.getPembayaranSaya);
app.post('/api/pembayaran', authenticate, PembayaranController.uploadBuktiBayar);

// Booking routes (protected)
app.post('/api/booking', authenticate, BookingController.createBooking);
app.get('/api/booking/my', authenticate, BookingController.getMyBookings);
app.patch('/api/booking/:id/upload-payment', authenticate, BookingController.uploadPaymentProof);
app.patch('/api/booking/:id/upload-agreement', authenticate, BookingController.uploadAgreementProof);

// Admin routes (protected - admin only)
app.get('/api/admin/pembayaran', authenticate, isAdmin, PembayaranController.getAllPembayaran);
app.patch('/api/pembayaran/:id/verifikasi', authenticate, isAdmin, PembayaranController.verifikasiPembayaran);

// Admin booking routes
app.get('/api/admin/bookings', authenticate, isAdmin, BookingController.getAllBookings);
app.patch('/api/admin/bookings/:id/status', authenticate, isAdmin, BookingController.updateBookingStatus);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Kos Pak Le API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API ready at http://localhost:${PORT}/api`);
});
