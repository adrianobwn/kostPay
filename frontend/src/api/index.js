import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Kamar API
export const kamarAPI = {
    getAll: () => api.get('/kamar'),
    getTersedia: () => api.get('/kamar/tersedia'),
    getTipeKamar: () => api.get('/kamar/tipe'),
    getById: (id) => api.get(`/kamar/${id}`),
    create: (data) => api.post('/kamar', data),
    update: (id, data) => api.put(`/kamar/${id}`, data),
    delete: (id) => api.delete(`/kamar/${id}`),
};

// Pembayaran API
export const pembayaranAPI = {
    getSaya: () => api.get('/pembayaran/saya'),
    upload: (data) => api.post('/pembayaran', data),
};

// Booking API
export const bookingAPI = {
    create: (data) => api.post('/booking', data),
    getMy: () => api.get('/booking/my'),
    uploadPayment: (id, paymentProof) => api.patch(`/booking/${id}/upload-payment`, { paymentProof }),
    uploadAgreement: (id, agreementProof) => api.patch(`/booking/${id}/upload-agreement`, { agreementProof }),
};

// Admin API
export const adminAPI = {
    getAllPembayaran: () => api.get('/admin/pembayaran'),
    verifikasiPembayaran: (id, status) => api.patch(`/pembayaran/${id}/verifikasi`, { status }),
    getAllBookings: () => api.get('/admin/bookings'),
    updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
};

// TipeKamar API
export const tipeKamarAPI = {
    getAll: () => api.get('/tipe-kamar'),
    getById: (id) => api.get(`/tipe-kamar/${id}`),
    create: (data) => api.post('/tipe-kamar', data),
    update: (id, data) => api.put(`/tipe-kamar/${id}`, data),
    delete: (id) => api.delete(`/tipe-kamar/${id}`),
};

export default api;
