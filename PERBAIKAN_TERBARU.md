# Perbaikan terbaru TANSTACK EKRAF

## Perbaikan utama
- Memperbaiki JSX pada `src/routes/qr-partners.tsx`: elemen `<output>` sekarang ditutup dengan `</output>` (sebelumnya salah ditutup `</div>`).
- Tombol kirim minat kemitraan memakai `type="submit"`.
- File `.env.local`, folder `.git`, dan `node_modules` tidak disertakan dalam ZIP.

## Cara menjalankan
1. Ekstrak ZIP ke folder baru.
2. Jalankan `bun install`.
3. Salin contoh environment dengan `Copy-Item .env.example .env.local`. Jika `.env.local` sudah ada, jangan timpa konfigurasi yang telah kamu isi.
4. Isi `BETTER_AUTH_SECRET` dengan secret acak yang kuat dan pastikan `BETTER_AUTH_URL` sesuai URL lokal. Jangan commit `.env.local`.
5. Jalankan `bunx tsr generate`, `bun run lint`, `bun run typecheck`, `bun run build`, lalu `bun dev`.

Catatan: ZIP ini memperbaiki error sintaks JSX yang ditampilkan di terminal. Jalankan lint/typecheck/build di komputermu untuk memverifikasi semua pemeriksaan karena lingkungan dan versi dependency lokal bisa berbeda.
