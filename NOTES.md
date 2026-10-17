# Catatan Perubahan OnanAI

## Konsep
OnanAI adalah prototipe pasar digital untuk UMKM lokal Samosir. Antarmuka utama menggunakan Bahasa Indonesia dan palet merah Toba, putih, serta hitam lembut.

## Perubahan yang dibuat
- Mengubah beranda menjadi halaman pemasaran OnanAI dengan produk pilihan, penjelasan bantuan AI, dan ajakan bergabung.
- Menambahkan halaman daftar akun (`/register`) dan merapikan halaman masuk (`/login`) menggunakan Better Auth.
- Merancang dasbor penjual (`/dashboard`) dengan ringkasan produk, stok, perkiraan nilai stok, dan pintasan tindakan.
- Memperbarui katalog (`/products`) dengan pencarian, pengurutan harga, kartu produk, serta keadaan memuat/kosong/error.
- Menambahkan halaman mitra QR (`/qr-partners`) dengan alur kerja, tautan katalog, dan formulir minat prototipe.
- Memperbaiki ketidaksesuaian nilai gaya bahasa AI antara antarmuka dan validasi server agar pilihan Ramah, Profesional, dan Meyakinkan dikirim dalam format yang diterima API.
- Memperketat validasi manajemen pengguna: admin terakhir tidak bisa diturunkan perannya/dihapus dan admin tidak bisa menghapus akun sendiri.
- Memperbaiki aturan Hooks pada halaman detail pengguna agar state tidak dibuat setelah kondisi return.
- Memperbarui header, footer, gaya global, responsivitas, dan bahasa dokumen.
- Menambahkan produk contoh lokal di penyimpanan memori agar katalog tidak kosong pada awal aplikasi.
- Menjaga struktur proyek TanStack Start dan file yang sudah ada; tidak menghapus route starter.

## Batasan penting
- Penyimpanan tetap in-memory sesuai struktur awal. Data akun dan produk tidak dijamin bertahan setelah cold start/redeploy pada lingkungan serverless Vercel. Untuk produksi sungguhan diperlukan penyimpanan persisten, jika kelak diizinkan.
- Formulir minat kemitraan QR saat ini hanya prototipe sisi klien dan tidak mengirim data ke server.
- AI membutuhkan `OPENAI_API_KEY` yang valid pada environment server. Tanpa itu, halaman akan menampilkan pesan kesalahan yang sesuai.
- Foto produk memakai gambar jarak jauh dari Unsplash sebagai aset prototipe.
- Akun demo awal dari struktur proyek dapat dibuat melalui `/setup`; kredensial seed bawaan hanya untuk pengembangan dan harus diubah/dinonaktifkan sebelum penggunaan publik.

## Environment variables
Salin `.env.example` ke `.env.local`, lalu isi `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `OPENAI_API_KEY`, dan `OPENAI_MODEL`. Jangan commit `.env.local`.

## Pemeriksaan
Jalankan `bun install`, `bun run generate-routes`, `bun run lint`, dan `bun run build`. Status hasil pemeriksaan harus dicatat setelah benar-benar dijalankan di lingkungan pengguna.
