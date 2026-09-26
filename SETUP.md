# Setup SI LABU

## 1. Install

```bash
npm install
npm run dev
```

## 2. Environment

Buat `.env` dari `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Jangan masukkan `service_role` key ke frontend.

## 3. Supabase

1. Buat project Supabase.
2. Buka SQL Editor.
3. Jalankan `supabase/schema.sql`, lalu `supabase/seed.sql`.
4. Schema membuat bucket private `report-attachments` dan policy admin.
5. Aktifkan Email/Password pada Authentication.

## 4. Admin pertama

1. Buka Supabase Dashboard > Authentication > Users > Add user.
2. Masukkan email dan password admin; konfirmasi email sesuai konfigurasi project.
3. Trigger schema membuat row `profiles` otomatis.
4. Di SQL Editor, jadikan user tersebut admin dengan mengganti UUID dan email berikut:

```sql
update public.profiles
set is_admin = true
where email = 'guru.bk@sman2medan.sch.id';
```

5. Buka `/admin/login` dan login.

User Auth baru bukan admin secara default. Hanya profile dengan `is_admin = true` yang dapat membaca laporan, settings, profile, activity log, dan file private.

Tanpa env Supabase, login tetap berjalan sebagai mode preview. Saat env tersedia, login memakai Supabase Auth, route admin memeriksa session, dan hanya profile dengan `is_admin = true` yang dapat masuk.

## 5. Guru BK dan settings

Setelah service admin aktif, tambah Guru BK melalui `/admin/guru-bk`. Jangan memanggil `supabase.auth.admin.createUser()` dari browser; gunakan Edge Function dengan service role di server. Nomor WhatsApp BK dan template pesan disimpan pada `site_settings`, bukan hardcode frontend.

## 6. Storage

Bucket `report-attachments` harus private. Public submission sebaiknya diproses melalui Edge Function atau signed upload flow yang memvalidasi MIME, ukuran, rate limit, dan path. Admin membuka file melalui signed URL, bukan public URL.

## 7. DataTables

Halaman `/admin/laporan` memakai DataTables Responsive dan Buttons. Search, sorting, pagination, page length, column visibility, Copy, CSV, Excel, PDF, dan Print tersedia dari toolbar tabel.

## 8. Deployment Vercel

Connect repository, gunakan build command `npm run build`, output `dist`, lalu isi environment variables yang sama di Vercel. Tambahkan rewrite SPA agar route `/lapor` dan `/admin/*` kembali ke `index.html`.

## 9. Troubleshooting

- **Login gagal:** cek provider Email/Password, email confirmation, dan URL/key env.
- **RLS error:** jalankan ulang schema, pastikan user authenticated, dan cek policy/grants.
- **Upload gagal:** pastikan bucket private ada, MIME/ukuran sesuai, dan signed upload flow digunakan.
- **WhatsApp tidak terbuka:** cek nomor format internasional `62...` dan popup blocker.
- **Laporan tidak masuk:** periksa network request, required fields, dan policy INSERT anon.
- **Table kosong:** pastikan session authenticated dan policy SELECT admin aktif.
- **Storage denied:** cek bucket id `report-attachments` dan policy `storage.objects`.
- **Edge Function error:** cek logs function dan jangan pernah log service role key.
