import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authAPI } from '../api';


const AuthForm = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login
                const response = await authAPI.login({
                    email: formData.email,
                    password: formData.password
                });

                // Simpan token dan user info
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirect berdasarkan role
                if (response.data.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                // Register
                await authAPI.register({
                    name: formData.nama_lengkap,
                    email: formData.email,
                    password: formData.password
                });
                alert('Registrasi berhasil! Silakan login.');
                setIsLogin(true);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.response?.data?.error || 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali</span>
                </button>

                {/* Auth Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                            K
                        </div>
                        <h1 className="text-2xl font-bold mb-2">
                            {isLogin ? 'Selamat Datang Kembali' : 'Daftar Akun Baru'}
                        </h1>
                        <p className="text-blue-100">Kos Pak Le</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={formData.nama_lengkap}
                                            onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="Masukkan nama lengkap"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="nama@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {isLogin && (
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-600 group-hover:text-gray-900">Ingat saya</span>
                                    </label>
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Lupa password?</a>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                            </button>
                        </form>

                        {/* Toggle Login/Register */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                                {' '}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
                                >
                                    {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                                </button>
                            </p>
                        </div>

                        {/* Dummy Account Info - Only show on login */}
                        {isLogin && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-xs font-bold text-blue-900 mb-2">🔑 Akun Dummy untuk Testing:</p>
                                <div className="space-y-1 text-xs text-blue-800">
                                    <p><strong>Admin:</strong> admin@kospakle.com / admin123</p>
                                    <p><strong>Penghuni:</strong> budi@gmail.com / budi123</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Text */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Dengan mendaftar, Anda menyetujui <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a> kami
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
