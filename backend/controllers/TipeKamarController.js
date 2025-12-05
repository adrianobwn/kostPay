const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all tipe kamar
exports.getAllTipeKamar = async (req, res) => {
    try {
        const tipeKamar = await prisma.tipeKamar.findMany({
            include: {
                kamar: {
                    select: {
                        status: true
                    }
                }
            },
            orderBy: {
                nama: 'asc'
            }
        });

        // Hitung jumlah tersedia dan total untuk setiap tipe
        const result = tipeKamar.map(tipe => {
            const total = tipe.kamar.length;
            const tersedia = tipe.kamar.filter(k => k.status === 'TERSEDIA').length;

            return {
                id: tipe.id,
                nama: tipe.nama,
                harga: tipe.harga,
                fasilitas: JSON.parse(tipe.fasilitas),
                tersedia,
                total
            };
        });

        res.json({ tipeKamar: result });
    } catch (error) {
        console.error('GetAllTipeKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Get tipe kamar by ID
exports.getTipeKamarById = async (req, res) => {
    try {
        const { id } = req.params;

        const tipeKamar = await prisma.tipeKamar.findUnique({
            where: { id: parseInt(id) },
            include: {
                kamar: true
            }
        });

        if (!tipeKamar) {
            return res.status(404).json({ error: 'Tipe kamar tidak ditemukan' });
        }

        res.json({
            tipeKamar: {
                ...tipeKamar,
                fasilitas: JSON.parse(tipeKamar.fasilitas)
            }
        });
    } catch (error) {
        console.error('GetTipeKamarById error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Update tipe kamar (termasuk harga)
exports.updateTipeKamar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, harga, fasilitas } = req.body;

        // Cek apakah tipe kamar exists
        const existing = await prisma.tipeKamar.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Tipe kamar tidak ditemukan' });
        }

        // Validasi harga
        if (harga && harga < 0) {
            return res.status(400).json({ error: 'Harga tidak boleh negatif' });
        }

        // Update tipe kamar
        const tipeKamar = await prisma.tipeKamar.update({
            where: { id: parseInt(id) },
            data: {
                ...(nama && { nama }),
                ...(harga && { harga: parseInt(harga) }),
                ...(fasilitas && { fasilitas: JSON.stringify(fasilitas) })
            }
        });

        res.json({
            message: 'Tipe kamar berhasil diupdate',
            tipeKamar: {
                ...tipeKamar,
                fasilitas: JSON.parse(tipeKamar.fasilitas)
            }
        });
    } catch (error) {
        console.error('UpdateTipeKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Create tipe kamar baru
exports.createTipeKamar = async (req, res) => {
    try {
        const { nama, harga, fasilitas } = req.body;

        // Validasi
        if (!nama || !harga || !fasilitas) {
            return res.status(400).json({ error: 'Nama, harga, dan fasilitas harus diisi' });
        }

        if (harga < 0) {
            return res.status(400).json({ error: 'Harga tidak boleh negatif' });
        }

        // Cek duplikat nama
        const existing = await prisma.tipeKamar.findFirst({
            where: { nama }
        });

        if (existing) {
            return res.status(400).json({ error: 'Nama tipe kamar sudah digunakan' });
        }

        const tipeKamar = await prisma.tipeKamar.create({
            data: {
                nama,
                harga: parseInt(harga),
                fasilitas: JSON.stringify(fasilitas)
            }
        });

        res.status(201).json({
            message: 'Tipe kamar berhasil ditambahkan',
            tipeKamar: {
                ...tipeKamar,
                fasilitas: JSON.parse(tipeKamar.fasilitas)
            }
        });
    } catch (error) {
        console.error('CreateTipeKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};

// Admin: Delete tipe kamar
exports.deleteTipeKamar = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek apakah ada kamar yang menggunakan tipe ini
        const kamarCount = await prisma.kamar.count({
            where: { tipe_id: parseInt(id) }
        });

        if (kamarCount > 0) {
            return res.status(400).json({
                error: `Tidak bisa menghapus tipe kamar yang masih digunakan oleh ${kamarCount} kamar`
            });
        }

        await prisma.tipeKamar.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Tipe kamar berhasil dihapus' });
    } catch (error) {
        console.error('DeleteTipeKamar error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
};
