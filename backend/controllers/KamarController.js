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
        const { kodeKamar, tipeKamar, harga, statusKamar } = req.body;

        const kamar = await prisma.kamar.create({
            data: {
                kodeKamar,
                tipeKamar: parseInt(tipeKamar),
                harga: parseInt(harga),
                statusKamar
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
        const { kodeKamar, tipeKamar, harga, statusKamar } = req.body;

        const kamar = await prisma.kamar.update({
            where: { id: parseInt(id) },
            data: {
                ...(kodeKamar && { kodeKamar }),
                ...(tipeKamar && { tipeKamar: parseInt(tipeKamar) }),
                ...(harga && { harga: parseInt(harga) }),
                ...(statusKamar && { statusKamar })
            },
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
