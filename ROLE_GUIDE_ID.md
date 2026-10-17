# Panduan Role OnanAI

- Pembeli dan penjual mendaftar dari `/register`; pilih Pembeli atau Penjual.
- Semua role menggunakan halaman `/login` yang sama. Server membaca role akun; pengguna tidak dapat memilih admin dari form publik.
- Admin dibuat melalui `/setup` pada mode development. Kredensial seed awal saat ini: `admin@example.com` / `admin12345`; segera ganti untuk penggunaan lokal dan jangan gunakan seed ini di deployment publik.
- Role menentukan akses data dan operasi; perubahan role admin harus dilakukan melalui area admin.
- Database aplikasi menggunakan memory adapter, jadi akun dan data akan hilang ketika proses server berhenti/restart.

## Menjalankan
1. `bun install`
2. Pastikan `.env.local` memiliki `BETTER_AUTH_SECRET` acak dan `BETTER_AUTH_URL=http://localhost:3000`.
3. `bun run generate-routes`
4. `bun run dev`
5. Buka `/setup` untuk membuat admin awal, lalu login di `/login`.

Jalankan `bun run typecheck`, `bun run lint`, dan `bun run build` untuk memvalidasi lingkungan lokal.
