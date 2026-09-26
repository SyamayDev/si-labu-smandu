import { useEffect, useRef } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt";
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.html5.mjs";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-buttons/js/buttons.colVis.mjs";

DataTable.use(DT);

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
}

export default function ReportTable({ reports, onDelete }) {
  const shellRef = useRef(null);
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !onDelete) return;
    const handleDelete = async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("[data-delete-report]");
      if (!button || !shell.contains(button)) return;
      const reportId = button.getAttribute("data-delete-report");
      if (
        !reportId ||
        !window.confirm("Hapus laporan ini beserta lampirannya?")
      )
        return;
      button.setAttribute("disabled", "true");
      const deleted = await onDelete(reportId);
      if (!deleted) button.removeAttribute("disabled");
    };
    shell.addEventListener("click", handleDelete);
    return () => shell.removeEventListener("click", handleDelete);
  }, [onDelete]);

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
      render: (data) => {
        const detail = `<a class="table-action" href="/admin/laporan/${escapeHtml(data)}" aria-label="Lihat detail laporan">Detail <span aria-hidden="true">›</span></a>`;
        const remove = onDelete
          ? `<button class="table-delete" type="button" data-delete-report="${escapeHtml(data)}" aria-label="Hapus laporan">Hapus</button>`
          : "";
        return `<div class="table-actions">${detail}${remove}</div>`;
      },
    },
  ];

  return (
    <div className="datatable-shell" ref={shellRef}>
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
              buttons: [
                "copy",
                "csv",
                {
                  extend: "excelHtml5",
                  action: async function (...args) {
                    const { default: JSZip } = await import("jszip");
                    window.JSZip = JSZip;
                    DT.ext.buttons.excelHtml5.action.apply(this, args);
                  },
                },
                {
                  extend: "pdfHtml5",
                  action: async function (...args) {
                    const [pdfModule, fontModule] = await Promise.all([
                      import("pdfmake/build/pdfmake"),
                      import("pdfmake/build/vfs_fonts"),
                    ]);
                    const pdfMake = pdfModule.default;
                    pdfMake.vfs = fontModule.default.vfs;
                    window.pdfMake = pdfMake;
                    DT.ext.buttons.pdfHtml5.action.apply(this, args);
                  },
                },
                "print",
                "colvis",
              ],
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
