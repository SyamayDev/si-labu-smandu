import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
      { error: "Hanya admin yang dapat menambah Guru BK." },
      403,
    );
  }

  let input: { full_name?: unknown; email?: unknown; phone?: unknown };
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: "Data Guru BK tidak valid." }, 400);
  }
  const fullName =
    typeof input.full_name === "string" ? input.full_name.trim() : "";
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  if (
    !fullName ||
    fullName.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    (phone && !/^\+?[\d\s-]{8,20}$/.test(phone))
  ) {
    return jsonResponse(
      { error: "Nama, email, atau nomor WhatsApp tidak valid." },
      400,
    );
  }

  const { data: invitation, error: inviteError } =
    await supabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName },
    });
  if (inviteError || !invitation.user) {
    console.error("Guru BK invitation failed:", inviteError);
    return jsonResponse(
      {
        error:
          "Undangan gagal dikirim. Pastikan email belum terdaftar dan SMTP Supabase aktif.",
      },
      400,
    );
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: invitation.user.id,
      full_name: fullName,
      email,
      phone: phone || null,
      is_admin: true,
    },
    { onConflict: "id" },
  );
  if (profileError) {
    console.error("Guru BK profile setup failed:", profileError);
    await supabase.auth.admin.deleteUser(invitation.user.id);
    return jsonResponse(
      { error: "Profil Guru BK gagal dibuat. Undangan dibatalkan." },
      500,
    );
  }

  return jsonResponse(
    {
      teacher: {
        id: invitation.user.id,
        full_name: fullName,
        email,
        phone,
        is_admin: true,
      },
    },
    201,
  );
});
