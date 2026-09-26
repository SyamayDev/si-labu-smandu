import { useEffect, useState } from "react";
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
  Menu,
  MessageCircle,
  Save,
  ShieldCheck,
  Upload,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.html5.mjs";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import JSZip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { incidentOptions, validateReport } from "./lib/validators";
import { generateWhatsAppMessage, openWhatsApp } from "./lib/whatsapp";
import { hasSupabase, supabase } from "./lib/supabase";

DataTable.use(DT);
pdfMake.vfs = pdfFonts.vfs;
if (typeof window !== "undefined") window.JSZip = JSZip;

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
    supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
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

  return { reports, loading, error, updateStatus };
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
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
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="kicker">
              <ShieldCheck size={16} /> Ruang aman siswa
            </p>
            <h1>
              Berani bicara.
              <br />
              <em>Kami siap mendengar.</em>
            </h1>
            <p className="hero-copy">
              SI LABU membantu siswa SMA Negeri 2 Medan menyampaikan laporan
              terkait perundungan kepada Guru BK dengan mudah dan aman.
            </p>
            <div className="hero-actions">
              <Link className="button primary" to="/lapor">
                Lapor Bully! <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="visual-ring">
              <img
                className="mascot-image"
                src="/assets/mascot/mascot.webp"
                alt="Maskot SI LABU"
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
          </motion.div>
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
  return (
    <motion.div
      className="step"
      initial={{ opacity: 0, x: Number(n) % 2 ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay: Number(n) * 0.07 }}
    >
      <img
        className="step-art"
        src={`/assets/mascot/mascot-step-${n}.webp`}
        alt=""
        aria-hidden="true"
        onError={(event) => event.currentTarget.classList.add("asset-missing")}
      />
      <span>{n}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
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
    let report;
    if (hasSupabase) {
      const { data: savedReport, error: saveError } = await supabase
        .from("reports")
        .insert(data)
        .select("*")
        .single();
      if (saveError) {
        setSubmitError(
          "Laporan belum dapat dikirim. Periksa koneksi lalu coba lagi.",
        );
        setSubmitting(false);
        return;
      }
      report = savedReport;
    } else {
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
    setSubmitting(false);
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
            Laporanmu sudah tercatat untuk ditindaklanjuti Guru BK. Simpan nomor
            laporan ini untuk referensi.
          </p>
          <div className="report-code">{submitted.report_code}</div>
          <Link className="button primary" to="/">
            Kembali ke beranda <ArrowRight size={18} />
          </Link>
        </section>
      </PublicLayout>
    );
  return (
    <PublicLayout>
      <section className="page-section container">
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
                  JPG, PNG, WEBP, MP4, MOV, MP3, WAV, M4A, atau OGG. Maksimal 25
                  MB per file.
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
  useEffect(() => setMobileMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (!hasSupabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/admin/login", { replace: true });
    });
  }, [navigate]);
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
        </header>
        {showNotice && (
          <div className="admin-notice" role="status">
            <div className="notice-icon">!</div>
            <div>
              <b>Selamat datang, Admin Guru BK</b>
              <span>Ada laporan baru yang perlu ditinjau.</span>
              <Link to="/admin/laporan/1" onClick={() => setShowNotice(false)}>
                Buka laporan LABU-2026-0001 <ChevronRight size={15} />
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
            <ReportTable reports={reports.slice(0, 5)} />
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
  const { reports, loading, error } = useAdminReports();
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
            <ReportTable reports={reports} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
function ReportTable({ reports }) {
  const tableData = reports.map((report) => [
    escapeHtml(report.report_code),
    escapeHtml(`${report.reporter_name} · ${report.reporter_class}`),
    escapeHtml((report.incident_types || []).join(", ")),
    escapeHtml(report.incident_date),
    escapeHtml(report.status),
    report.id,
  ]);
  const columns = [
    { title: "Nomor laporan", className: "report-code-cell" },
    { title: "Pelapor" },
    { title: "Jenis kejadian" },
    { title: "Tanggal" },
    {
      title: "Status",
      render: (data) => {
        const statusClass =
          { Baru: "baru", Ditangani: "ditangani", Selesai: "selesai" }[data] ||
          "";
        return `<span class="status ${statusClass}">${data}</span>`;
      },
    },
    {
      title: "Aksi",
      orderable: false,
      searchable: false,
      render: (data) =>
        `<a class="table-action" href="/admin/laporan/${escapeHtml(data)}" aria-label="Lihat detail laporan">Detail <span aria-hidden="true">›</span></a>`,
    },
  ];
  return (
    <div className="datatable-shell">
      <DataTable
        data={tableData}
        columns={columns}
        className="display si-labu-datatable"
        options={{
          responsive: true,
          pageLength: 10,
          order: [[3, "desc"]],
          autoWidth: false,
          lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "Semua"],
          ],
          layout: {
            topStart: {
              buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
            },
            topEnd: "search",
            bottomStart: "pageLength",
            bottomEnd: "paging",
          },
          language: {
            search: "Cari laporan:",
            searchPlaceholder: "Nama, nomor, kelas, jenis...",
            emptyTable: "Belum ada laporan.",
            zeroRecords: "Tidak ada laporan yang cocok.",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ laporan",
            infoEmpty: "Belum ada laporan",
            lengthMenu: "Tampilkan _MENU_",
            paginate: { previous: "Sebelumnya", next: "Berikutnya" },
          },
          filename: `SI-LABU-Rekap-Laporan-${new Date().toISOString().slice(0, 7)}`,
        }}
      />
    </div>
  );
}
function Detail() {
  const { id } = useParams();
  const { reports, loading, error, updateStatus } = useAdminReports();
  const report = reports.find((item) => item.id === id);
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (report) setStatus(report.status);
  }, [report]);
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
              <div className="attachment-placeholder">
                <FileText size={20} />
                <span>
                  <b>Lampiran</b>
                  <small>Belum ada lampiran</small>
                </span>
              </div>
            </aside>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
