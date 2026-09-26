# SI LABU — MASTER PROMPT GITHUB COPILOT
## Sistem Laporan dan Konsultasi Perundungan — SMA Negeri 2 Medan

> **Tujuan:** Bangun ulang SI LABU dari website HTML/CSS/JS lama menjadi aplikasi web modern berbasis **React + Supabase**, dengan public reporting tanpa login, dashboard Guru BK/Admin, manajemen laporan, WhatsApp follow-up, attachment bukti termasuk audio upload, DataTables untuk rekap, dan CMS sederhana untuk pengaturan sistem.

---

# 1. INSTRUKSI UTAMA

Saya ingin kamu membangun **SI LABU — Sistem Laporan dan Konsultasi Perundungan SMA Negeri 2 Medan**.

Ini bukan sekadar mengubah HTML lama menjadi React.

Saya ingin kamu:

1. Audit project yang sudah ada terlebih dahulu.
2. Baca `package.json`.
3. Baca seluruh struktur `src/`.
4. Cari file HTML lama SI LABU/Ruang Aman Siswa jika tersedia.
5. Jadikan HTML lama sebagai referensi fitur dan copywriting, bukan sebagai desain final.
6. Jika ada konfigurasi Supabase yang sudah ada, pertahankan yang masih relevan.
7. Jangan menghapus file penting tanpa alasan.
8. Setelah audit, baru implementasikan sistem secara bertahap.
9. Jangan berhenti hanya karena aplikasi sudah bisa berjalan; polish UI, UX, accessibility, responsive behavior, loading state, error state, dan security.

Prinsip utama:

> **Simple functionality, sophisticated interface.**

SI LABU harus terasa seperti produk digital sekolah yang modern, matang, dan terpercaya — bukan template dashboard, bukan landing page SaaS generik, dan bukan AI slop.

---

# 2. REFERENSI VISUAL

Gunakan website resmi SMA Negeri 2 Medan sebagai referensi identitas:

`https://www.sman2medan.sch.id/`

Gunakan sebagai referensi untuk:

- identitas sekolah
- nuansa hijau
- logo jika tersedia
- karakter visual sekolah
- tone yang formal tetapi tetap ramah
- elemen visual yang relevan

JANGAN menyalin keseluruhan layout website resmi.

Ambil identitas visualnya, lalu buat produk SI LABU yang jauh lebih modern.

Referensi modern lain:

`https://syamaydev.github.io/react-sistemrekomendendasijurusan/`

Gunakan sebagai referensi untuk:

- responsive layout
- clean spacing
- mobile friendliness
- simple navigation
- modern composition
- visual hierarchy

Untuk eksplorasi landing page modern/interaktif:

`https://threeui.com/landing-pages`

Gunakan ThreeUI hanya sebagai inspirasi untuk:

- composition
- motion
- typography
- scroll interaction
- subtle visual effects
- modern visual storytelling

JANGAN menjadikan SI LABU seperti website agency/creative studio.

---

# 3. PRINSIP DESIGN — WAJIB

## Visual direction

Gunakan hanya:

- Light mode
- tema hijau SMA Negeri 2 Medan
- off-white/white
- neutral gray
- deep green
- soft green

JANGAN membuat dark mode.

JANGAN membuat theme switcher.

## Hindari AI slop

Jangan membuat:

- glassmorphism berlebihan
- gradient di hampir semua section
- neon green
- purple/blue SaaS gradient
- random 3D blobs
- robot AI
- glowing orb
- floating cards tanpa alasan
- terlalu banyak border glow
- terlalu banyak rounded cards
- terlalu banyak emoji
- terlalu banyak icon
- dashboard dengan belasan kartu statistik
- animasi pada setiap elemen
- testimonial palsu
- angka/statistik palsu
- fitur yang dibuat hanya supaya terlihat kompleks

Gunakan:

- typography
- whitespace
- grid
- hierarchy
- alignment
- clean border
- subtle shadow
- restrained motion
- strong CTA

Rounded corner boleh digunakan, tetapi jangan membuat setiap elemen memiliki radius besar yang sama.

---

# 4. MASKOT SI LABU

Saya SUDAH MEMILIKI MASKOT SI LABU.

Maskot yang saya miliki adalah karakter **kura-kura/superhero berwarna hijau dengan aksen oranye**, memakai helm/shell dan memiliki identitas visual yang kuat.

Jangan membuat maskot baru dengan AI.

Gunakan maskot saya sebagai aset resmi SI LABU.

Jika file gambar belum ada di project, minta saya menaruhnya di salah satu lokasi berikut:

`src/assets/mascot/mascot.png`

atau

`public/assets/mascot/mascot.png`

Utamakan file PNG transparan.

## Variasi aset maskot yang ideal untuk project

Saya hanya memiliki satu maskot utama sekarang. Rencanakan struktur asset agar nantinya saya bisa menambahkan beberapa variasi.

Variasi yang paling berguna:

1. **Mascot Main**
   - pose berdiri
   - digunakan di hero

2. **Mascot Greeting**
   - tangan melambai / pose ramah
   - digunakan di success state atau bagian pengantar

