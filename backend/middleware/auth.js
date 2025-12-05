const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi JWT token
exports.authenticate = (req, res, next) => {
    try {
        // Ambil token dari header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token tidak ditemukan' });
        }

        const token = authHeader.split(' ')[1];

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan user info ke request
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token tidak valid' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token sudah kadaluarsa' });
        }
        return res.status(500).json({ error: 'Terjadi kesalahan autentikasi' });
    }
};

// Middleware untuk cek role admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang diizinkan.' });
    }
    next();
};

// Middleware untuk cek role penghuni
exports.isPenghuni = (req, res, next) => {
    if (req.user.role !== 'PENGHUNI') {
        return res.status(403).json({ error: 'Akses ditolak. Hanya penghuni yang diizinkan.' });
    }
    next();
};
