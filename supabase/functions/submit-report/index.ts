import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const bucketName = "report-attachments";
const maxFileSize = 25 * 1024 * 1024;
const maxTotalSize = 50 * 1024 * 1024;
const maxFiles = 5;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;
const submissionAttempts = new Map<
  string,
  { count: number; expiresAt: number }
>();
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "audio/ogg",
]);
const allowedIncidentTypes = new Set([
  "Verbal",
  "Fisik",
  "Sosial / Pengucilan",
  "Intimidasi",
  "Cyberbullying",
  "Lainnya",
]);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sanitizeFileName(name: string) {
  return (
    name
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]+/g, "_")
      .replace(/^\.+/, "")
      .slice(-100) || "lampiran"
  );
}

function isRateLimited(request: Request) {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip) return false;
  const now = Date.now();
  const current = submissionAttempts.get(ip);
  if (!current || current.expiresAt <= now) {
    submissionAttempts.set(ip, {
      count: 1,
      expiresAt: now + rateLimitWindowMs,
    });
    return false;
  }
  if (current.count >= maxSubmissionsPerWindow) return true;
  current.count += 1;
  return false;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Metode tidak didukung." }, 405);
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxTotalSize + 1024 * 1024) {
    return jsonResponse(
      { error: "Total ukuran lampiran maksimal 50 MB." },
      413,
    );
  }
  if (isRateLimited(request)) {
    return jsonResponse(
      { error: "Terlalu banyak laporan. Coba lagi beberapa menit." },
      429,
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Supabase Edge Function secrets are missing.");
    return jsonResponse({ error: "Layanan laporan belum dikonfigurasi." }, 500);
  }

  let form: FormData;
  let reportInput: Record<string, unknown>;
  let files: File[];
  try {
    form = await request.formData();
    const rawReport = form.get("report");
    if (typeof rawReport !== "string")
      throw new Error("Data laporan tidak valid.");
    reportInput = JSON.parse(rawReport);
    if (
      typeof reportInput !== "object" ||
      reportInput === null ||
      Array.isArray(reportInput)
    ) {
      throw new Error("Data laporan tidak valid.");
    }
    const fileEntries = form.getAll("files");
    if (!fileEntries.every((entry) => entry instanceof File)) {
      throw new Error("Lampiran tidak valid.");
    }
    files = fileEntries as File[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Form laporan tidak valid.";
    return jsonResponse({ error: message }, 400);
  }

  const requiredText = [
    "reporter_name",
    "reporter_class",
    "reporter_phone",
    "reporter_status",
    "incident_date",
    "incident_time",
    "incident_location",
    "description",
  ];
  if (
    requiredText.some((key) => typeof reportInput[key] !== "string") ||
    !Array.isArray(reportInput.incident_types) ||
    typeof reportInput.is_ongoing !== "boolean"
  ) {
    return jsonResponse({ error: "Lengkapi data laporan dengan benar." }, 400);
  }

  const report = reportInput as Record<string, string | boolean | string[]>;
  const incidentTypes = report.incident_types as string[];
  const reporterName = (report.reporter_name as string).trim();
  const reporterClass = (report.reporter_class as string).trim();
  const reporterPhone = (report.reporter_phone as string).trim();
  const incidentLocation = (report.incident_location as string).trim();
  const description = (report.description as string).trim();
  if (
    reporterName.length < 1 ||
    reporterName.length > 120 ||
    reporterClass.length < 1 ||
    reporterClass.length > 40 ||
    reporterPhone.length < 8 ||
    reporterPhone.length > 20 ||
    !/^\+?[\d\s-]+$/.test(reporterPhone) ||
    !["Korban", "Saksi"].includes(report.reporter_status as string) ||
    incidentTypes.length < 1 ||
    incidentTypes.length > 6 ||
    incidentTypes.some((type) => !allowedIncidentTypes.has(type)) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(report.incident_date as string) ||
    !/^\d{2}:\d{2}(:\d{2})?$/.test(report.incident_time as string) ||
    incidentLocation.length < 1 ||
    incidentLocation.length > 300 ||
    description.length < 1 ||
    description.length > 2000
  ) {
    return jsonResponse({ error: "Sebagian data laporan tidak valid." }, 400);
  }

  if (
    files.length > maxFiles ||
    files.some((file) => !file.size || file.size > maxFileSize)
  ) {
    return jsonResponse(
      { error: "Lampiran maksimal 5 file dan 25 MB per file." },
      400,
    );
  }
  if (files.some((file) => !allowedTypes.has(file.type))) {
    return jsonResponse({ error: "Format lampiran tidak didukung." }, 400);
  }
  if (files.reduce((total, file) => total + file.size, 0) > maxTotalSize) {
    return jsonResponse(
      { error: "Total ukuran lampiran maksimal 50 MB." },
      400,
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: savedReport, error: insertError } = await supabase
    .from("reports")
    .insert({
      reporter_name: reporterName,
      reporter_class: reporterClass,
      reporter_phone: reporterPhone,
      reporter_status: report.reporter_status,
      incident_types: incidentTypes,
      incident_date: report.incident_date,
      incident_time: report.incident_time,
      incident_location: incidentLocation,
      description,
      is_ongoing: report.is_ongoing,
    })
    .select("id, report_code")
    .single();

  if (insertError || !savedReport) {
    console.error("Report insert failed:", insertError);
    return jsonResponse({ error: "Laporan gagal disimpan. Coba lagi." }, 500);
  }

  const uploadedPaths: string[] = [];
  try {
    const attachmentRows = [];
    for (const file of files) {
      const path = `${savedReport.id}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      uploadedPaths.push(path);
      attachmentRows.push({
        report_id: savedReport.id,
        file_name: file.name.slice(0, 255),
        file_path: path,
        mime_type: file.type,
        file_size: file.size,
      });
    }

    if (attachmentRows.length) {
      const { error: metadataError } = await supabase
        .from("report_attachments")
        .insert(attachmentRows);
      if (metadataError) throw metadataError;
    }
  } catch (error) {
    console.error("Report attachment upload failed:", error);
    if (uploadedPaths.length) {
      await supabase.storage.from(bucketName).remove(uploadedPaths);
    }
    await supabase.from("reports").delete().eq("id", savedReport.id);
    return jsonResponse(
      { error: "Lampiran gagal diunggah. Laporan belum disimpan." },
      500,
    );
  }

  return jsonResponse(
    {
      report_code: savedReport.report_code,
      attachment_count: uploadedPaths.length,
    },
    201,
  );
});