3. **Mascot Pointing**
   - menunjuk ke CTA
   - cocok untuk tombol "Lapor Bully!"

4. **Mascot Thinking**
   - pose sedang berpikir
   - optional, untuk empty state

5. **Mascot Supportive**
   - pose tenang / memberi dukungan
   - untuk halaman laporan atau privacy section

6. **Mascot Success**
   - pose merayakan secara sederhana
   - untuk laporan berhasil dikirim

7. **Mascot Small**
   - versi kecil / bust / head only
   - untuk avatar, footer, atau UI kecil

## Jangan memaksa semua variasi dibuat sekarang

Untuk versi pertama cukup gunakan:

- maskot utama
- maskot greeting/success jika tersedia

Struktur kode harus siap menerima variasi lain nantinya.

Jangan mengubah maskot menjadi elemen dekorasi di setiap section.

Gunakan secara strategis.

---

# 5. STACK

Gunakan:

- React
- Vite
- JavaScript atau TypeScript sesuai project yang ada
- React Router
- Tailwind CSS atau styling system yang sudah digunakan project
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions jika diperlukan
- Motion for React
- Lucide React
- DataTables React
- DataTables Responsive
- DataTables Buttons

Jangan menambahkan library hanya untuk terlihat modern.

Jika project existing sudah memiliki stack tertentu yang sehat, pertahankan selama tidak bertentangan dengan requirement.

---

# 6. MOTION / FRAMER MOTION

Gunakan **Motion for React**.

Catatan: library modernnya sekarang adalah package `motion`, dengan import:

```js
import { motion, AnimatePresence } from "motion/react";
```

Gunakan motion untuk:

- hero entrance
- staggered reveal
- subtle section reveal
- CTA hover/press
- modal
- drawer
- toast
- report detail transition
- success state
- upload feedback
- admin page transitions

Jangan menganimasikan semuanya.

Gunakan:

- short duration
- natural easing
- subtle movement
- opacity + transform
- layout transitions jika memang membantu

Dukung `prefers-reduced-motion`.

Jangan menggunakan motion hanya sebagai gimmick.

---

# 7. ROLE SYSTEM

HANYA ADA SATU ROLE LOGIN:

> `admin`

Admin = Guru BK.

Tidak ada:

- super_admin
- editor
- moderator
- member
- student account

Semua Guru BK mempunyai hak admin yang sama.

Admin dapat:

- melihat laporan
- melihat detail laporan
- menangani laporan
- menghubungi siswa melalui WhatsApp
- mengubah status
- melihat attachment
- mengelola Guru BK lain
- menambahkan Guru BK
- mengedit informasi dirinya sendiri
- mengubah pengaturan sistem
- mengatur template pesan WhatsApp
- mengelola informasi kontak BK

---

# 8. PELAPOR TIDAK PERLU LOGIN

WAJIB.

Siswa/pelapor:

- tidak login
- tidak register
- tidak memiliki password
- tidak memiliki dashboard
- tidak memiliki akun

Flow:

```text
Landing Page
    ↓
Lapor Bully!
    ↓
Form Laporan
    ↓
Isi Data
    ↓
Upload Bukti (Opsional)
    ↓
Submit
    ↓
Laporan Tersimpan
    ↓
Success Screen
```

Jangan membuat alur pelaporan rumit.

---

# 9. PUBLIC NAVIGATION

Public website jangan mempunyai navbar yang penuh.

Gunakan navigasi minimal:

- Logo SI LABU
- Beranda
- Cara Kerja
- Tentang
- CTA `Lapor Bully!`

Pada mobile:

gunakan menu drawer sederhana.

Tidak perlu bottom navigation.

Tidak perlu puluhan menu.

---

# 10. PUBLIC LANDING PAGE

Struktur:

1. Header
2. Hero
3. Intro / purpose
4. Cara kerja
5. Hal yang dapat dilaporkan
6. Privacy / trust
7. CTA
8. Footer

Tidak perlu:

- blog
- artikel
- quiz
- testimonial
- pricing
- CMS artikel
- fitur edukasi yang terlalu besar

Fokus pada satu tujuan utama:

> **Membantu siswa menyampaikan laporan kepada Guru BK dengan mudah.**

---

# 11. HERO

Hero harus menjadi bagian paling kuat secara visual.

Copy dapat dikembangkan, misalnya:

> **Berani Bicara. Kami Siap Mendengar.**

Subheadline:

> SI LABU membantu siswa SMA Negeri 2 Medan menyampaikan laporan terkait perundungan kepada Guru BK dengan mudah dan aman.

CTA utama:

`Lapor Bully!`

CTA kedua:

`Cara Kerja`

Gunakan maskot pada hero secara strategis.

Contoh:

- maskot di sisi kanan
- maskot sedikit overlap dengan composition
- subtle entrance animation

Jangan membuat mascot memenuhi seluruh layar.

---

# 12. THREE.JS / 3D

Three.js TIDAK WAJIB.

Boleh digunakan hanya jika benar-benar meningkatkan UX.

