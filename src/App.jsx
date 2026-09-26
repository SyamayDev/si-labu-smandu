import { lazy, Suspense, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Columns3,
  Copy,
  Download,
  FileAudio,
  FileText,
  HeartHandshake,
  Home as HomeIcon,
  Info,
  LayoutDashboard,
  LockKeyhole,
  KeyRound,
  LogOut,
  Menu,
  MessageCircle,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { incidentOptions, validateReport } from "./lib/validators";
import { generateWhatsAppMessage, openWhatsApp } from "./lib/whatsapp";
import { getSupabase, hasSupabase } from "./lib/supabase";

const ReportTable = lazy(() => import("./ReportTable"));
const defaultTemplate = `Halo {{nama}},\n\nSaya Guru BK SMA Negeri 2 Medan.\n\nKami sudah menerima laporan {{nomor_laporan}} terkait {{jenis}} pada {{tanggal}} di {{lokasi}}. Kami ingin menindaklanjuti laporan tersebut. Silakan membalas pesan ini agar kita dapat melanjutkan komunikasi.\n\nTerima kasih sudah berani bercerita.\n\nSalam,\nGuru BK SMA Negeri 2 Medan`;
const demoReports = [
  {
    id: "1",
    report_code: "LABU-2026-0001",
    reporter_name: "Nadia Putri",
    reporter_class: "XI IPA 2",
    reporter_phone: "081234567890",
    reporter_status: "Korban",
    incident_types: ["Verbal", "Sosial / Pengucilan"],
    incident_date: "2026-09-24",
    incident_time: "10:15",
    incident_location: "Kelas XI IPA 2",
    description:
      "Saya beberapa kali dipanggil dengan julukan yang tidak saya sukai.",
    is_ongoing: true,
    status: "Baru",
    created_at: "2026-09-24T10:30:00",
  },
];
const demoAdmins = [
  {
    id: "admin-1",
    initials: "AD",
    full_name: "Admin Guru BK",
    email: "guru.bk@sman2medan.sch.id",
    phone: "081234567890",
    is_current: true,
  },
  {
    id: "admin-2",
    initials: "RN",
    full_name: "Rina Nurhayati",
    email: "rina.bk@sman2medan.sch.id",
    phone: "081298765432",
    is_current: false,
  },
];

function readLocalReports() {
  try {
    return JSON.parse(window.localStorage.getItem("si-labu-reports") || "[]");
  } catch {
    return [];
  }
}

function useAdminReports() {
  const [reports, setReports] = useState(() =>
    hasSupabase ? [] : readLocalReports(),
  );
  const [loading, setLoading] = useState(hasSupabase);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasSupabase) return;
    let active = true;
    getSupabase()
      .then((supabase) =>
        supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false }),
      )
      .then(({ data, error: queryError }) => {
        if (!active) return;
        setReports(data || []);
        setError(queryError?.message || "");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (id, status) => {
    if (hasSupabase) {
      const supabase = await getSupabase();
      const { error: updateError } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", id);
      if (updateError) {
        setError("Status tidak dapat disimpan. Silakan coba lagi.");
        return false;
      }
    }
    setReports((current) => {
      const next = current.map((report) =>
        report.id === id ? { ...report, status } : report,
      );
      if (!hasSupabase) {
        window.localStorage.setItem("si-labu-reports", JSON.stringify(next));
      }
      return next;
    });
    setError("");
    return true;
  };

  const deleteReport = async (id) => {
    if (hasSupabase) {
      const supabase = await getSupabase();
      const { error: deleteError } = await supabase.functions.invoke(
        "delete-report",
        { body: { report_id: id } },
      );
      if (deleteError) {
        setError("Laporan gagal dihapus. Pastikan Edge Function tersedia.");
        return false;
      }
    }
    setReports((current) => {
      const next = current.filter((report) => report.id !== id);
      if (!hasSupabase) {
        window.localStorage.setItem("si-labu-reports", JSON.stringify(next));
      }
      return next;
    });
    setError("");
    return true;
  };

  return { reports, loading, error, updateStatus, deleteReport };
}

function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">
        <img src="/assets/mascot/mascot.webp" alt="Maskot SI LABU" />
      </span>
      <span>
        <b>SI LABU</b>
        <small>SMA Negeri 2 Medan</small>
      </span>
    </Link>
  );
}
function PublicHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Brand />
      </div>
    </header>
  );
}
function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <footer>
        <div className="container footer-inner">
          <Brand />
          <span>Tempat aman untuk mulai bercerita.</span>
          <Link to="/admin/login">Akses Guru BK</Link>
        </div>
      </footer>
    </>
  );
}
function Home() {
  return (
    <PublicLayout>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="kicker">
              <ShieldCheck size={16} /> Sistem Informasi Laporan Bullying
            </p>
            <h1 className="hero-brand-title">
              SI LABU.
              <br />
              <em>Sistem Informasi Laporan Bullying.</em>
            </h1>
            <p className="hero-copy">
              Saluran bagi siswa SMA Negeri 2 Medan untuk menyampaikan laporan
              bullying langsung kepada Guru BK. Tidak perlu membuat akun siswa.
            </p>
            <div className="hero-actions">
              <Link className="button primary report-cta" to="/lapor">
                Buat Laporan Sekarang
                <span className="report-cta-icon">
                  <ArrowRight size={19} />
                </span>
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-ring">
              <img
                className="mascot-image"
                src="/assets/mascot/mascot.webp"
                alt="Maskot SI LABU"
                width="477"
                height="523"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="visual-note">
              <CheckCircle2 size={20} />
              <span>
                <b>Privasi terjaga</b>
                <small>Data hanya untuk Guru BK</small>
              </span>
            </div>
            <div className="visual-label">
              Satu langkah kecil
              <br />
              <strong>untuk merasa lebih aman.</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="intro-band">
        <div className="container intro-grid">
          <div>
            <p className="kicker">Kenapa SI LABU?</p>
            <h2>Kamu tidak harus menghadapi semuanya sendirian.</h2>
          </div>
          <p>
            Baik kamu mengalami atau melihat perundungan, ceritamu layak
            didengar. Sampaikan dengan cara yang nyaman, tanpa harus membuat
            akun siswa.
          </p>
        </div>
      </section>
      <section className="about-band">
        <div className="container about-band-grid">
          <div>
            <p className="kicker">Tentang SI LABU</p>
            <h2>Jembatan awal menuju bantuan.</h2>
          </div>
          <p>
            SI LABU membantu siswa SMA Negeri 2 Medan menyampaikan informasi
            tentang perundungan kepada Guru BK. Tidak perlu login dan tidak
            perlu menunggu memiliki bukti untuk mulai bercerita.
          </p>
        </div>
      </section>
      <section className="section" id="cara-kerja">
        <div className="container">
          <div className="section-heading">
            <p className="kicker">Cara kerja</p>
            <h2>
              Sederhana untuk siswa,
              <br />
              jelas untuk Guru BK.
            </h2>
          </div>
          <div className="steps">
            <Step
              n="01"
              title="Ceritakan"
              text="Isi laporan sesuai kejadian yang kamu ingat."
            />
            <Step
              n="02"
              title="Kirim"
              text="Laporan diterima secara aman oleh Guru BK."
            />
            <Step
              n="03"
              title="Ditangani"
              text="Guru BK menghubungi kamu melalui WhatsApp."
            />
            <Step
              n="04"
              title="Selesai"
              text="Status diperbarui setelah penanganan selesai."
            />
          </div>
        </div>
      </section>
      <section className="faq-section">
        <div className="container faq-grid">
          <div>
            <p className="kicker">Masih ragu?</p>
            <h2>Pertanyaan yang sering muncul.</h2>
            <img
              className="supportive-mascot"
              src="/assets/mascot/mascot-supportive.webp"
              alt="Maskot SI LABU memberi dukungan"
              width="528"
              height="473"
              loading="lazy"
              decoding="async"
              onError={(event) =>
                event.currentTarget.classList.add("asset-missing")
              }
            />
          </div>
          <div className="faq-list">
            <details>
              <summary>Apakah saya harus punya bukti?</summary>
              <p>
                Tidak. Bukti bersifat opsional. Ceritamu tetap bisa dikirim
                tanpa lampiran.
              </p>
            </details>
            <details>
              <summary>Apakah saya harus login?</summary>
              <p>Tidak. Siswa dapat mengirim laporan tanpa membuat akun.</p>
            </details>
            <details>
              <summary>Siapa yang membaca laporan saya?</summary>
              <p>
                Laporan ditujukan kepada Guru BK dan tidak ditampilkan kepada
                siswa lain.
              </p>
            </details>
          </div>
        </div>
      </section>
      <section className="trust-band">
        <div className="container trust-grid">
          <HeartHandshake size={34} />
          <div>
            <h3>
              Apa pun yang kamu rasakan, mulai dari cerita yang kamu mampu.
            </h3>
            <p>
              Lampiran bukti bersifat opsional. Tidak memilikinya bukan alasan
              untuk menunda meminta bantuan.
            </p>
          </div>
          <Link className="text-link" to="/lapor">
            Mulai laporan <ChevronRight size={17} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
function Step({ n, title, text }) {
  const imageDimensions = {
    "01": [478, 522],
    "02": [500, 499],
    "03": [508, 491],
    "04": [525, 475],
  }[n];
  return (
    <div className="step">
      <img
        className="step-art"
        src={`/assets/mascot/mascot-step-${n}.webp`}
        alt=""
        aria-hidden="true"
        width={imageDimensions[0]}
        height={imageDimensions[1]}
        loading="lazy"
        decoding="async"
        onError={(event) => event.currentTarget.classList.add("asset-missing")}
      />
      <span>{n}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
function About() {
  return (
    <PublicLayout>
      <section className="page-section container narrow">
        <p className="kicker">
          <Info size={16} /> Tentang SI LABU
        </p>
        <h1>Jembatan awal menuju bantuan.</h1>
        <p className="lead">
          SI LABU adalah sistem laporan dan konsultasi perundungan untuk
          membantu siswa SMA Negeri 2 Medan menyampaikan informasi kepada Guru
          BK.
        </p>
        <div className="about-list">
          <div>
            <ShieldCheck />
            <h3>Aman dan privat</h3>
            <p>
              Pelapor tidak perlu login. Laporan tidak ditampilkan kepada siswa
              lain.
            </p>
          </div>
          <div>
            <MessageCircle />
            <h3>Manusia di balik tindak lanjut</h3>
            <p>Setiap laporan diterima dan ditindaklanjuti oleh Guru BK.</p>
          </div>
          <div>
            <LockKeyhole />
            <h3>Bukti tidak wajib</h3>
            <p>
              Kamu tetap bisa mengirim laporan meskipun tidak memiliki lampiran.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
function ReportForm() {
  const [data, setData] = useState({
    reporter_name: "",
    reporter_class: "",
    reporter_phone: "",
    reporter_status: "",
    incident_types: [],
    incident_date: "",
    incident_time: "",
    incident_location: "",
    description: "",
    is_ongoing: false,
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const toggleType = (type) =>
    update(
      "incident_types",
      data.incident_types.includes(type)
        ? data.incident_types.filter((x) => x !== type)
        : [...data.incident_types, type],
    );
  const submit = async (e) => {
    e.preventDefault();
    const next = validateReport(data, files);
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      let report;
      if (hasSupabase) {
        const supabase = await getSupabase();
        const body = new FormData();
        body.set("report", JSON.stringify(data));
        files.forEach((file) => body.append("files", file, file.name));
        const { data: submittedReport, error: submitFunctionError } =
          await supabase.functions.invoke("submit-report", { body });
        if (submitFunctionError) {
          let message = submitFunctionError.message;
          if (submitFunctionError.context instanceof Response) {
            const responseBody = await submitFunctionError.context
              .clone()
              .json()
              .catch(() => null);
            message = responseBody?.error || message;
          }
          console.error(
            "Gagal menyimpan laporan SI LABU:",
            submitFunctionError,
          );
          setSubmitError(
            message || "Laporan dan lampiran belum dapat dikirim.",
          );
          return;
        }
        report = submittedReport;
      } else {
        if (files.length) {
          setSubmitError(
            "Pengiriman lampiran memerlukan koneksi SI LABU. Coba lagi saat layanan tersedia.",
          );
          return;
        }
        const localReports = readLocalReports();
        report = {
          ...data,
          id: crypto.randomUUID(),
          report_code: `LABU-${new Date().getFullYear()}-${String(localReports.length + 1).padStart(4, "0")}`,
          status: "Baru",
          created_at: new Date().toISOString(),
        };
        window.localStorage.setItem(
          "si-labu-reports",
          JSON.stringify([report, ...localReports]),
        );
      }
      setSubmitted(report);
    } catch (error) {
      console.error("Gagal mengirim laporan SI LABU:", error);
      setSubmitError(
        "Laporan belum dapat dikirim. Periksa koneksi lalu coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (submitted)
    return (
      <PublicLayout>
        <section className="success-page container">
          <div className="success-icon">
            <Check size={30} />
          </div>
          <p className="kicker">Laporan diterima</p>
          <h1>Terima kasih sudah berani bercerita.</h1>
          <p className="lead">
            {submitted.report_code
              ? "Laporanmu sudah tercatat untuk ditindaklanjuti Guru BK. Simpan nomor laporan ini untuk referensi."
              : "Laporanmu sudah tercatat dan akan ditindaklanjuti Guru BK."}
          </p>
          {submitted.report_code && (
            <div className="report-code">{submitted.report_code}</div>
          )}
          <Link className="button primary" to="/">
            Kembali ke beranda <ArrowRight size={18} />
          </Link>
        </section>
      </PublicLayout>
    );
  return (
    <PublicLayout>
      <section className="page-section container report-page">
        <div className="form-intro">
          <p className="kicker">Lapor Bully!</p>
          <h1>Ceritakan apa yang terjadi.</h1>
          <p className="lead">
            Isi dengan tenang. Tidak perlu menggunakan kata-kata yang sempurna,
            cukup ceritakan sesuai yang kamu ingat.
          </p>
        </div>
        <form className="report-form" onSubmit={submit} noValidate>
          <div className="form-section">
            <h2>Identitas pelapor</h2>
            <div className="field-grid">
              <Field label="Nama lengkap" error={errors.reporter_name}>
                <input
                  value={data.reporter_name}
                  onChange={(e) => update("reporter_name", e.target.value)}
                  placeholder="Nama kamu"
                />
              </Field>
              <Field label="Kelas" error={errors.reporter_class}>
                <input
                  value={data.reporter_class}
                  onChange={(e) => update("reporter_class", e.target.value)}
                  placeholder="Contoh: XI IPA 2"
                />
              </Field>
              <Field label="Nomor WhatsApp" error={errors.reporter_phone}>
                <input
                  value={data.reporter_phone}
                  onChange={(e) => update("reporter_phone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                />
              </Field>
              <Field label="Saya adalah" error={errors.reporter_status}>
                <div className="choice-row">
                  {["Korban", "Saksi"].map((x) => (
                    <label
                      className={
                        data.reporter_status === x
                          ? "choice selected"
                          : "choice"
                      }
                      key={x}
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={data.reporter_status === x}
                        onChange={() => update("reporter_status", x)}
                      />
                      {x}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          </div>
          <div className="form-section">
            <h2>Tentang kejadian</h2>
            <Field label="Jenis perundungan" error={errors.incident_types}>
              <div className="tag-grid">
                {incidentOptions.map((x) => (
                  <label
                    className={
                      data.incident_types.includes(x) ? "tag selected" : "tag"
                    }
                    key={x}
                  >
                    <input
                      type="checkbox"
                      checked={data.incident_types.includes(x)}
                      onChange={() => toggleType(x)}
                    />
                    {x}
                  </label>
                ))}
              </div>
            </Field>
            <div className="field-grid">
              <Field label="Tanggal kejadian" error={errors.incident_date}>
                <input
                  type="date"
                  value={data.incident_date}
                  onChange={(e) => update("incident_date", e.target.value)}
                />
              </Field>
              <Field label="Waktu kejadian" error={errors.incident_time}>
                <input
                  type="time"
                  value={data.incident_time}
                  onChange={(e) => update("incident_time", e.target.value)}
                />
              </Field>
              <Field label="Lokasi kejadian" error={errors.incident_location}>
                <input
                  value={data.incident_location}
                  onChange={(e) => update("incident_location", e.target.value)}
                  placeholder="Contoh: Kelas atau kantin"
                />
              </Field>
              <Field label="Kejadian masih berlangsung?">
                <div className="choice-row">
                  <label
                    className={data.is_ongoing ? "choice selected" : "choice"}
                  >
                    <input
                      type="radio"
                      name="ongoing"
                      checked={data.is_ongoing}
                      onChange={() => update("is_ongoing", true)}
                    />
                    Ya
                  </label>
                  <label
                    className={!data.is_ongoing ? "choice selected" : "choice"}
                  >
                    <input
                      type="radio"
                      name="ongoing"
                      checked={!data.is_ongoing}
                      onChange={() => update("is_ongoing", false)}
                    />
                    Tidak
                  </label>
                </div>
              </Field>
            </div>
            <Field label="Ceritakan kejadian" error={errors.description}>
              <textarea
                maxLength="2000"
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Apa yang terjadi? Siapa yang terlibat? Tulis hal yang menurutmu penting."
              />
              <div className="counter">{data.description.length}/2.000</div>
            </Field>
          </div>
          <div className="form-section">
            <div className="section-title-row">
              <div>
                <h2>
                  Lampiran bukti <small>(opsional)</small>
                </h2>
                <p>
                  JPG, PNG, WEBP, MP4, MOV, MP3, WAV, M4A, atau OGG. Maksimal 5
                  file, 25 MB per file, total 50 MB.
                </p>
              </div>
              <Upload size={21} />
            </div>
            <label className="upload-box">
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={(e) => setFiles([...e.target.files])}
              />
              <Upload size={25} />
              <b>Pilih file</b>
              <span>Tidak masalah jika kamu tidak memiliki bukti.</span>
            </label>
            {files.length > 0 && (
              <div className="file-list">
                {files.map((file) => (
                  <div key={file.name}>
                    <FileText size={17} />
                    <span>
                      {file.name}
                      <small>{(file.size / 1024 / 1024).toFixed(1)} MB</small>
                    </span>
                    {file.type.startsWith("audio/") && <FileAudio size={17} />}
                  </div>
                ))}
              </div>
            )}
            {errors.files && (
              <p className="error">
                <AlertCircle size={14} />
                {errors.files}
              </p>
            )}
          </div>
          {Object.keys(errors).length > 0 && (
            <p className="form-error">
              <AlertCircle size={16} /> Periksa kembali bagian yang ditandai.
            </p>
          )}
          {submitError && <p className="form-error">{submitError}</p>}
          <button
            className="button primary submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Mengirim laporan..." : "Kirim laporan"}{" "}
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </PublicLayout>
  );
}
function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>
        {label} <b>*</b>
      </span>
      {children}
      {error && (
        <small className="error">
          <AlertCircle size={13} />
          {error}
        </small>
      )}
    </label>
  );
}
function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!hasSupabase) return;
    let active = true;
    getSupabase()
      .then((supabase) => supabase.auth.getSession())
      .then(async ({ data }) => {
        if (!active || !data.session?.user) return;
        const supabase = await getSupabase();
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.session.user.id)
          .maybeSingle();
        if (active && profile?.is_admin) navigate("/admin", { replace: true });
      })
      .catch((sessionError) =>
        console.error("Gagal memeriksa sesi admin SI LABU:", sessionError),
      );
    return () => {
      active = false;
    };
  }, [navigate]);
  const login = async () => {
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    if (!hasSupabase) {
      navigate("/admin", { state: { welcome: true } });
      return;
    }
    setLoading(true);
    const supabase = await getSupabase();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      setError("Email atau password tidak sesuai.");
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();
    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setError("Akun ini belum memiliki akses admin.");
      setLoading(false);
      return;
    }
    navigate("/admin", { state: { welcome: true } });
    setLoading(false);
  };
  return (
    <div className="admin-login">
      <div className="login-panel">
        <Brand />
        <p className="kicker-login">Portal Guru BK</p>
        <h1>Selamat datang kembali.</h1>
        <p>Masuk untuk melihat dan menindaklanjuti laporan siswa.</p>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="guru.bk@sman2medan.sch.id"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password"
          />
        </label>
        {error && (
          <p className="form-error login-error">
            <AlertCircle size={15} />
            {error}
          </p>
        )}
        <button
          className="button primary submit"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Memeriksa..." : "Masuk ke dashboard"}{" "}
          <ArrowRight size={18} />
        </button>{" "}
        <br />
        <Link to="/">Kembali ke halaman publik</Link>
      </div>
      <div className="login-aside">
        <ShieldCheck size={44} />
        <h2>Penanganan yang lebih terarah.</h2>
        <p>
          Semua laporan dirangkum agar Guru BK dapat memahami situasi dan
          menentukan langkah berikutnya dengan cepat.
        </p>
      </div>
    </div>
  );
}
function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(
    Boolean(location.state?.welcome),
  );
  const [noticeReport, setNoticeReport] = useState(null);
  const [logoutError, setLogoutError] = useState("");
  useEffect(() => setMobileMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (!showNotice) return;
    let active = true;
    const loadLatestReport = async () => {
      if (!hasSupabase) {
        setNoticeReport(
          readLocalReports().find((report) => report.status === "Baru") || null,
        );
        return;
      }
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from("reports")
        .select("id, report_code")
        .eq("status", "Baru")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && active) setNoticeReport(data || null);
    };
    loadLatestReport().catch((noticeError) =>
      console.error("Gagal memuat laporan terbaru:", noticeError),
    );
    return () => {
      active = false;
    };
  }, [showNotice]);
  useEffect(() => {
    if (!hasSupabase) return;
    getSupabase()
      .then((supabase) => supabase.auth.getUser())
      .then(({ data }) => {
        if (!data.user) navigate("/admin/login", { replace: true });
      });
  }, [navigate]);
  const logout = async () => {
    setLogoutError("");
    try {
      if (hasSupabase) {
        const supabase = await getSupabase();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Gagal keluar dari portal SI LABU:", error);
      setLogoutError("Tidak dapat keluar. Periksa koneksi lalu coba lagi.");
    }
  };
  return (
    <div className="admin-shell">
      {mobileMenuOpen && (
        <button
          className="admin-sidebar-backdrop"
          aria-label="Tutup navigasi"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside
        className={`admin-sidebar${mobileMenuOpen ? " open" : ""}`}
        id="admin-navigation"
      >
        <Brand />
        <nav>
          <NavLink to="/admin" end onClick={() => setMobileMenuOpen(false)}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/laporan" onClick={() => setMobileMenuOpen(false)}>
            <FileText size={18} />
            Laporan
          </NavLink>
          <NavLink to="/admin/guru-bk" onClick={() => setMobileMenuOpen(false)}>
            <Users size={18} />
            Guru BK
          </NavLink>
          <NavLink
            to="/admin/pengaturan"
            onClick={() => setMobileMenuOpen(false)}
          >
            <LockKeyhole size={18} />
            Pengaturan
          </NavLink>
        </nav>
        <button
          className="desktop-sidebar-logout"
          type="button"
          onClick={logout}
        >
          <LogOut size={18} />
          Keluar
        </button>
        <Link
          className="admin-public-link"
          to="/"
          onClick={() => setMobileMenuOpen(false)}
        >
          <HomeIcon size={17} />
          Lihat situs publik
        </Link>
      </aside>
      <div className="admin-content">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <div>
            <p className="kicker">Portal Guru BK</p>
            <h2>
              {location.pathname.includes("laporan")
                ? "Laporan"
                : location.pathname.includes("guru")
                  ? "Guru BK"
                  : location.pathname.includes("pengaturan")
                    ? "Pengaturan"
                    : "Dashboard"}
            </h2>
          </div>
          <div className="profile-chip">
            <span>AD</span>
            <div>
              <b>Admin Guru BK</b>
              <small>Administrator</small>
            </div>
          </div>
          <button className="logout-button" type="button" onClick={logout}>
            <LogOut size={17} /> <span>Keluar</span>
          </button>
        </header>
        {showNotice && (
          <div className="admin-notice" role="status">
            <div className="notice-icon">!</div>
            <div>
              <b>Selamat datang, Admin Guru BK</b>
              <span>
                {noticeReport
                  ? `${noticeReport.report_code} menunggu ditinjau.`
                  : "Belum ada laporan baru untuk ditinjau."}
              </span>
              <Link
                to={
                  noticeReport
                    ? `/admin/laporan/${noticeReport.id}`
                    : "/admin/laporan"
                }
                onClick={() => setShowNotice(false)}
              >
                {noticeReport ? "Buka laporan terbaru" : "Lihat daftar laporan"}{" "}
                <ChevronRight size={15} />
              </Link>
            </div>
            <button
              className="notice-close"
              aria-label="Tutup notifikasi"
              onClick={() => setShowNotice(false)}
            >
              ×
            </button>
          </div>
        )}
        {logoutError && (
          <p className="form-error logout-error">{logoutError}</p>
        )}
        {children}
      </div>
    </div>
  );
}
function Dashboard() {
  const { reports, loading, error } = useAdminReports();
  const total = reports.length;
  const countByStatus = (status) =>
    reports.filter((report) => report.status === status).length;
  return (
    <AdminLayout>
      <div className="admin-page">
        {!hasSupabase && (
          <p className="data-note mode-note">
            Mode lokal: data hanya tersimpan di browser ini.
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="stats">
          <Stat label="Total laporan" value={total} />
          <Stat label="Baru" value={countByStatus("Baru")} tone="new" />
          <Stat
            label="Ditangani"
            value={countByStatus("Ditangani")}
            tone="handling"
          />
          <Stat label="Selesai" value={countByStatus("Selesai")} tone="done" />
        </div>
        <div className="admin-card report-card">
          <div className="card-heading">
            <div>
              <p className="kicker">Aktivitas terbaru</p>
              <h3>Laporan terbaru</h3>
            </div>
            <Link className="text-link" to="/admin/laporan">
              Lihat semua <ChevronRight size={16} />
            </Link>
          </div>
          {loading ? (
            <p className="table-message">Memuat laporan...</p>
          ) : (
            <Suspense
              fallback={
                <p className="table-message">Menyiapkan tabel laporan...</p>
              }
            >
              <ReportTable reports={reports.slice(0, 5)} />
            </Suspense>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
function Stat({ label, value, tone = "" }) {
  return (
    <div className={`stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>Semua periode</small>
    </div>
  );
}
function Reports() {
  const { reports, loading, error, deleteReport } = useAdminReports();
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-intro-row">
          <div>
            <p className="kicker">Rekap laporan</p>
            <h1>Semua laporan siswa.</h1>
          </div>
          <span className="data-note">
            <Download size={15} /> Export dan print tersedia di toolbar tabel
          </span>
        </div>
        {!hasSupabase && (
          <p className="data-note mode-note">
            Mode lokal: data hanya tersimpan di browser ini.
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-card report-card">
          {loading ? (
            <p className="table-message">Memuat laporan...</p>
          ) : (
            <Suspense
              fallback={
                <p className="table-message">Menyiapkan tabel laporan...</p>
              }
            >
              <ReportTable reports={reports} onDelete={deleteReport} />
            </Suspense>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
function ReportAttachment({ attachment }) {
  const label = attachment.file_name || "Lampiran laporan";
  if (!attachment.url) {
    return (
      <div className="attachment-item attachment-unavailable">
        <FileText size={18} />
        <span>{label}</span>
      </div>
    );
  }
  if (attachment.mime_type?.startsWith("image/")) {
    return (
      <a
        className="attachment-item attachment-image"
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
      >
        <img src={attachment.url} alt={label} loading="lazy" />
        <span>{label}</span>
      </a>
    );
  }
  if (attachment.mime_type?.startsWith("video/")) {
    return (
      <div className="attachment-item attachment-media">
        <video controls preload="metadata">
          <source src={attachment.url} type={attachment.mime_type} />
          Browser tidak mendukung pemutaran video ini.
        </video>
        <span>{label}</span>
      </div>
    );
  }
  if (attachment.mime_type?.startsWith("audio/")) {
    return (
      <div className="attachment-item attachment-media">
        <audio controls preload="none">
          <source src={attachment.url} type={attachment.mime_type} />
          Browser tidak mendukung pemutaran audio ini.
        </audio>
        <span>{label}</span>
      </div>
    );
  }
  return (
    <a
      className="attachment-item attachment-download"
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
    >
      <FileText size={18} />
      <span>{label}</span>
      <Download size={16} />
    </a>
  );
}
function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports, loading, error, updateStatus, deleteReport } =
    useAdminReports();
  const report = reports.find((item) => item.id === id);
  const [status, setStatus] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [attachmentsError, setAttachmentsError] = useState("");
  useEffect(() => {
    if (report) setStatus(report.status);
  }, [report]);
  useEffect(() => {
    if (!report) return;
    let active = true;
    const loadAttachments = async () => {
      setAttachmentsLoading(true);
      setAttachmentsError("");
      if (!hasSupabase) {
        setAttachments(report.attachments || []);
        setAttachmentsLoading(false);
        return;
      }
      const supabase = await getSupabase();
      const { data, error: queryError } = await supabase
        .from("report_attachments")
        .select("id, file_name, file_path, mime_type, file_size")
        .eq("report_id", report.id)
        .order("created_at", { ascending: true });
      if (queryError) throw queryError;
      const filesWithUrls = await Promise.all(
        (data || []).map(async (attachment) => {
          const { data: signedFile, error: signedError } =
            await supabase.storage
              .from("report-attachments")
              .createSignedUrl(attachment.file_path, 60 * 60);
          if (signedError) throw signedError;
          return { ...attachment, url: signedFile.signedUrl };
        }),
      );
      if (active) setAttachments(filesWithUrls);
    };
    loadAttachments()
      .catch((attachmentError) => {
        console.error("Gagal memuat lampiran laporan:", attachmentError);
        if (active)
          setAttachmentsError("Lampiran tidak dapat dimuat saat ini.");
      })
      .finally(() => {
        if (active) setAttachmentsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [report?.id]);
  const message = generateWhatsAppMessage(
    { ...report, status },
    defaultTemplate,
  );
  return (
    <AdminLayout>
      {!report ? (
        <div className="admin-page">
          <Link className="back-link" to="/admin/laporan">
            ← Kembali ke laporan
          </Link>
          <div className="empty-admin">
            <FileText size={28} />
            <h2>
              {loading ? "Memuat laporan..." : "Laporan tidak ditemukan."}
            </h2>
            {error && <p>{error}</p>}
          </div>
        </div>
      ) : (
        <div className="admin-page detail-page">
          <Link className="back-link" to="/admin/laporan">
            ← Kembali ke laporan
          </Link>
          <div className="detail-header">
            <div>
              <p className="kicker">{report.report_code}</p>
              <h1>{report.reporter_name}</h1>
              <p>
                {report.reporter_class} · dibuat{" "}
                {new Date(report.created_at).toLocaleString("id-ID")}
              </p>
            </div>
            <span className={`status ${status.toLowerCase()}`}>{status}</span>
          </div>
          <div className="detail-grid">
            <div className="admin-card detail-card">
              <h3>Identitas pelapor</h3>
              <dl>
                <dt>Nama</dt>
                <dd>{report.reporter_name}</dd>
                <dt>Kelas</dt>
                <dd>{report.reporter_class}</dd>
                <dt>Status</dt>
                <dd>{report.reporter_status}</dd>
                <dt>WhatsApp</dt>
                <dd>{report.reporter_phone}</dd>
              </dl>
              <h3>Kejadian</h3>
              <dl>
                <dt>Jenis</dt>
                <dd>{report.incident_types.join(", ")}</dd>
                <dt>Waktu</dt>
                <dd>
                  {report.incident_date} · {report.incident_time}
                </dd>
                <dt>Lokasi</dt>
                <dd>{report.incident_location}</dd>
                <dt>Masih berlangsung</dt>
                <dd>{report.is_ongoing ? "Ya" : "Tidak"}</dd>
              </dl>
              <h3>Kronologi</h3>
              <p className="description">{report.description}</p>
              <h3>Lampiran</h3>
              {attachmentsLoading ? (
                <p className="description">Memuat lampiran...</p>
              ) : attachmentsError ? (
                <p className="description" role="alert">
                  {attachmentsError}
                </p>
              ) : attachments.length ? (
                <div className="attachment-grid">
                  {attachments.map((attachment) => (
                    <ReportAttachment
                      key={attachment.id || attachment.file_path}
                      attachment={attachment}
                    />
                  ))}
                </div>
              ) : (
                <p className="description">Belum ada lampiran.</p>
              )}
            </div>
            <aside className="action-panel">
              <h3>Tindakan berikutnya</h3>
              <p>
                Hubungi pelapor untuk memastikan situasi dan menentukan langkah
                konsultasi.
              </p>
              <button
                className="button whatsapp"
                onClick={() => openWhatsApp(report.reporter_phone, message)}
              >
                <MessageCircle size={18} />
                Tangani via WhatsApp
              </button>
              <label className="field">
                <span>Perbarui status</span>
                <select
                  value={status}
                  onChange={async (event) => {
                    const nextStatus = event.target.value;
                    if (await updateStatus(report.id, nextStatus))
                      setStatus(nextStatus);
                  }}
                >
                  <option>Baru</option>
                  <option>Ditangani</option>
                  <option>Selesai</option>
                </select>
              </label>
              <button
                className="button danger-button"
                type="button"
                disabled={deleting}
                onClick={async () => {
                  if (!window.confirm("Hapus laporan ini beserta lampirannya?"))
                    return;
                  setDeleting(true);
                  if (await deleteReport(report.id)) {
                    navigate("/admin/laporan", { replace: true });
                  } else {
                    setDeleting(false);
                  }
                }}
              >
                <Trash2 size={17} />
                {deleting ? "Menghapus..." : "Hapus laporan"}
              </button>
            </aside>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
function GuruBk() {
  const [admins, setAdmins] = useState(hasSupabase ? [] : demoAdmins);
  const [showInvite, setShowInvite] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [invite, setInvite] = useState({ full_name: "", email: "", phone: "" });
  const [editProfile, setEditProfile] = useState({
    full_name: "",
    phone: "",
    new_password: "",
    confirm_password: "",
  });
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviting, setInviting] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  useEffect(() => {
    if (!hasSupabase) return;
    let active = true;
    const loadAdmins = async () => {
      const supabase = await getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, is_admin")
        .eq("is_admin", true);
      if (!active) return;
      if (error) throw error;
      setAdmins(
        (data || []).map((admin) => ({
          ...admin,
          initials: (admin.full_name || "BK").slice(0, 2).toUpperCase(),
          is_current: admin.id === user?.id,
        })),
      );
    };
    loadAdmins().catch((error) => {
      console.error("Gagal memuat daftar Guru BK:", error);
    });
    return () => {
      active = false;
    };
  }, []);
  const openSelfEditor = (admin) => {
    if (!admin.is_current) return;
    setEditProfile({
      full_name: admin.full_name || "",
      phone: admin.phone || "",
      new_password: "",
      confirm_password: "",
    });
    setEditError("");
    setEditSuccess("");
    setShowEdit(true);
  };
  const saveSelfEdit = async (event) => {
    event.preventDefault();
    setEditError("");
    setEditSuccess("");
    if (!editProfile.full_name.trim()) {
      setEditError("Nama lengkap wajib diisi.");
      return;
    }
    if (editProfile.new_password && editProfile.new_password.length < 8) {
      setEditError("Password baru minimal 8 karakter.");
      return;
    }
    if (editProfile.new_password !== editProfile.confirm_password) {
      setEditError("Konfirmasi password baru tidak sama.");
      return;
    }

    setSavingEdit(true);
    try {
      const supabase = hasSupabase ? await getSupabase() : null;
      let currentAdmin;
      if (supabase) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("Sesi admin tidak ditemukan.");
        currentAdmin = admins.find((admin) => admin.id === user.id);
        if (!currentAdmin)
          throw new Error("Akun ini bukan admin yang dapat diedit.");

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: editProfile.full_name.trim(),
            phone: editProfile.phone.trim() || null,
          })
          .eq("id", user.id);
        if (profileError) throw profileError;
        if (editProfile.new_password) {
          const { error: passwordError } = await supabase.auth.updateUser({
            password: editProfile.new_password,
          });
          if (passwordError) throw passwordError;
        }
      } else {
        currentAdmin = admins.find((admin) => admin.is_current);
        if (!currentAdmin)
          throw new Error("Akun yang sedang digunakan tidak ditemukan.");
      }

      const updatedAdmin = {
        ...currentAdmin,
        full_name: editProfile.full_name.trim(),
        phone: editProfile.phone.trim(),
        initials: editProfile.full_name.trim().slice(0, 2).toUpperCase(),
      };
      setAdmins((current) =>
        current.map((admin) =>
          admin.id === updatedAdmin.id ? updatedAdmin : admin,
        ),
      );
      setEditSuccess(
        editProfile.new_password
          ? "Profil dan password berhasil diperbarui."
          : "Profil berhasil diperbarui.",
      );
      setShowEdit(false);
      setEditProfile((current) => ({
        ...current,
        new_password: "",
        confirm_password: "",
      }));
    } catch (error) {
      console.error("Gagal memperbarui akun Guru BK:", error);
      setEditError(error.message || "Akun tidak dapat diperbarui.");
    } finally {
      setSavingEdit(false);
    }
  };
  const submitInvite = async (event) => {
    event.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    if (!hasSupabase) {
      setInviteError("Hubungkan Supabase untuk mengundang Guru BK.");
      return;
    }
    setInviting(true);
    try {
      const supabase = await getSupabase();
      const { data, error: inviteFunctionError } =
        await supabase.functions.invoke("create-teacher", { body: invite });
      if (inviteFunctionError) {
        let message = inviteFunctionError.message;
        if (inviteFunctionError.context instanceof Response) {
          const body = await inviteFunctionError.context
            .clone()
            .json()
            .catch(() => null);
          message = body?.error || message;
        }
        throw new Error(message || "Undangan gagal dikirim.");
      }
      const teacher = {
        ...data.teacher,
        initials: (data.teacher.full_name || "BK").slice(0, 2).toUpperCase(),
        is_current: false,
      };
      setAdmins((current) => [...current, teacher]);
      setInviteSuccess(`Undangan akses sudah dikirim ke ${teacher.email}.`);
      setInvite({ full_name: "", email: "", phone: "" });
      setShowInvite(false);
    } catch (error) {
      console.error("Gagal mengundang Guru BK:", error);
      setInviteError(error.message || "Undangan gagal dikirim. Coba lagi.");
    } finally {
      setInviting(false);
    }
  };
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-intro-row">
          <div>
            <p className="kicker">Akses tim</p>
            <h1>Guru BK.</h1>
          </div>
          <button
            className="button primary"
            type="button"
            onClick={() => {
              setInviteError("");
              setShowInvite(true);
            }}
          >
            <Users size={17} /> Tambah Guru BK
          </button>
        </div>
        <div className="admin-card">
          <div className="card-heading">
            <div>
              <p className="kicker">Daftar pengguna</p>
              <h3>Guru BK yang terdaftar</h3>
            </div>
            <span className="data-note">{admins.length} pengguna</span>
          </div>
          <div className="table-wrap">
            <table className="admin-native-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Nomor WhatsApp</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <div className="person-cell">
                        <span>{admin.initials}</span>
                        <b>{admin.full_name}</b>
                      </div>
                    </td>
                    <td>{admin.email}</td>
                    <td>{admin.phone}</td>
                    <td>
                      <span className="status selesai">Aktif</span>
                    </td>
                    <td>
                      {admin.is_current && (
                        <button
                          className="button quiet teacher-edit-button"
                          type="button"
                          onClick={() => openSelfEditor(admin)}
                        >
                          <KeyRound size={15} /> Edit akun saya
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {inviteSuccess && <p className="saved-message">{inviteSuccess}</p>}
        {inviteError && (
          <p className="form-error" role="alert">
            {inviteError}
          </p>
        )}
        {showInvite && (
          <div className="modal-backdrop" role="presentation">
            <section
              className="invite-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="invite-teacher-title"
            >
              <div className="card-heading">
                <div>
                  <p className="kicker">Akses tim</p>
                  <h3 id="invite-teacher-title">Undang Guru BK</h3>
                </div>
                <button
                  className="icon-button modal-close"
                  type="button"
                  aria-label="Tutup formulir undangan"
                  onClick={() => setShowInvite(false)}
                >
                  <X size={19} />
                </button>
              </div>
              <p className="card-description">
                Tautan aktivasi akun akan dikirim ke alamat email Guru BK.
              </p>
              <form className="invite-form" onSubmit={submitInvite}>
                <label className="field">
                  <span>Nama lengkap</span>
                  <input
                    required
                    maxLength="120"
                    value={invite.full_name}
                    onChange={(event) =>
                      setInvite((current) => ({
                        ...current,
                        full_name: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    value={invite.email}
                    onChange={(event) =>
                      setInvite((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span>Nomor WhatsApp (opsional)</span>
                  <input
                    type="tel"
                    value={invite.phone}
                    onChange={(event) =>
                      setInvite((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </label>
                {inviteError && (
                  <p className="form-error" role="alert">
                    {inviteError}
                  </p>
                )}
                <div className="invite-actions">
                  <button
                    className="button quiet"
                    type="button"
                    onClick={() => setShowInvite(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="button primary"
                    type="submit"
                    disabled={inviting}
                  >
                    {inviting ? "Mengirim undangan..." : "Kirim undangan"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
        {editSuccess && <p className="saved-message">{editSuccess}</p>}
        {showEdit && (
          <div className="modal-backdrop" role="presentation">
            <section
              className="invite-modal account-edit-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-account-title"
            >
              <div className="card-heading">
                <div>
                  <p className="kicker">Akun saya</p>
                  <h3 id="edit-account-title">Edit profil Guru BK</h3>
                </div>
                <button
                  className="icon-button modal-close"
                  type="button"
                  aria-label="Tutup edit akun"
                  onClick={() => setShowEdit(false)}
                >
                  <X size={19} />
                </button>
              </div>
              <form className="account-edit-form" onSubmit={saveSelfEdit}>
                <label className="field">
                  <span>Nama lengkap</span>
                  <input
                    required
                    maxLength="120"
                    value={editProfile.full_name}
                    onChange={(event) =>
                      setEditProfile((current) => ({
                        ...current,
                        full_name: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span>Email akun</span>
                  <input
                    value={
                      admins.find((admin) => admin.is_current)?.email || ""
                    }
                    disabled
                  />
                  <small>Email dikelola melalui pengaturan autentikasi.</small>
                </label>
                <label className="field">
                  <span>Nomor WhatsApp</span>
                  <input
                    type="tel"
                    value={editProfile.phone}
                    onChange={(event) =>
                      setEditProfile((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </label>
                <div className="account-password-section">
                  <h4>Ganti password</h4>
                  <p>Kosongkan jika tidak ingin mengubah password.</p>
                  <label className="field">
                    <span>Password baru</span>
                    <input
                      type="password"
                      minLength="8"
                      autoComplete="new-password"
                      placeholder="Minimal 8 karakter"
                      value={editProfile.new_password}
                      onChange={(event) =>
                        setEditProfile((current) => ({
                          ...current,
                          new_password: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Ulangi password baru</span>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={editProfile.confirm_password}
                      onChange={(event) =>
                        setEditProfile((current) => ({
                          ...current,
                          confirm_password: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                {editError && (
                  <p className="form-error" role="alert">
                    {editError}
                  </p>
                )}
                <div className="invite-actions">
                  <button
                    className="button quiet"
                    type="button"
                    onClick={() => setShowEdit(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="button primary"
                    type="submit"
                    disabled={savingEdit}
                  >
                    {savingEdit ? "Menyimpan..." : "Simpan perubahan"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
function Settings() {
  const [settings, setSettings] = useState({
    school: "SMA Negeri 2 Medan",
    whatsapp: "",
    email: "bk@sman2medan.sch.id",
    template: defaultTemplate,
  });
  const [saved, setSaved] = useState(false);
  const update = (key, value) =>
    setSettings((current) => ({ ...current, [key]: value }));
  const saveSettings = async () => {
    if (hasSupabase) {
      const supabase = await getSupabase();
      await supabase.from("site_settings").upsert(
        [
          { key: "school", value: { name: settings.school } },
          {
            key: "bk_contact",
            value: { whatsapp: settings.whatsapp, email: settings.email },
          },
          { key: "whatsapp_template", value: { body: settings.template } },
        ],
        { onConflict: "key" },
      );
    }
    setSaved(true);
  };
  const previewReport = { ...demoReports[0], status: "Baru" };
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-intro-row">
          <div>
            <p className="kicker">Pusat konfigurasi</p>
            <h1>Pengaturan.</h1>
          </div>
          <button className="button primary" onClick={saveSettings}>
            <Save size={17} /> Simpan perubahan
          </button>
        </div>
        <div className="settings-grid">
          <div className="admin-card settings-form">
            <div className="card-heading">
              <div>
                <p className="kicker">Identitas layanan</p>
                <h3>Informasi sekolah dan BK</h3>
              </div>
            </div>
            <label className="field">
              <span>Nama sekolah</span>
              <input
                value={settings.school}
                onChange={(event) => update("school", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Nomor WhatsApp BK</span>
              <input
                value={settings.whatsapp}
                onChange={(event) => update("whatsapp", event.target.value)}
                placeholder="628xxxxxxxxxx"
              />
            </label>
            <label className="field">
              <span>Email BK</span>
              <input
                type="email"
                value={settings.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Template pesan WhatsApp</span>
              <textarea
                className="template-input"
                value={settings.template}
                onChange={(event) => update("template", event.target.value)}
              />
            </label>
            <div className="variable-list">
              <b>Variable tersedia</b>
              <span>{"{{nama}}"}</span>
              <span>{"{{kelas}}"}</span>
              <span>{"{{nomor_laporan}}"}</span>
              <span>{"{{jenis}}"}</span>
              <span>{"{{tanggal}}"}</span>
              <span>{"{{lokasi}}"}</span>
            </div>
          </div>
          <div className="admin-card message-preview">
            <div className="card-heading">
              <div>
                <p className="kicker">Preview</p>
                <h3>Pesan yang dikirim</h3>
              </div>
              <MessageCircle size={21} />
            </div>
            <pre>
              {generateWhatsAppMessage(previewReport, settings.template)}
            </pre>
            <p className="preview-note">
              Perubahan template akan disimpan ke `site_settings` saat Supabase
              terhubung.
            </p>
          </div>
        </div>
        {saved && (
          <p className="saved-message settings-saved">
            <CheckCircle2 size={16} /> Pengaturan berhasil disimpan.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
function AdminSimple({ title, text }) {
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-card empty-admin">
          <Users size={32} />
          <h2>{title}</h2>
          <p>{text}</p>
          <button className="button primary">
            Tambah data <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
export default function App() {
  const location = useLocation();
  useEffect(() => {
    const isAdmin = location.pathname.startsWith("/admin");
    const metadata = isAdmin
      ? {
          title: "Portal Guru BK | SI LABU SMA Negeri 2 Medan",
          description:
            "Portal Guru BK untuk mengelola laporan bullying siswa SMA Negeri 2 Medan.",
        }
      : location.pathname === "/lapor"
        ? {
            title: "Buat Laporan Bullying | SI LABU SMA Negeri 2 Medan",
            description:
              "Sampaikan laporan bullying kepada Guru BK SMA Negeri 2 Medan melalui SI LABU.",
          }
        : location.pathname === "/tentang"
          ? {
              title: "Tentang SI LABU | Sistem Informasi Laporan Bullying",
              description:
                "Kenali SI LABU, sistem informasi laporan bullying untuk siswa SMA Negeri 2 Medan.",
            }
          : {
              title:
                "SI LABU | Sistem Informasi Laporan Bullying SMA Negeri 2 Medan",
              description:
                "Saluran resmi bagi siswa SMA Negeri 2 Medan untuk menyampaikan laporan bullying langsung kepada Guru BK.",
            };
    document.title = metadata.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", metadata.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", metadata.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", metadata.description);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute("content", isAdmin ? "noindex,nofollow" : "index,follow");
  }, [location.pathname]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lapor" element={<ReportForm />} />
      <Route path="/tentang" element={<About />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/laporan" element={<Reports />} />
      <Route path="/admin/laporan/:id" element={<Detail />} />
      <Route path="/admin/guru-bk" element={<GuruBk />} />
      <Route path="/admin/pengaturan" element={<Settings />} />
    </Routes>
  );
}
