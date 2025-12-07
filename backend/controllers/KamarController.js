const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all kamar
exports.getAllKamar = async (req, res) => {
    try {
        const kamar = await prisma.kamar.findMany({
            include: {
                tipe: true
            },
            orderBy: {
                kodeKamar: 'asc'
            }
        });

        // Parse fasilitas JSON
        const result = kamar.map(k => ({
            ...k,
            tipe: {
                ...k.tipe,
                fasilitas: JSON.parse(k.tipe.fasilitas)
            }
        }));

        res.json({ kamar: result });
    } catch (error) {
        console.error('GetAllKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Get available kamar
exports.getKamarTersedia = async (req, res) => {
    try {
        const kamar = await prisma.kamar.findMany({
            where: {
                statusKamar: 'TERSEDIA'
            },
            include: {
                tipe: true
            },
            orderBy: {
                kodeKamar: 'asc'
            }
        });

        const result = kamar.map(k => ({
            ...k,
            tipe: {
                ...k.tipe,
                fasilitas: JSON.parse(k.tipe.fasilitas)
            }
        }));

        res.json({ kamar: result });
    } catch (error) {
        console.error('GetKamarTersedia error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Get tipe kamar
exports.getTipeKamar = async (req, res) => {
    try {
        const tipeKamar = await prisma.tipe_Kamar.findMany({
            where: {
                statusKamar: 'ACTIVE'
            }
        });

        const result = tipeKamar.map(t => ({
            ...t,
            fasilitas: JSON.parse(t.fasilitas)
        }));

        res.json({ tipeKamar: result });
    } catch (error) {
        console.error('GetTipeKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Get kamar by ID
exports.getKamarById = async (req, res) => {
    try {
        const { id } = req.params;

        const kamar = await prisma.kamar.findUnique({
            where: { id: parseInt(id) },
            include: {
                tipe: true
            }
        });

        if (!kamar) {
            return res.status(404).json({ error: 'Kamar tidak ditemukan' });
        }

        res.json({
            kamar: {
                ...kamar,
                tipe: {
                    ...kamar.tipe,
                    fasilitas: JSON.parse(kamar.tipe.fasilitas)
                }
            }
        });
    } catch (error) {
        console.error('GetKamarById error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Create kamar
exports.createKamar = async (req, res) => {
    try {
        // Menerima data dari frontend dengan nama field yang sesuai
        const { nomor_kamar, tipe_id, lantai, status } = req.body;

        // Validasi input
        if (!nomor_kamar || !tipe_id) {
            return res.status(400).json({ error: 'Nomor kamar dan tipe kamar harus diisi' });
        }

        // Cek tipe kamar untuk mendapatkan harga
        const tipeKamar = await prisma.tipe_Kamar.findUnique({
            where: { id: parseInt(tipe_id) }
        });

        if (!tipeKamar) {
            return res.status(400).json({ error: 'Tipe kamar tidak ditemukan' });
        }

        const kamar = await prisma.kamar.create({
            data: {
                kodeKamar: nomor_kamar,
                tipeKamar: parseInt(tipe_id),
                harga: tipeKamar.harga, // Mengambil harga dari tipe kamar
                statusKamar: status || 'TERSEDIA',
                lantai: lantai ? parseInt(lantai) : 1 // Default lantai 1 jika tidak diisi
            },
            include: {
                tipe: true
            }
        });

        res.status(201).json({
            message: 'Kamar berhasil ditambahkan',
            kamar: {
                ...kamar,
                tipe: {
                    ...kamar.tipe,
                    fasilitas: JSON.parse(kamar.tipe.fasilitas)
                }
            }
        });
    } catch (error) {
        console.error('CreateKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Update kamar
exports.updateKamar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomor_kamar, tipe_id, lantai, status } = req.body;

        // Data untuk update
        const updateData = {};

        if (nomor_kamar) updateData.kodeKamar = nomor_kamar;
        if (tipe_id) {
            // Jika tipe kamar diubah, dapatkan harga baru
            const tipeKamar = await prisma.tipe_Kamar.findUnique({
                where: { id: parseInt(tipe_id) }
            });

            if (!tipeKamar) {
                return res.status(400).json({ error: 'Tipe kamar tidak ditemukan' });
            }

            updateData.tipeKamar = parseInt(tipe_id);
            updateData.harga = tipeKamar.harga;
        }
        if (lantai) updateData.lantai = parseInt(lantai);
        if (status) updateData.statusKamar = status;

        const kamar = await prisma.kamar.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                tipe: true
            }
        });

        res.json({
            message: 'Kamar berhasil diupdate',
            kamar: {
                ...kamar,
                tipe: {
                    ...kamar.tipe,
                    fasilitas: JSON.parse(kamar.tipe.fasilitas)
                }
            }
        });
    } catch (error) {
        console.error('UpdateKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Delete kamar
exports.deleteKamar = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.kamar.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Kamar berhasil dihapus' });
    } catch (error) {
        console.error('DeleteKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};