Jika menggunakan:

- subtle
- ringan
- tidak mengganggu mascot
- tidak mengganggu readability
- tidak membuat mobile berat

Contoh yang diperbolehkan:

- soft particle field
- subtle floating geometry
- abstract green structure

Jangan:

- crypto-like 3D
- glowing sphere
- AI brain
- futuristic cyberpunk

Jika tidak perlu Three.js, jangan dipaksakan.

---

# 13. CARA KERJA

Tampilkan sederhana:

### 01 — Ceritakan
Isi laporan sesuai kejadian.

### 02 — Kirim
Laporan diterima Guru BK.

### 03 — Ditangani
Guru BK menghubungi pelapor melalui WhatsApp.

### 04 — Selesai
Ketika penanganan sudah dianggap selesai, status diperbarui.

Gunakan visual timeline/steps yang clean.

---

# 14. JENIS PERUNDUNGAN

Kategori:

- Verbal
- Fisik
- Sosial / Pengucilan
- Intimidasi
- Cyberbullying
- Lainnya

Boleh memilih lebih dari satu.

Jangan menggunakan istilah atau kategori yang terlalu banyak.

---

# 15. PUBLIC REPORT FORM

Route:

`/lapor`

Form harus mobile-first.

## Identitas

- Nama lengkap *
- Kelas *
- Nomor WhatsApp *
- Status pelapor *
  - Korban
  - Saksi

## Kejadian

- Jenis perundungan *
- Tanggal kejadian *
- Waktu kejadian *
- Lokasi kejadian *
- Apakah kejadian masih berlangsung? *
  - Ya
  - Tidak

## Kronologi

- Ceritakan kejadian *

Tambahkan character counter.

## Bukti

Label:

> Lampiran bukti (opsional)

Penjelasan:

> Tidak masalah jika kamu tidak memiliki bukti. Kamu tetap dapat mengirimkan laporan.

---

# 16. BUKTI — TIDAK WAJIB

Bukti harus benar-benar opsional.

Jangan memblokir submit ketika tidak ada attachment.

File yang dapat diterima:

- JPG
- JPEG
- PNG
- WEBP
- MP4
- MOV
- MP3
- WAV
- M4A
- OGG

Tidak perlu perekaman suara browser.

## PENTING

Jangan buat:

- microphone recorder
- MediaRecorder
- tombol rekam suara
- live audio recording

Yang dibutuhkan hanya:

> **Upload file audio yang sudah dimiliki siswa.**

Setelah upload, siswa/admin dapat melihat:

- nama file
- ukuran file
- audio player

Audio cukup bisa:

- play
- pause
- seek

Tidak perlu fitur editing audio.

---

# 17. FILE ATTACHMENT

Gunakan Supabase Storage.

Bucket:

`report-attachments`

Metadata:

- id
- report_id
- file_name
- file_path
- mime_type
- file_size
- created_at

Gunakan bucket private.

Jangan menggunakan public file URL jika tidak diperlukan.

Admin yang terautentikasi dapat membuka attachment melalui akses yang aman.

---

# 18. REPORT SUBMISSION

Ketika siswa menekan:

`Lapor Sekarang`

Tampilkan loading state.

Cegah double submission.

Setelah berhasil:

success page:

> **Laporan berhasil diterima.**

> Terima kasih sudah berani menyampaikan ceritamu. Guru BK akan menindaklanjuti laporan yang kamu kirimkan.

Tampilkan:

- nomor laporan
- tanggal laporan
- tombol kembali ke beranda

Jangan otomatis membuka WhatsApp siswa.

---

# 19. REPORT CODE

Setiap laporan memiliki kode yang mudah dibaca:

```text
LABU-2026-0001
LABU-2026-0002
LABU-2026-0003
```

UUID tetap digunakan sebagai database primary key.

`report_code` digunakan untuk UI manusia.

---

# 20. STATUS

Jangan menggunakan urgency/priority.

Jangan membuat banyak status.

Gunakan hanya:

```text
Baru
Ditangani
Selesai
```

Default:

`Baru`

Ketika Guru BK mulai menangani:

`Ditangani`

Ketika masalah dianggap sudah tertangani:

`Selesai`

---

# 21. ADMIN DASHBOARD

Route:

`/admin`

Harus membutuhkan login.

Layout:

- sidebar desktop
- topbar
- mobile drawer
- content area

Menu:

```text
Dashboard
Laporan
Guru BK
Pengaturan
```

Bagian user/profile:

```text
Profil
Logout
```

Jangan membuat sidebar terlalu ramai.

---

# 22. DASHBOARD

Statistik ringkas:

- Total Laporan
- Baru
- Ditangani
- Selesai

Kemudian:

`Laporan Terbaru`

Tampilkan beberapa laporan terbaru.

Boleh ada satu visual sederhana seperti:

- status distribution
- report count over time

Jangan membuat dashboard penuh grafik.

---

# 23. DATA TABLES — WAJIB

Gunakan **DataTables React** untuk halaman laporan.

Gunakan:

- DataTables React
- Responsive
- Buttons

Features:

