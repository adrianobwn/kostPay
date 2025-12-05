const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed with new schema...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const budiPassword = await bcrypt.hash('budi123', 10);
    const sitiPassword = await bcrypt.hash('siti123', 10);

    // 1. Create Users
    console.log('Creating users...');
    const admin = await prisma.users.create({
        data: {
            name: 'Pak Le',
            email: 'admin@kospakle.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    const budi = await prisma.users.create({
        data: {
            name: 'Budi Santoso',
            email: 'budi@gmail.com',
            password: budiPassword,
            role: 'PENGHUNI',
        },
    });

    const siti = await prisma.users.create({
        data: {
            name: 'Siti Nurhaliza',
            email: 'siti@gmail.com',
            password: sitiPassword,
            role: 'PENGHUNI',
        },
    });

    console.log('✅ Users created');

    // 2. Create Tipe_Kamar
    console.log('Creating room types...');
    const tipeAC = await prisma.tipe_Kamar.create({
        data: {
            nama: 'Kamar AC',
            fasilitas: JSON.stringify(['AC', 'Kasur', 'Lemari', 'Meja Belajar', 'Kamar Mandi Dalam']),
            statusKamar: 'ACTIVE',
        },
    });

    const tipeNonAC = await prisma.tipe_Kamar.create({
        data: {
            nama: 'Kamar Non-AC',
            fasilitas: JSON.stringify(['Kipas Angin', 'Kasur', 'Lemari', 'Meja Belajar', 'Kamar Mandi Dalam']),
            statusKamar: 'ACTIVE',
        },
    });

    console.log('✅ Room types created');

    // 3. Create Kamar
    console.log('Creating rooms...');
    const kamarA1 = await prisma.kamar.create({
        data: {
            kodeKamar: 'A1',
            tipeKamar: tipeAC.id,
            harga: 1600000,
            statusKamar: 'TERISI',
        },
    });

    const kamarA5 = await prisma.kamar.create({
        data: {
            kodeKamar: 'A5',
            tipeKamar: tipeAC.id,
            harga: 1600000,
            statusKamar: 'TERISI',
        },
    });

    // Create more available rooms
    await prisma.kamar.createMany({
        data: [
            { kodeKamar: 'A2', tipeKamar: tipeAC.id, harga: 1600000, statusKamar: 'TERSEDIA' },
            { kodeKamar: 'A3', tipeKamar: tipeAC.id, harga: 1600000, statusKamar: 'TERSEDIA' },
            { kodeKamar: 'A4', tipeKamar: tipeAC.id, harga: 1600000, statusKamar: 'TERSEDIA' },
            { kodeKamar: 'B1', tipeKamar: tipeNonAC.id, harga: 1200000, statusKamar: 'TERSEDIA' },
            { kodeKamar: 'B2', tipeKamar: tipeNonAC.id, harga: 1200000, statusKamar: 'TERSEDIA' },
            { kodeKamar: 'B3', tipeKamar: tipeNonAC.id, harga: 1200000, statusKamar: 'TERSEDIA' },
            { kodeKamar: 'B4', tipeKamar: tipeNonAC.id, harga: 1200000, statusKamar: 'TERSEDIA' },
            { kodeKamar: 'B5', tipeKamar: tipeNonAC.id, harga: 1200000, statusKamar: 'TERSEDIA' },
        ],
    });

    console.log('✅ Rooms created');

    // 4. Create Sewa (active rentals)
    console.log('Creating rentals...');
    const sewaBudi = await prisma.sewa.create({
        data: {
            userId: budi.id,
            idKamar: kamarA1.id,
            tanggalMulaiSewa: new Date('2024-01-01'),
            tanggalTenggatSewa: new Date('2025-01-01'),
            status: 'AKTIF',
            totalBayar: 1600000,
        },
    });

    const sewaSiti = await prisma.sewa.create({
        data: {
            userId: siti.id,
            idKamar: kamarA5.id,
            tanggalMulaiSewa: new Date('2024-02-01'),
            tanggalTenggatSewa: new Date('2025-02-01'),
            status: 'AKTIF',
            totalBayar: 1600000,
        },
    });

    console.log('✅ Rentals created');

    // 5. Create Booking
    console.log('Creating bookings...');
    const bookingBudi = await prisma.booking.create({
        data: {
            userId: budi.id,
            idKamar: kamarA1.id,
            tanggalMasuk: new Date('2024-01-01'),
            tanggalKeluar: null,
            status: 'APPROVED',
            paymentProof: 'https://example.com/bukti-budi.jpg',
            agreementProof: 'https://example.com/agreement-budi.pdf',
        },
    });

    const bookingSiti = await prisma.booking.create({
        data: {
            userId: siti.id,
            idKamar: kamarA5.id,
            tanggalMasuk: new Date('2024-02-01'),
            tanggalKeluar: null,
            status: 'APPROVED',
            paymentProof: 'https://example.com/bukti-siti.jpg',
            agreementProof: 'https://example.com/agreement-siti.pdf',
        },
    });

    console.log('✅ Bookings created');

    // 6. Create Payments
    console.log('Creating payments...');
    await prisma.payments.create({
        data: {
            idBooking: bookingBudi.id,
            paymentProof: 'https://example.com/payment-budi-des.jpg',
            status: 'VERIFIED',
        },
    });

    await prisma.payments.create({
        data: {
            idBooking: bookingBudi.id,
            paymentProof: null,
            status: 'PENDING',
        },
    });

    await prisma.payments.create({
        data: {
            idBooking: bookingSiti.id,
            paymentProof: 'https://example.com/payment-siti-des.jpg',
            status: 'VERIFIED',
        },
    });

    console.log('✅ Payments created');

    // 7. Create Notifikasi
    console.log('Creating notifications...');
    await prisma.notifikasi.createMany({
        data: [
            {
                userId: budi.id,
                message: 'Pembayaran bulan Desember telah diverifikasi',
                status: 'READ',
            },
            {
                userId: budi.id,
                message: 'Pembayaran bulan Januari menunggu verifikasi',
                status: 'UNREAD',
            },
            {
                userId: siti.id,
                message: 'Selamat datang di Kos Pak Le!',
                status: 'READ',
            },
        ],
    });

    console.log('✅ Notifications created');
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
