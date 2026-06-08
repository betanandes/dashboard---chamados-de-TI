// ── DATA ─────────────────────────────────────────────────────────────────
const meses = [
  "Jan/25",
  "Fev/25",
  "Mar/25",
  "Abr/25",
  "Mai/25",
  "Jun/25",
  "Jul/25",
  "Ago/25",
  "Set/25",
  "Out/25",
  "Nov/25",
  "Dez/25",
  "Jan/26",
  "Fev/26",
  "Mar/26",
  "Abr/26",
  "Mai/26",
];
const totalMes = [
  11, 230, 163, 197, 201, 132, 195, 187, 221, 238, 212, 151, 200, 129, 163, 225,
  229,
];
const slaMes = [
  45.5, 51.7, 44.2, 38.6, 53.2, 47.7, 51.3, 66.3, 55.7, 51.3, 54.2, 51.0, 54.0,
  47.3, 51.5, 45.8, 48.9,
];
const satMes = [
  5.0, 4.87, 4.87, 4.88, 4.87, 4.88, 4.83, 4.9, 4.78, 4.81, 4.72, 4.69, 4.9,
  4.79, 4.91, 4.89, 4.91,
];
const categorias = [
  "Acesso",
  "Suporte",
  "Impressora",
  "PipeRun",
  "Shop 9",
  "E-mail",
  "Telefonia",
  "SAP",
  "Drive de rede",
  "Sults",
];
const catTotais = [1122, 774, 232, 213, 195, 126, 90, 73, 47, 43];
const unidades = [
  "Fast Sistemas",
  "Ramos",
  "Recife",
  "Realengo-RJ",
  "Curicica",
  "Juiz de Fora",
  "Caxias/Jd Prim.",
  "Feira de Santana",
  "Nova Iguaçu",
  "Centro RJ",
];
const uniTotais = [1972, 74, 68, 58, 57, 56, 52, 50, 48, 47];
const assuntos = [
  "Acesso > SAP",
  "Acesso > E-mail",
  "Suporte > Programas Diversos",
  "Acesso > Sults",
  "Suporte > Software",
  "Suporte > Notebook/Desktop",
  "E-mail > Config. de E-mail",
  "PipeRun > Suporte",
  "Suporte > Hardware",
  "Impressora > Reparo",
  "Acesso > Novos Colaboradores",
  "PipeRun > Suporte PipeRun",
];
const assuntoTotais = [435, 402, 273, 179, 171, 163, 121, 120, 107, 94, 92, 88];
const responsaveis = [
  { nome: "Wiclem Lopes", total: 1055, nota: 4.84, noPrazo: 596 },
  { nome: "Marcos Barros", total: 906, nota: 4.89, noPrazo: 492 },
  { nome: "Christian Silveira", total: 584, nota: 4.76, noPrazo: 252 },
  { nome: "Danielly Cavalieri", total: 197, nota: 4.85, noPrazo: 74 },
  { nome: "Eduardo Alves", total: 147, nota: 4.9, noPrazo: 60 },
  { nome: "Marcelo Lopes", total: 144, nota: 4.82, noPrazo: 81 },
  { nome: "Tiago Gomes", total: 33, nota: 4.95, noPrazo: 15 },
  { nome: "Plinio Bellas", total: 7, nota: 5.0, noPrazo: 1 },
];

// ── CHART DEFAULTS ────────────────────────────────────────────────────────
Chart.defaults.color = "#7380a0";
Chart.defaults.font.family = "'Source Sans 3', Georgia, sans-serif";
Chart.defaults.font.size = 12;
const grid = "rgba(255,255,255,0.06)";

// paleta executiva
const palette = [
  "#7eaadf",
  "#5d8ec7",
  "#4a7fc1",
  "#a0c4e8",
  "#e07070",
  "#52b899",
  "#d4a84b",
  "#9d7fd4",
  "#6bbfa4",
  "#d49a70",
];

// ── 1. EVOLUÇÃO MENSAL (Jan-Mai comparativo) ──────────────────────────────
const mesesComp = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];
const dados2025 = [11, 230, 163, 197, 201];
const dados2026 = [200, 129, 163, 225, 229];

// Inline datalabel plugin
const datalabelPlugin = {
  id: "datalabel",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      meta.data.forEach((bar, i) => {
        const v = ds.data[i];
        if (v == null) return;
        ctx.save();
        ctx.font = 'bold 12px "Source Sans 3", Georgia, sans-serif';
        ctx.fillStyle = "#e8edf5";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(v, bar.x, bar.y - 4);
        ctx.restore();
      });
    });
  },
};

