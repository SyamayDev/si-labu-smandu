export const incidentOptions = [
  "Verbal",
  "Fisik",
  "Sosial / Pengucilan",
  "Intimidasi",
  "Cyberbullying",
  "Lainnya",
];
export const reportStatuses = ["Baru", "Ditangani", "Selesai"];
export const maxFileSize = 25 * 1024 * 1024;
export const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "audio/ogg",
];

export function validateReport(data, files = []) {
  const errors = {};
  if (!data.reporter_name.trim()) errors.reporter_name = "Nama wajib diisi.";
  if (!data.reporter_class.trim()) errors.reporter_class = "Kelas wajib diisi.";
  if (!/^\+?[\d\s-]{8,18}$/.test(data.reporter_phone.trim()))
    errors.reporter_phone = "Nomor WhatsApp belum valid.";
  if (!data.reporter_status) errors.reporter_status = "Pilih status pelapor.";
  if (!data.incident_types.length)
    errors.incident_types = "Pilih minimal satu jenis perundungan.";
  if (!data.incident_date) errors.incident_date = "Tanggal wajib diisi.";
  if (!data.incident_time) errors.incident_time = "Waktu wajib diisi.";
  if (!data.incident_location.trim())
    errors.incident_location = "Lokasi wajib diisi.";
  if (!data.description.trim()) errors.description = "Kronologi wajib diisi.";
  if (data.description.length > 2000)
    errors.description = "Kronologi maksimal 2.000 karakter.";
  files.forEach((file) => {
    if (!allowedFileTypes.includes(file.type))
      errors.files = "Format file tidak didukung.";
    if (file.size > maxFileSize)
      errors.files = "Ukuran setiap file maksimal 25 MB.";
  });
  return errors;
}
