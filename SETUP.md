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
4. Deploy Edge Function `submit-report` dengan Supabase CLI:

```bash
supabase functions deploy submit-report --no-verify-jwt
supabase functions deploy create-teacher
supabase functions deploy delete-report
```

5. Schema membuat bucket private `report-attachments`; Edge Function memvalidasi laporan dan mengunggah lampiran menggunakan service role di server.
6. Aktifkan Email/Password pada Authentication.

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

Sesi admin disimpan oleh Supabase Auth di browser sampai admin memilih **Keluar** atau sesi kedaluwarsa.

## 5. Guru BK dan settings

Setelah ketiga Edge Function aktif dan SMTP Supabase dikonfigurasi, tambah Guru BK melalui `/admin/guru-bk`. Admin dapat mengundang akun lewat email; service role hanya digunakan di function server. Penghapusan laporan juga memakai function server, termasuk membersihkan metadata dan file lampiran privat. Jangan memanggil `supabase.auth.admin.createUser()` dari browser. Nomor WhatsApp BK dan template pesan disimpan pada `site_settings`, bukan hardcode frontend.

## 6. Storage

Bucket `report-attachments` harus private. Form memanggil Edge Function `submit-report`; function memvalidasi field, MIME, ukuran, dan jumlah file sebelum menulis laporan, mengunggah objek, dan menyimpan metadata. Hanya service role di Edge Function yang melakukan operasi storage; frontend admin membuka file melalui signed URL, bukan public URL. Jangan menaruh `SUPABASE_SERVICE_ROLE_KEY` di Vercel `VITE_*` variables atau kode browser.

## 7. DataTables

Halaman `/admin/laporan` memakai DataTables Responsive dan Buttons. Search, sorting, pagination, page length, column visibility, Copy, CSV, Excel, PDF, dan Print tersedia dari toolbar tabel.

## 8. Deployment Vercel

Connect repository, gunakan build command `npm run build`, output `dist`, lalu isi environment variables yang sama di Vercel. Tambahkan rewrite SPA agar route `/lapor` dan `/admin/*` kembali ke `index.html`.

## 9. Troubleshooting

- **Login gagal:** cek provider Email/Password, email confirmation, dan URL/key env.
- **RLS error:** jalankan ulang schema, pastikan user authenticated, dan cek policy/grants.
- **Upload gagal:** pastikan Edge Function `submit-report` sudah dideploy, bucket private tersedia, serta secret bawaan Supabase Function aktif.
- **WhatsApp tidak terbuka:** cek nomor format internasional `62...` dan popup blocker.
- **Laporan tidak masuk:** periksa network request, required fields, dan policy INSERT anon.
- **Table kosong:** pastikan session authenticated dan policy SELECT admin aktif.
- **Storage denied:** cek bucket id `report-attachments` dan policy `storage.objects`.
- **Edge Function error:** cek logs function dan jangan pernah log service role key.
- **Undangan Guru BK gagal:** deploy function `create-teacher`, cek SMTP, dan pastikan pemanggil adalah admin aktif.
- **Hapus laporan gagal:** deploy function `delete-report` dan pastikan sesi admin masih aktif.