- search
- sorting
- pagination
- responsive
- column visibility
- export
- print
- filter
- page length

Export:

- Excel
- CSV
- PDF
- Print
- Copy

Jika diperlukan gunakan:

- JSZip untuk Excel
- pdfmake untuk PDF

Jangan menggunakan table custom sebagai pengganti DataTables.

---

# 24. FILTER LAPORAN

Filter:

- Status
- Jenis perundungan
- Status pelapor
- Kelas
- Tanggal / periode
- Lokasi jika diperlukan

Search:

```text
Cari nama, nomor laporan, kelas...
```

Tambahkan:

`Reset Filter`

Pastikan filter terlihat compact.

---

# 25. KOLOM TABLE

Minimal:

| Kolom |
|---|
| No |
| ID Laporan |
| Pelapor |
| Kelas |
| Jenis |
| Tanggal |
| Status |
| Dibuat |
| Aksi |

Action utama:

`Detail`

Jangan menaruh 5-10 tombol di setiap row.

---

# 26. REPORT DETAIL

Ketika admin memilih laporan:

Tampilkan page/drawer detail.

Sections:

### Header

- report code
- status
- created_at

### Identitas

- nama
- kelas
- nomor WhatsApp
- korban/saksi

### Kejadian

- jenis
- tanggal
- waktu
- lokasi
- ongoing

### Kronologi

- description

### Lampiran

- image preview
- video player
- audio player
- file download

Jangan autoplay audio/video.

---

# 27. TOMBOL TANGANI VIA WHATSAPP

Ini adalah fitur inti.

Tombol:

> **Tangani via WhatsApp**

Ketika ditekan:

1. Generate pesan berdasarkan laporan.
2. Gunakan nomor WhatsApp pelapor.
3. Buka WhatsApp dengan pesan siap kirim.
4. Catat aktivitas jika memungkinkan.
5. Jangan otomatis menjadikan laporan selesai.

Status dapat berubah menjadi:

`Ditangani`

setelah admin menekan tindakan yang sesuai.

---

# 28. TEMPLATE PESAN WHATSAPP

Pesan WhatsApp TIDAK boleh hardcode permanen.

Harus dapat diatur melalui:

`Admin → Pengaturan → Template Pesan`

Default template misalnya:

```text
Halo {{nama}},

Saya Guru BK SMA Negeri 2 Medan.

Kami sudah menerima laporan yang kamu sampaikan melalui SI LABU terkait {{jenis}} pada {{tanggal}} di {{lokasi}}.

Kami ingin menindaklanjuti laporan tersebut dan berdiskusi lebih lanjut dengan kamu.

Silakan membalas pesan ini agar kita dapat melanjutkan komunikasi dan menentukan waktu yang nyaman untuk berbicara.

Terima kasih sudah berani menyampaikan ceritamu melalui SI LABU.

Salam,
Guru BK SMA Negeri 2 Medan
```

Template harus editable.

Admin dapat mengubah isi template tanpa mengubah source code.

Sediakan variable yang tersedia:

```text
{{nama}}
{{kelas}}
{{nomor_laporan}}
{{jenis}}
{{tanggal}}
{{lokasi}}
{{status}}
```

Beri preview sebelum menyimpan template jika memungkinkan.

Buat utility:

```js
generateWhatsAppMessage(report, template)
```

---

# 29. JADWAL KONSULTASI

JANGAN buat appointment booking system.

Tidak perlu:

- kalender booking
- slot availability
- appointment form
- jadwal online
- reminder system

Alurnya cukup:

```text
Laporan
↓
Guru BK
↓
WhatsApp
↓
Konsultasi / penanganan lanjutan
```

---

# 30. STATUS SELESAI

Admin dapat mengubah:

`Ditangani → Selesai`

Tampilkan confirmation modal:

> Apakah laporan ini sudah selesai ditindaklanjuti?

Button:

- Belum
- Selesaikan Laporan

Catat:

- resolved_at
- resolved_by

---

# 31. ACTIVITY LOG

Buat:

`report_activity_logs`

Contoh:

```text
Laporan dibuat
Status menjadi Ditangani
Admin menghubungi pelapor
Status menjadi Selesai
```

Fields:

- id
- report_id
- admin_id
- action
- metadata
- created_at

Gunakan sebagai audit trail.

---

# 32. GURU BK MANAGEMENT

Semua admin = Guru BK.

Halaman:

`/admin/guru-bk`

Table:

- Nama
- Email
- Nomor WhatsApp
- Status
- Dibuat
- Aksi

Admin dapat:

- tambah Guru BK
- edit Guru BK
- nonaktifkan akun jika diperlukan
- melihat detail
- mengedit informasi dirinya sendiri

Tidak ada hierarchy.

---

# 33. TAMBAH GURU BK

Form:

- Nama
- Email
- Password awal
- Nomor WhatsApp

Password:

JANGAN disimpan di `profiles`.

Gunakan Supabase Auth.

Jika perlu memakai:

`supabase.auth.admin.createUser()`

fungsi admin Auth harus dijalankan server-side / Edge Function.

