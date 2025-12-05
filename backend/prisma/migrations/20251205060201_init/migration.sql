-- CreateTable
CREATE TABLE `Pengguna` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nomor_hp` VARCHAR(191) NULL,
    `peran` ENUM('ADMIN', 'PENGHUNI') NOT NULL DEFAULT 'PENGHUNI',
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Pengguna_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipeKamar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `fasilitas` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kamar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_kamar` VARCHAR(191) NOT NULL,
    `tipe_id` INTEGER NOT NULL,
    `lantai` INTEGER NOT NULL,
    `status` ENUM('TERSEDIA', 'TERISI', 'MAINTENANCE') NOT NULL DEFAULT 'TERSEDIA',

    UNIQUE INDEX `Kamar_nomor_kamar_key`(`nomor_kamar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pemesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengguna_id` INTEGER NOT NULL,
    `kamar_id` INTEGER NOT NULL,
    `tanggal_masuk` DATETIME(3) NOT NULL,
    `tanggal_keluar` DATETIME(3) NULL,
    `status` ENUM('AKTIF', 'SELESAI', 'DIBATALKAN') NOT NULL DEFAULT 'AKTIF',
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembayaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pemesanan_id` INTEGER NOT NULL,
    `pengguna_id` INTEGER NOT NULL,
    `bulan` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `bukti_bayar` VARCHAR(191) NULL,
    `status` ENUM('MENUNGGU', 'LUNAS', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU',
    `tanggal_bayar` DATETIME(3) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kamar` ADD CONSTRAINT `Kamar_tipe_id_fkey` FOREIGN KEY (`tipe_id`) REFERENCES `TipeKamar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemesanan` ADD CONSTRAINT `Pemesanan_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemesanan` ADD CONSTRAINT `Pemesanan_kamar_id_fkey` FOREIGN KEY (`kamar_id`) REFERENCES `Kamar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_pemesanan_id_fkey` FOREIGN KEY (`pemesanan_id`) REFERENCES `Pemesanan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_pengguna_id_fkey` FOREIGN KEY (`pengguna_id`) REFERENCES `Pengguna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
