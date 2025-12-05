const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller untuk menangani penyewaan kamar
const PemesananController = {
  
  // Fungsi untuk membuat sewa baru
  // Endpoint: POST /api/sewa
  buatSewaBaru: async (req, res) => {
    try {
      // Mengambil data dari input pengguna (frontend)
      const { id_pengguna, id_kamar, tanggal_masuk, tanggal_keluar } = req.body;

      // 1. Cek apakah kamar ada
      const dataKamar = await prisma.kamar.findUnique({
        where: { id: parseInt(id_kamar) }
      });

      if (!dataKamar) {
        return res.status(404).json({ pesan: "Kamar tidak ditemukan" });
      }

      // 2. Cek apakah kamar sedang dalam perbaikan
      if (dataKamar.status === 'PERBAIKAN') {
        return res.status(400).json({ pesan: "Kamar sedang dalam perbaikan" });
      }

      // 3. Cek bentrok jadwal (Apakah kamar sudah dipesan di tanggal tersebut?)
      // Logika: Cari pemesanan lain di kamar yang sama, yang statusnya DISETUJUI atau MENUNGGU
      // dan tanggalnya bertabrakan dengan tanggal yang diminta.
      const bentrokJadwal = await prisma.pemesanan.findFirst({
        where: {
          id_kamar: parseInt(id_kamar),
          status_sewa: { in: ['MENUNGGU', 'DISETUJUI'] }, // Hanya cek yang aktif
          OR: [
            {
              // Kasus A: Tanggal masuk baru ada di antara sewa orang lain
              AND: [
                { tanggal_masuk: { lte: new Date(tanggal_masuk) } },
                { tanggal_keluar: { gte: new Date(tanggal_masuk) } }
              ]
            },
            {
              // Kasus B: Tanggal keluar baru ada di antara sewa orang lain
              AND: [
                { tanggal_masuk: { lte: new Date(tanggal_keluar) } },
                { tanggal_keluar: { gte: new Date(tanggal_keluar) } }
              ]
            }
          ]
        }
      });

      // Jika ada bentrok, tolak pemesanan
      if (bentrokJadwal) {
        return res.status(400).json({ 
          pesan: "Maaf, kamar sudah terisi di tanggal tersebut. Silakan pilih tanggal lain." 
        });
      }

      // 4. Jika aman, buat data pemesanan baru di database
      const pemesananBaru = await prisma.pemesanan.create({
        data: {
          id_pengguna: parseInt(id_pengguna),
          id_kamar: parseInt(id_kamar),
          tanggal_masuk: new Date(tanggal_masuk),
          tanggal_keluar: new Date(tanggal_keluar),
          status_sewa: 'MENUNGGU' // Default status menunggu pembayaran/persetujuan
        }
      });

      // Berikan respon sukses ke frontend
      return res.status(201).json({
        sukses: true,
        pesan: "Permintaan sewa berhasil dibuat. Silakan lanjut ke pembayaran.",
        data: pemesananBaru
      });

    } catch (error) {
      // Jika ada error sistem (misal database mati)
      console.error("Error saat membuat sewa:", error);
      return res.status(500).json({ pesan: "Terjadi kesalahan pada server" });
    }
  }
};

module.exports = PemesananController;