Jangan pernah mengirim service role key ke frontend.

---

# 34. PROFILE ADMIN

Admin dapat mengedit:

- nama
- nomor WhatsApp
- foto/avatar jika digunakan

Email boleh read-only jika dikelola oleh Auth.

Sediakan:

`Ubah Password`

Gunakan Supabase Auth password update / recovery flow sesuai konteks.

---

# 35. PENGATURAN

Route:

`/admin/pengaturan`

Section:

## Informasi Sekolah

- Nama sekolah
- Logo
- tagline
- alamat
- email
- nomor telepon

## Kontak BK

- Nama layanan
- Nomor WhatsApp BK
- Email BK
- jam layanan jika dibutuhkan

## SI LABU

- judul
- subtitle
- deskripsi singkat
- success message

## WhatsApp

- template pesan
- variable yang tersedia
- preview

Nomor WA harus berasal dari database.

Jangan hardcode nomor WA di frontend.

---

# 36. DATABASE

Gunakan Supabase PostgreSQL.

Minimal:

```text
profiles
reports
report_attachments
report_activity_logs
site_settings
```

Jika membutuhkan tabel tambahan untuk sistem yang lebih bersih, boleh membuatnya.

---

# 37. PROFILES

Contoh:

```text
profiles
---------
id UUID PK → auth.users.id
full_name
email
phone
avatar_url
created_at
updated_at
```

Tidak menyimpan password.

Jangan membuat custom password field.

---

# 38. REPORTS

Minimal:

```text
id UUID PK
report_code
reporter_name
reporter_class
reporter_phone
reporter_status
incident_types
incident_date
incident_time
incident_location
description
is_ongoing
status
created_at
updated_at
handled_at
handled_by
resolved_at
resolved_by
```

Jangan menyimpan lebih banyak data pribadi dari yang diperlukan.

---

# 39. ATTACHMENTS

```text
report_attachments
-------------------
id
report_id
file_name
file_path
mime_type
file_size
created_at
uploaded_by nullable
```

Public submission boleh memiliki `uploaded_by = null`.

---

# 40. SETTINGS

Gunakan struktur yang rapi.

Contoh:

```text
site_settings
-------------
id
key
value
updated_at
updated_by
```

atau JSONB bila memang lebih tepat.

Jangan menyimpan secret.

---

# 41. SECURITY / RLS

WAJIB menggunakan RLS.

Public / unauthenticated:

Boleh:

- INSERT report
- upload attachment melalui mekanisme yang aman

Tidak boleh:

- SELECT reports
- UPDATE reports
- DELETE reports
- melihat attachment orang lain
- membaca profiles
- membaca activity logs
- membaca admin settings sensitif

Admin authenticated:

Boleh mengelola data yang diperlukan.

Gunakan:

```sql
auth.uid()
```

dan role:

```text
anon
authenticated
```

Jangan menggunakan:

```sql
OLD
NEW
```

di dalam RLS policy.

`OLD` dan `NEW` hanya digunakan pada trigger context.

Hindari recursive RLS.

Jangan membuat helper function yang membaca tabel yang sedang diproteksi lalu memicu policy recursion.

Supabase juga mensyaratkan bukan hanya policy tetapi grants yang tepat untuk setiap role. Periksa grants dan policies bersama-sama.

---

# 42. PUBLIC INSERT SECURITY

Karena public boleh submit tanpa login:

Jangan hanya mengandalkan frontend validation.

Gunakan:

- required validation
- max length
- MIME validation
- file size validation
- rate limiting / cooldown
- honeypot
- duplicate submission protection
- server-side validation jika memungkinkan

Jangan memberikan SELECT public ke laporan.

---

# 43. ATTACHMENT SECURITY

Gunakan private bucket:

```text
report-attachments
```

Gunakan Storage RLS.

Public upload hanya melalui jalur yang dirancang untuk submission.

Admin dapat membaca attachment.

Jangan expose service role.

---

# 44. ANTI SPAM

Tambahkan minimal:

- honeypot field
- cooldown/rate limit
- max payload
- file size limit
- server-side validation

Tidak wajib CAPTCHA pada versi awal.

---

# 45. AUTH

Admin route:

```text
/admin/login
```

Gunakan Supabase Auth email/password.

Flow:

```text
/admin/login
↓
Supabase Auth
↓
authenticated
↓
/admin
```

Jika belum login:

`/admin/*` → `/admin/login`

Jika sudah login dan membuka login:

`/admin/login` → `/admin`

Sediakan logout.

---

# 46. ADMIN LOGIN

Tampilan:

- Logo SI LABU
- SMA Negeri 2 Medan
- Email
- Password
- Show/hide password
- Login
- Error state

Boleh tambahkan reset password/recovery jika implementasinya diperlukan.

Jangan membuat login page berlebihan.

---

# 47. DATA EXPORT

Gunakan DataTables Buttons.

Sediakan:

- Copy
- CSV
- Excel XLSX
- PDF
- Print
- Column visibility
- Page length bila cocok

Gunakan nama file yang jelas, misalnya:

```text
SI-LABU-Rekap-Laporan-2026-09.xlsx
SI-LABU-Rekap-Laporan-2026-09.pdf
```

Jika filter aktif, export harus mengikuti data yang sedang difilter bila implementasinya memungkinkan.

DataTables Buttons memang menyediakan export Excel, CSV, PDF, print, dan column visibility; Excel membutuhkan JSZip dan PDF membutuhkan pdfmake.

---

# 48. EMPTY / ERROR / LOADING STATE

Jangan menggunakan browser `alert()` sebagai UX utama.

Gunakan:

- toast
- inline error
- modal
- skeleton
- empty state

Contoh error:

> Gagal mengirim laporan. Periksa koneksi internet lalu coba lagi.

Contoh empty:

> Belum ada laporan yang sesuai dengan filter.

---

# 49. ACCESSIBILITY

Perhatikan:

- semantic HTML
- labels
- focus states
- keyboard navigation
- ARIA
- color contrast
- clear status labels
- reduced motion
- accessible modal
- accessible file upload
- accessible audio player

Status tidak boleh dibedakan dengan warna saja.

---

# 50. RESPONSIVE

Public:

mobile-first.

Admin:

desktop dashboard + mobile responsive.

Mobile report form harus sangat nyaman.

Admin table harus tetap usable pada mobile.

Gunakan DataTables Responsive.

Jika perlu gunakan responsive child row/details.

---

# 51. ICON SYSTEM

Gunakan Lucide React.

Contoh:

- ShieldCheck
- FileWarning
- MessageCircle
- Phone
- Upload
- MicOff
- CheckCircle
- Clock
- Users
- Settings
- Search
- Filter
- Download
- LogOut

Catatan:
Karena TIDAK ada recording suara, jangan gunakan icon microphone sebagai tombol rekam.

Icon microphone hanya boleh digunakan jika konteksnya benar-benar terkait audio upload.

Jangan menggunakan emoji sebagai UI icon utama.

---

# 52. COPYWRITING

Bahasa:

Indonesia.

Tone:

- tenang
- empatik
- sederhana
- tidak menghakimi
- tidak terlalu formal
- tidak terlalu kekanak-kanakan

Hindari copy generik seperti:

"Revolutionize your experience."

Gunakan copy yang terasa ditulis untuk siswa SMA Negeri 2 Medan.

---

# 53. URL ROUTES

Public:

```text
/
 /lapor
 /tentang
```

Admin:

```text
/admin/login
/admin
/admin/laporan
/admin/laporan/:id
/admin/guru-bk
/admin/pengaturan
/admin/profil
```

Sesuaikan jika arsitektur routing yang sudah ada lebih baik.

---

# 54. SERVICE ARCHITECTURE

Pisahkan query Supabase dari UI.

Contoh:

```text
services/
  reportService
  adminService
  settingsService
  storageService
```

Utility:

```text
lib/
  supabase
  whatsapp
  validators
  formatters
```

---

# 55. WHATSAPP UTILITY

Buat:

```text
normalizePhoneNumber()
generateWhatsAppMessage()
openWhatsApp()
```

Jangan membuat URL WhatsApp manual di banyak component.

Normalize nomor:

```text
081234567890
```

menjadi:

```text
6281234567890
```

Simpan format konsisten.

---

# 56. AUDIO ATTACHMENT UX

Pada form laporan:

```text
Lampiran bukti (opsional)

[ Pilih File ]
```

Supported:

- image
- video
- audio

Jika audio dipilih:

Tampilkan:

```text
voice-note.mp3
1.8 MB

[ ▶ Play ]
```

Tidak ada fitur rekam.

Admin pada detail laporan juga mendapat audio player.

Jangan autoplay.

---

# 57. DESIGN SYSTEM

Buat reusable components:

```text
Button
Input
Textarea
Select
Checkbox
Radio
Badge
Modal
Drawer
Toast
Card
FileUpload
AudioPlayer
StatusBadge
DataTable
EmptyState
Skeleton
```

Jangan duplicate UI logic.

---

# 58. MOBILE PUBLIC UX

Pada mobile:

- hero ringkas
- mascot tetap terlihat tetapi tidak menutupi CTA
- CTA "Lapor Bully!" mudah ditemukan
- form satu kolom
- file upload mudah digunakan
- success state jelas

Tidak perlu bottom nav.

---

# 59. MOBILE ADMIN UX

Sidebar menjadi drawer.

Topbar:

- hamburger
- title
- profile menu

Report detail full width.

CTA:

`Tangani via WhatsApp`

harus mudah dijangkau.

---

# 60. PERFORMANCE

Landing page harus ringan.

Jika menggunakan Three.js:

- lazy load
- dynamic import
- jangan load jika tidak diperlukan
- simplify mobile
- respect reduced motion

Gunakan image optimization untuk mascot.

Gunakan WebP/AVIF jika tersedia.

Jangan memasukkan asset besar tanpa alasan.

---

# 61. SEO

Tambahkan:

- title
- meta description
- favicon
- theme-color
- Open Graph basics

Title:

