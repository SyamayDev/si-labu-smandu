insert into public.site_settings(key,value) values
('school', '{"name":"SMA Negeri 2 Medan","tagline":"Berani Bicara. Kami Siap Mendengar."}'),
('bk_contact', '{"service_name":"Guru BK SMA Negeri 2 Medan","whatsapp":"","email":""}'),
('whatsapp_template', '{"body":"Halo {{nama}},\n\nSaya Guru BK SMA Negeri 2 Medan.\n\nKami sudah menerima laporan {{nomor_laporan}} terkait {{jenis}} pada {{tanggal}} di {{lokasi}}. Kami ingin menindaklanjuti laporan tersebut. Silakan membalas pesan ini agar kita dapat melanjutkan komunikasi.\n\nTerima kasih sudah berani bercerita.\n\nSalam,\nGuru BK SMA Negeri 2 Medan"}')
on conflict (key) do nothing;
