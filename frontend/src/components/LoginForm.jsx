import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowLeft } from 'lucide-react';

const LoginForm = ({ userType = 'penghuni' }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulasi login (nanti bisa disambungkan ke backend)
        if (userType === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Kembali ke Beranda
                </button>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                            K
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {userType === 'admin' ? 'Login Admin' : 'Login Penghuni'}
                        </h1>
                        <p className="text-gray-500 mt-2">Kos Pak Le</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-gray-600">Ingat saya</span>
                            </label>
                            <a href="#" className="text-indigo-600 hover:underline">Lupa password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Masuk
                        </button>
                    </form>

                    {/* Divider */}
                    {userType === 'penghuni' && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                Belum punya akun? <a href="#" className="text-indigo-600 font-medium hover:underline">Daftar sekarang</a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