```text
SI LABU — Sistem Laporan dan Konsultasi Perundungan | SMA Negeri 2 Medan
```

---

# 62. SQL FILE — WAJIB

Copilot HARUS membuat file SQL yang lengkap dan siap dimasukkan ke Supabase.

Minimal:

```text
supabase/
  schema.sql
  seed.sql
  migrations/
```

Jika menggunakan migration-first architecture, tetap sediakan dokumentasi yang menjelaskan urutan eksekusinya.

`schema.sql` harus mencakup:

- table creation
- enum/type jika digunakan
- indexes
- foreign keys
- timestamps
- triggers
- functions yang aman
- RLS enable
- grants
- RLS policies
- storage policies jika relevan

Jangan membuat SQL policy yang mengandung `OLD` atau `NEW`.

Pastikan script idempotent jika memungkinkan:

```sql
create table if not exists ...
```

dan gunakan pola yang aman untuk rerun.

---

# 63. ADMIN FIRST SETUP — WAJIB

Copilot HARUS membuat file:

```text
SETUP.md
```

atau:

```text
docs/SETUP.md
```

File ini HARUS menjelaskan dari nol bagaimana menjalankan aplikasi.

Minimal:

## Step 1 — Install

```bash
npm install
```

## Step 2 — Environment

Buat:

```text
.env
```

dengan:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Jika project menggunakan legacy key:

```env
VITE_SUPABASE_ANON_KEY=
```

Jangan masukkan service role key ke frontend.

## Step 3 — Supabase Project

Jelaskan:

1. Buat project Supabase.
2. Buka SQL Editor.
3. Jalankan `supabase/schema.sql`.
4. Jalankan `supabase/seed.sql`.
5. Buat bucket yang diperlukan jika SQL tidak membuatnya secara otomatis.
6. Pastikan Auth email/password aktif.

## Step 4 — Buat Admin Pertama

Jelaskan bahwa akun admin dibuat melalui Supabase Authentication.

Jangan menyimpan password di `profiles`.

Contoh:

1. Buka Supabase Dashboard.
2. Authentication.
3. Users.
4. Add user.
5. Masukkan email.
6. Masukkan password.
7. Jika ada opsi confirm email sesuai konfigurasi project, jelaskan apa yang harus dilakukan.
8. Setelah user dibuat, jalankan langkah SQL yang diperlukan untuk membuat/menyinkronkan profile jika memang schema membutuhkannya.

Jika project menggunakan Edge Function untuk membuat user, dokumentasikan flow tersebut.

## Step 5 — Login

Buka:

```text
/admin/login
```

login menggunakan email/password admin yang tadi dibuat.

## Step 6 — Tambah Guru BK

Jelaskan bagaimana admin pertama menambahkan Guru BK lain melalui:

```text
Admin → Guru BK → Tambah Guru BK
```

Jika proses ini memakai Edge Function, dokumentasikan.

## Step 7 — Settings

Jelaskan bagaimana:

- mengganti nomor WhatsApp BK
- mengubah template pesan
- mengubah informasi sekolah
- mengubah profil admin

## Step 8 — Storage

Jelaskan:

- nama bucket
- private/public
- policy
- cara memeriksa upload

## Step 9 — Deployment

Jelaskan Vercel:

- connect GitHub
- set build command
- set environment variables
- deploy

## Step 10 — Troubleshooting

Tambahkan troubleshooting untuk:

- login gagal
- RLS error
- upload gagal
- WhatsApp tidak terbuka
- report tidak masuk
- table kosong
- storage denied
- Edge Function error

---

# 64. ADMIN CREATION SECURITY

Jika admin kedua/ketiga dibuat dari dashboard:

JANGAN panggil:

```js
supabase.auth.admin.createUser()
```

langsung dari browser jika itu membutuhkan service role key.

Gunakan:

- Supabase Edge Function
- atau secure server-side endpoint

Service role key harus tetap server-side.

---

# 65. SUPABASE EDGE FUNCTIONS

Gunakan Edge Functions hanya jika dibutuhkan untuk:

- membuat Admin/Guru BK
- privileged Auth actions
- secure public report processing jika diperlukan
- server-side operations yang membutuhkan service role

Jangan menggunakan Edge Function untuk semua hal secara berlebihan.

---

# 66. ENV

Buat:

```text
.env.example
```

Contoh:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Jangan pernah commit:

```text
service_role
secret
private key
```

---

# 67. README

Buat atau update:

```text
README.md
```

Harus menjelaskan:

- overview
- stack
- features
- project structure
- local setup
- env
- Supabase setup
- SQL setup
- Storage setup
- Auth setup
- first admin setup
- adding Guru BK
- deployment
- security notes

README jangan terlalu panjang jika `SETUP.md` sudah menangani setup detail.

---

# 68. TESTING CHECKLIST

## Public

- [ ] Landing page
- [ ] Mobile landing
- [ ] Lapor Bully CTA
- [ ] Form validation
- [ ] Submit report
- [ ] No attachment
- [ ] Image upload
- [ ] Video upload
- [ ] Audio upload
- [ ] Audio playback
- [ ] Multiple incident types
- [ ] Success state
- [ ] Prevent double submission

