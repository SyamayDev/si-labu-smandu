import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const bucketName = "report-attachments";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Metode tidak didukung." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const accessToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  if (!supabaseUrl || !serviceRoleKey || !accessToken) {
    return jsonResponse({ error: "Sesi admin tidak valid." }, 401);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } =
    await supabase.auth.getUser(accessToken);
  if (authError || !authData.user) {
    return jsonResponse(
      { error: "Sesi admin sudah berakhir. Silakan masuk kembali." },
      401,
    );
  }
  const { data: actor, error: actorError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", authData.user.id)
    .maybeSingle();
  if (actorError || !actor?.is_admin) {
    return jsonResponse(
      { error: "Hanya admin yang dapat menghapus laporan." },
      403,
    );
  }

  let reportId: unknown;
  try {
    ({ report_id: reportId } = await request.json());
  } catch {
    return jsonResponse({ error: "ID laporan tidak valid." }, 400);
  }
  if (typeof reportId !== "string" || !/^[0-9a-f-]{36}$/i.test(reportId)) {
    return jsonResponse({ error: "ID laporan tidak valid." }, 400);
  }

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("id")
    .eq("id", reportId)
    .maybeSingle();
  if (reportError || !report) {
    return jsonResponse({ error: "Laporan tidak ditemukan." }, 404);
  }
  const { data: attachments, error: attachmentError } = await supabase
    .from("report_attachments")
    .select("file_path")
    .eq("report_id", reportId);
  if (attachmentError) {
    console.error("Could not list report attachments:", attachmentError);
    return jsonResponse(
      { error: "Lampiran laporan tidak dapat diperiksa." },
      500,
    );
  }

  const { error: deleteError } = await supabase
    .from("reports")
    .delete()
    .eq("id", reportId);
  if (deleteError) {
    console.error("Report delete failed:", deleteError);
    return jsonResponse({ error: "Laporan gagal dihapus." }, 500);
  }

  const paths = (attachments || []).map((attachment) => attachment.file_path);
  if (paths.length) {
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove(paths);
    if (storageError) {
      console.error("Report attachment cleanup failed:", storageError);
      return jsonResponse({
        deleted: true,
        warning: "File lampiran perlu dibersihkan dari Storage.",
      });
    }
  }

  return jsonResponse({ deleted: true });
});
