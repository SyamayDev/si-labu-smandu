# SI LABU

Sistem Laporan dan Konsultasi Perundungan SMA Negeri 2 Medan. Aplikasi React/Vite dengan alur pelaporan publik, portal Guru BK, utilitas WhatsApp, dan fondasi Supabase.

## Fitur

- Landing page publik mobile-first berbahasa Indonesia.
- Form laporan tanpa login dengan validasi, honeypot-ready boundary, dan bukti opsional image/video/audio.
- Success state dengan nomor laporan.
- Portal admin: dashboard, tabel laporan, detail, perubahan status, dan WhatsApp follow-up.
- Utility `normalizePhoneNumber`, `generateWhatsAppMessage`, dan `openWhatsApp`.
- SQL schema, RLS, private Storage bucket, activity log, settings, dan trigger profile.

## Menjalankan

```bash
npm install
npm run dev
```

Salin `.env.example` menjadi `.env` untuk mengaktifkan Supabase. Detail setup admin, SQL, storage, deployment, dan troubleshooting ada di [SETUP.md](SETUP.md).

## Struktur

- `src/App.jsx`: routes dan UI utama.
- `src/lib/`: Supabase client, validator, dan WhatsApp utility.
- `src/styles.css`: design system light-mode hijau sekolah.
- `supabase/schema.sql`: database, grants, RLS, trigger, dan Storage policies.
- `supabase/seed.sql`: pengaturan awal.

## Catatan keamanan

Publishable/anon key boleh berada di browser. Service role key tidak boleh dibuat di `.env` frontend atau dikirim ke client. Pembuatan user admin kedua harus memakai Edge Function/server-side endpoint; implementasi production perlu mengganti demo login dan demo rows dengan service layer Supabase.