function GuruBk() {
  const [admins, setAdmins] = useState(demoAdmins);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!hasSupabase) return;
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, is_admin")
      .eq("is_admin", true)
      .then(({ data }) => {
        if (data?.length) {
          setAdmins(
            data.map((admin) => ({
              ...admin,
              initials: (admin.full_name || "BK").slice(0, 2).toUpperCase(),
              is_current: false,
            })),
          );
        }
      });
  }, []);
  const updatePassword = (key, value) =>
    setPasswords((valueState) => ({ ...valueState, [key]: value }));
  const savePassword = async (event) => {
    event.preventDefault();
    if (
      !passwords.current ||
      passwords.next.length < 8 ||
      passwords.next !== passwords.confirm
    )
      return;
    if (hasSupabase) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: passwords.next,
      });
      if (passwordError) return;
    }
    setSaved(true);
    setPasswords({ current: "", next: "", confirm: "" });
  };
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-intro-row">
          <div>
            <p className="kicker">Akses tim</p>
            <h1>Guru BK.</h1>
          </div>
          <button className="button primary">
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
                  <th>Akses password</th>
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
                      {admin.is_current ? (
                        <span className="current-access">Akun kamu</span>
                      ) : (
                        <span className="muted-access">
                          Dikelola pemilik akun
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="admin-card password-card">
          <div className="card-heading">
            <div>
              <p className="kicker">Keamanan akun</p>
              <h3>Ganti password saya</h3>
            </div>
            <KeyRound size={21} />
          </div>
          <p className="card-description">
            Kamu hanya dapat mengganti password akun yang sedang digunakan.
            Password Guru BK lain tidak dapat diubah dari sini.
          </p>
          <form className="password-form" onSubmit={savePassword}>
            <label className="field">
              <span>Password saat ini</span>
              <input
                type="password"
                value={passwords.current}
                onChange={(event) =>
                  updatePassword("current", event.target.value)
                }
              />
            </label>
            <label className="field">
              <span>Password baru</span>
              <input
                type="password"
                minLength="8"
                value={passwords.next}
                onChange={(event) => updatePassword("next", event.target.value)}
                placeholder="Minimal 8 karakter"
              />
            </label>
            <label className="field">
              <span>Ulangi password baru</span>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(event) =>
                  updatePassword("confirm", event.target.value)
                }
              />
            </label>
            <button className="button primary" type="submit">
              <Save size={17} /> Simpan password
            </button>
          </form>
          {saved && (
            <p className="saved-message">
              <CheckCircle2 size={16} /> Password berhasil diperbarui pada mode
              preview.
            </p>
          )}
        </div>
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
