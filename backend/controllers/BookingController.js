const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new booking
exports.createBooking = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { idKamar, tanggalMasuk, durasi, nomorHP, kontakDarurat, pekerjaan, ktp, foto } = req.body;

        // Check if kamar is available
        const kamar = await prisma.kamar.findUnique({
            where: { id: parseInt(idKamar) }
        });

        if (!kamar) {
            return res.status(404).json({ error: 'Kamar tidak ditemukan' });
        }

        if (kamar.statusKamar !== 'TERSEDIA') {
            return res.status(400).json({ error: 'Kamar tidak tersedia' });
        }

        // Calculate tanggalKeluar based on durasi (in months)
        const tanggalMasukDate = new Date(tanggalMasuk);
        const tanggalKeluar = new Date(tanggalMasukDate);
        tanggalKeluar.setMonth(tanggalKeluar.getMonth() + parseInt(durasi));

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                userId: userId,
                idKamar: parseInt(idKamar),
                tanggalMasuk: tanggalMasukDate,
                tanggalKeluar: tanggalKeluar,
                status: 'PENDING',
                ktp: ktp,
                foto: foto,
                paymentProof: null,
                agreementProof: null
            },
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
        });

        res.status(201).json({
            message: 'Booking berhasil dibuat',
            booking
        });
    } catch (error) {
        console.error('CreateBooking error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat booking' });
    }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId;

        const bookings = await prisma.booking.findMany({
            where: {
                userId: userId
            },
            include: {
                kamar: {
                    include: {
                        tipe: true
                    }
                },
                payments: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Parse fasilitas
        const result = bookings.map(b => ({
            ...b,
            kamar: {
                ...b.kamar,
                tipe: {
                    ...b.kamar.tipe,
                    fasilitas: JSON.parse(b.kamar.tipe.fasilitas)
                }
            }
        }));

        res.json({ bookings: result });
    } catch (error) {
        console.error('GetMyBookings error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Upload payment proof
exports.uploadPaymentProof = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { paymentProof } = req.body;

        // Verify booking belongs to user
        const booking = await prisma.booking.findFirst({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking tidak ditemukan' });
        }

        // Update booking with payment proof
        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                paymentProof: paymentProof
            }
        });

        // Create payment record
        await prisma.payments.create({
            data: {
                idBooking: parseInt(id),
                paymentProof: paymentProof,
                status: 'PENDING'
            }
        });

        res.json({
            message: 'Bukti pembayaran berhasil diupload',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('UploadPaymentProof error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Upload agreement proof
exports.uploadAgreementProof = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { agreementProof } = req.body;

        // Verify booking belongs to user
        const booking = await prisma.booking.findFirst({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking tidak ditemukan' });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                agreementProof: agreementProof
            }
        });

        res.json({
            message: 'Bukti perjanjian berhasil diupload',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('UploadAgreementProof error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
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
                },
                payments: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Parse fasilitas
        const result = bookings.map(b => ({
            ...b,
            kamar: {
                ...b.kamar,
                tipe: {
                    ...b.kamar.tipe,
                    fasilitas: JSON.parse(b.kamar.tipe.fasilitas)
                }
            }
        }));

        res.json({ bookings: result });
    } catch (error) {
        console.error('GetAllBookings error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Approve/Reject booking
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Status tidak valid' });
        }

        const booking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        // If approved, update kamar status to TERISI and create sewa record
        if (status === 'APPROVED') {
            await prisma.kamar.update({
                where: { id: booking.idKamar },
                data: { statusKamar: 'TERISI' }
            });

            // Create sewa record
            const durasi = Math.ceil((new Date(booking.tanggalKeluar) - new Date(booking.tanggalMasuk)) / (1000 * 60 * 60 * 24 * 30));
            const kamar = await prisma.kamar.findUnique({ where: { id: booking.idKamar } });

            await prisma.sewa.create({
                data: {
                    userId: booking.userId,
                    idKamar: booking.idKamar,
                    tanggalMulaiSewa: booking.tanggalMasuk,
                    tanggalTenggatSewa: booking.tanggalKeluar,
                    status: 'AKTIF',
                    totalBayar: kamar.harga * durasi
                }
            });
        }

        res.json({
            message: `Booking berhasil ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}`,
            booking
        });
    } catch (error) {
        console.error('UpdateBookingStatus error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};
