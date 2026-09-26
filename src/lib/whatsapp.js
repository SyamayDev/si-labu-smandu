export function normalizePhoneNumber(value = "") {
  const digits = value.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

export function generateWhatsAppMessage(report, template) {
  const values = {
    nama: report.reporter_name,
    kelas: report.reporter_class,
    nomor_laporan: report.report_code || "menunggu kode",
    jenis: (report.incident_types || []).join(", "),
    tanggal: report.incident_date || "-",
    lokasi: report.incident_location || "-",
    status: report.status || "Baru",
  };
  return template.replace(/{{(\w+)}}/g, (_, key) => values[key] ?? "");
}

export function openWhatsApp(phone, message) {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return false;
  window.open(
    `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
  return true;
}