new Chart(document.getElementById("chartEvolucao"), {
  type: "bar",
  plugins: [datalabelPlugin],
  data: {
    labels: mesesComp,
    datasets: [
      {
        label: "2025",
        data: dados2025,
        backgroundColor: "rgba(126,170,223,0.75)",
        borderColor: "#7eaadf",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "2026",
        data: dados2026,
        backgroundColor: "rgba(46,78,140,0.80)",
        borderColor: "#2e4e8c",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 24 } },
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, padding: 24, font: { size: 12 } },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          afterBody: (items) => {
            const a = items[0]?.parsed.y || 0;
            const b = items[1]?.parsed.y || 0;
            if (a && b) {
              const diff = (((b - a) / a) * 100).toFixed(0);
              return [`Variação: ${diff > 0 ? "+" : ""}${diff}%`];
            }
          },
        },
      },
    },
    scales: {
      x: { grid: { color: grid } },
      y: {
        grid: { color: grid },
        beginAtZero: true,
        title: {
          display: true,
          text: "Nº de Chamados",
          color: "#7380a0",
          font: { size: 11 },
        },
      },
    },
  },
});

// ── 2. CATEGORIAS ─────────────────────────────────────────────────────────
new Chart(document.getElementById("chartCategoria"), {
  type: "bar",
  data: {
    labels: categorias,
    datasets: [
      {
        label: "Chamados",
        data: catTotais,
        backgroundColor: palette.map((c) => c + "cc"),
        borderColor: palette,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} chamados` } },
    },
    scales: {
      x: { grid: { color: grid }, beginAtZero: true },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  },
});

// ── 3. SLA ────────────────────────────────────────────────────────────────
new Chart(document.getElementById("chartSLA"), {
  type: "line",
  data: {
    labels: meses,
    datasets: [
      {
        label: "% no Prazo",
        data: slaMes,
        borderColor: "#52b899",
        backgroundColor: "rgba(82,184,153,0.10)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: slaMes.map((v) =>
          v >= 60 ? "#52b899" : v >= 50 ? "#5d8ec7" : "#e07070",
        ),
        pointRadius: 5,
      },
      {
        label: "Meta 60%",
        data: Array(meses.length).fill(60),
        borderColor: "rgba(224,112,112,0.50)",
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: grid },
        ticks: { maxRotation: 45, font: { size: 10 } },
      },
      y: {
        grid: { color: grid },
        min: 30,
        max: 80,
        ticks: { callback: (v) => v + "%" },
      },
    },
  },
});

// ── 4. SATISFAÇÃO ─────────────────────────────────────────────────────────
new Chart(document.getElementById("chartSat"), {
  type: "line",
  data: {
    labels: meses,
    datasets: [
      {
        label: "Nota Média",
        data: satMes,
        borderColor: "#d4a84b",
        backgroundColor: "rgba(212,168,75,0.10)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#d4a84b",
        pointRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => ` Nota: ${ctx.parsed.y.toFixed(2)}` },
      },
    },
    scales: {
      x: {
        grid: { color: grid },
        ticks: { maxRotation: 45, font: { size: 10 } },
      },
      y: {
        grid: { color: grid },
        min: 4.5,
        max: 5.1,
        ticks: { callback: (v) => v.toFixed(1) },
      },
    },
  },
});

// ── 5. UNIDADES ───────────────────────────────────────────────────────────
new Chart(document.getElementById("chartUnidade"), {
  type: "doughnut",
  data: {
    labels: unidades,
    datasets: [
      {
        data: uniTotais,
        backgroundColor: palette,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 10,
          font: { size: 10 },
          boxWidth: 8,
        },
      },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` },
      },
    },
    cutout: "60%",
  },
});

// ── 6. ASSUNTOS ───────────────────────────────────────────────────────────
new Chart(document.getElementById("chartAssunto"), {
  type: "bar",
  data: {
    labels: assuntos,
    datasets: [
      {
        label: "Chamados",
        data: assuntoTotais,
        backgroundColor: "rgba(126,170,223,0.55)",
        borderColor: "#7eaadf",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: grid },
        ticks: { maxRotation: 40, font: { size: 10 } },
      },
      y: { grid: { color: grid }, beginAtZero: true },
    },
  },
});

// ── TABELA RESPONSÁVEIS ───────────────────────────────────────────────────
const maxTotal = Math.max(...responsaveis.map((r) => r.total));
const tbody = document.getElementById("respBody");
responsaveis.forEach((r) => {
  const pct = ((r.noPrazo / r.total) * 100).toFixed(0);
  const slaCls = pct >= 60 ? "sla-high" : pct >= 50 ? "sla-mid" : "sla-low";
  const barW = Math.round((r.total / maxTotal) * 100);
  const stars =
    "★".repeat(Math.round(r.nota)) + "☆".repeat(5 - Math.round(r.nota));
  tbody.insertAdjacentHTML(
    "beforeend",
    `
    <tr>
      <td class="name-cell">${r.nome}</td>
      <td><strong>${r.total.toLocaleString("pt-BR")}</strong></td>
      <td class="bar-cell">
        <div class="mini-bar-wrap"><div class="mini-bar" style="width:${barW}%"></div></div>
      </td>
      <td class="star-cell">${stars} <span style="color:var(--muted);font-size:11px;">${r.nota.toFixed(2)}</span></td>
      <td style="color:var(--text2)">${r.noPrazo}</td>
      <td><span class="sla-badge ${slaCls}">${pct}%</span></td>
    </tr>
  `,
  );
});
