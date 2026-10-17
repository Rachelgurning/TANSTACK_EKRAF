# Catatan ZIP Perbaikan OnanAI / TanStack Ekraf

## Menjalankan proyek
1. Ekstrak ZIP ke folder baru.
2. Jalankan `bun install`.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi `BETTER_AUTH_URL=http://localhost:3000` dan buat `BETTER_AUTH_SECRET` unik untuk mesin lokal.
5. Isi `OPENAI_API_KEY` hanya jika fitur AI digunakan. Jangan commit `.env.local`.
6. Jalankan `bunx tsr generate`, `bun run lint`, `bun run typecheck`, `bun run build`, lalu `bun dev`.

## Perubahan yang diterapkan
- Menghapus route duplikat `src/routes/dashboard.tsx` dan route `/about.tsx` agar tidak konflik dengan dashboard pada layout admin.
- Menambahkan tipe eksplisit untuk tombol Header, login, dan register.
- Memperbaiki key thumb slider menjadi key berlabel posisi.
- Menambahkan fallback generic `serif` pada font Georgia.
- Mengubah pembungkus Field AI menjadi `div` supaya tidak memakai `<label>` yang tidak terhubung dengan kontrol.
- Membersihkan file `.env.local` dan mengganti `.env.example` dengan placeholder, bukan kredensial.

Catatan: jalankan semua pemeriksaan pada mesin lokal. ZIP ini tidak menyertakan `node_modules`, `.git`, atau hasil build agar lebih ringan dan tidak membawa data rahasia.
