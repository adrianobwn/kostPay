const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// User: Get my payments
exports.getPembayaranSaya = async (req, res) => {
    try {
        const userId = req.user.userId;

        const payments = await prisma.payments.findMany({
            where: {
                booking: {
                    userId: userId
                }
            },
            include: {
                booking: {
                    include: {
                        kamar: {
                            include: {
                                tipe: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ payments });
    } catch (error) {
        console.error('GetPembayaranSaya error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// User: Upload bukti bayar
exports.uploadBuktiBayar = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookingId, paymentProof } = req.body;

        // Verify booking belongs to user
        const booking = await prisma.booking.findFirst({
            where: {
                id: parseInt(bookingId),
                userId: userId
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking tidak ditemukan' });
        }

        // Create payment
        const payment = await prisma.payments.create({
            data: {
                idBooking: parseInt(bookingId),
                paymentProof,
                status: 'PENDING'
            }
        });

        res.status(201).json({
            message: 'Bukti pembayaran berhasil diupload',
            payment
        });
    } catch (error) {
        console.error('UploadBuktiBayar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Get all payments
exports.getAllPembayaran = async (req, res) => {
    try {
        const payments = await prisma.payments.findMany({
            include: {
                booking: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        kamar: {
                            include: {
                                tipe: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Parse fasilitas
        const result = payments.map(p => ({
            ...p,
            booking: {
                ...p.booking,
                kamar: {
                    ...p.booking.kamar,
                    tipe: {
                        ...p.booking.kamar.tipe,
                        fasilitas: JSON.parse(p.booking.kamar.tipe.fasilitas)
                    }
                }
            }
        }));

        res.json({ payments: result });
    } catch (error) {
        console.error('GetAllPembayaran error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Verifikasi pembayaran
exports.verifikasiPembayaran = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['VERIFIED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Status tidak valid' });
        }

        const payment = await prisma.payments.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({
            message: `Pembayaran berhasil ${status === 'VERIFIED' ? 'diverifikasi' : 'ditolak'}`,
            payment
        });
    } catch (error) {
        console.error('VerifikasiPembayaran error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};