## Admin

- [ ] Login
- [ ] Logout
- [ ] Protected route
- [ ] Dashboard
- [ ] DataTables
- [ ] Search
- [ ] Filter
- [ ] Sort
- [ ] Pagination
- [ ] Responsive
- [ ] Excel
- [ ] CSV
- [ ] PDF
- [ ] Print
- [ ] Detail report
- [ ] Attachment preview
- [ ] Audio player
- [ ] WhatsApp button
- [ ] Status update
- [ ] Guru BK CRUD
- [ ] Profile
- [ ] Settings
- [ ] WhatsApp template editor

## Security

- [ ] Public cannot SELECT reports
- [ ] Public cannot UPDATE reports
- [ ] Public cannot DELETE reports
- [ ] Public cannot access private attachments
- [ ] Admin can access authorized data
- [ ] Service role not exposed
- [ ] Password not stored in profiles
- [ ] No recursive RLS
- [ ] No OLD/NEW in RLS
- [ ] Storage RLS works
- [ ] Admin routes protected

---

# 69. IMPORTANT EXISTING HTML RULE

Jika file HTML lama SI LABU ada di project:

Baca dan pertahankan informasi yang masih berguna.

HTML lama memiliki konsep:

- edukasi
- panduan
- konsultasi
- report form
- status korban/saksi
- jenis kejadian
- waktu
- lokasi
- kronologi
- ongoing status
- optional contact
- WhatsApp message generation

Tetapi jangan mempertahankan desain lama secara mentah.

Buat ulang UX dari awal.

---

# 70. FINAL UX GOAL

Pertanyaan yang harus selalu dipakai selama implementasi:

### Dari sisi siswa:

> "Kalau saya sedang mengalami masalah, apakah saya tahu dalam beberapa detik tombol mana yang harus saya tekan?"

Jawabannya harus:

> Ya — `Lapor Bully!`

### Dari sisi Guru BK:

> "Kalau laporan masuk, apakah saya langsung memahami kasusnya dan tahu apa tindakan selanjutnya?"

Jawabannya harus:

> Ya — buka detail → pahami laporan → Tangani via WhatsApp → ubah status.

---

# 71. FINAL QUALITY BAR

Hasil akhir harus:

- modern
- clean
- premium
- human
- school-appropriate
- mobile-friendly
- accessible
- performant
- secure
- maintainable

Tetapi:

> **Jangan membuat aplikasi menjadi kompleks hanya untuk terlihat modern.**

Modernitas harus terasa dari:

- kualitas spacing
- typography
- interaction
- responsiveness
- motion
- clarity
- information architecture

bukan dari jumlah fitur.

---

# 72. IMPLEMENTATION ORDER

Kerjakan dalam urutan berikut:

### PHASE 1
Audit project dan HTML lama.

### PHASE 2
Buat design system.

### PHASE 3
Setup React routing dan layout.

### PHASE 4
Build public landing page.

### PHASE 5
Build public report form.

### PHASE 6
Build Supabase schema + SQL.

### PHASE 7
Build RLS + Storage.

### PHASE 8
Build Auth admin.

### PHASE 9
Build admin dashboard.

### PHASE 10
Build DataTables.

### PHASE 11
Build report detail.

### PHASE 12
Build WhatsApp integration.

### PHASE 13
Build Guru BK management.

### PHASE 14
Build Settings + template editor.

### PHASE 15
Responsive polish.

### PHASE 16
Accessibility + security audit.

### PHASE 17
Testing.

### PHASE 18
Documentation.

---

# 73. FINAL OUTPUT YANG HARUS DIBUAT

Pada akhir implementasi, pastikan project memiliki minimal:

```text
README.md
SETUP.md
.env.example

supabase/
  schema.sql
  seed.sql
  migrations/
  functions/

src/
  components/
  pages/
  layouts/
  services/
  hooks/
  lib/
  assets/
```

Jangan mengklaim selesai jika:

- SQL belum dibuat
- setup admin pertama belum didokumentasikan
- RLS belum dibuat
- storage belum dikonfigurasi
- DataTables belum berfungsi
- export belum berfungsi
- WhatsApp belum berfungsi
- mobile layout belum dipoles

---

# 74. IMPORTANT FINAL INSTRUCTION

**START BY AUDITING THE EXISTING PROJECT AND FILES BEFORE WRITING CODE.**

Jangan langsung overwrite project.

Setelah audit:

1. jelaskan struktur existing secara singkat,
2. identifikasi apa yang dapat digunakan kembali,
3. identifikasi apa yang perlu dibuat ulang,
4. baru implementasikan.

Prioritaskan:

1. UX
2. security
3. clarity
4. maintainability
5. responsiveness
6. visual polish
7. motion
8. advanced effects

Jika harus memilih:

> **fitur lebih banyak**

atau

> **UX lebih baik**

pilih:

> **UX lebih baik.**

SI LABU harus terasa sederhana bagi siswa dan efisien bagi Guru BK.