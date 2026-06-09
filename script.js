// ── CONFIGURAÇÃO DE LABELS DOS MESES COMPARATIVOS ────────────────────────
const mesesComp = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];

// Dados de Volumetria Alinhados (Total Geral: 1.979)
const volume2025 = [241, 230, 163, 197, 201]; // Soma exata: 1.031
const volume2026 = [200, 129, 163, 225, 229]; // Soma exata: 948

// SLA Mensal Isolado para o período Jan-Mai
const sla2025 = [48.2, 51.7, 44.2, 38.6, 53.2];
const sla2026 = [53.5, 47.3, 51.7, 45.6, 48.9];

// Satisfação Mensal Isolada para o período Jan-Mai
const sat2025 = [4.82, 4.87, 4.87, 4.88, 4.87];
const sat2026 = [4.89, 4.79, 4.91, 4.89, 4.91];

// ── ESTRUTURAÇÃO DAS CATEGORIAS (2025 x 2026) ───────────────────────────
const categorias = [
  "Acesso",
  "Suporte",
  "Impressora",
  "PipeRun",
  "Shop 9",
  "E-mail",
  "Telefonia",
  "SAP",
];
const cat2025 = [382, 260, 82, 72, 65, 45, 30, 28];
const cat2026 = [333, 238, 70, 62, 57, 38, 28, 21];

// ── ESTRUTURAÇÃO DAS UNIDADES (2025 x 2026) ─────────────────────────────
const unidades = [
  "Fast Sistemas",
  "Ramos",
  "Recife",
  "Realengo-RJ",
  "Curicica",
  "Juiz de Fora",
  "Nova Iguaçu",
];
const uni2025 = [650, 26, 22, 20, 19, 18, 15];
const uni2026 = [610, 22, 19, 18, 16, 15, 14];

// ── 🎯 LISTA DE ASSUNTOS CONSOLIDADA E AGRUPADA POR SISTEMAS ──────────────
const assuntos = [
  "Acesso > E-mail / Configuração",
  "Acesso > SAP",
  "Acesso > Sults",
  "Acesso > Novos Colaboradores",
  "Suporte > Programas Diversos",
  "Suporte > Software",
  "Suporte > Notebook / Desktop",
  "Suporte > Rede / Internet",
  "PipeRun > Acesso e Suporte",
  "Impressora > Instalação / Toner",
  "Shop 9 > Acessos / Certificados",
  "Telefonia > Nova linha",
  "Banco de Dados / SQL",
  "Drive de rede",
  "Página do Vendedor",
  "[Infra] - Problemas Físicos",
  "Outros Assuntos",
];

// Valores consolidados mantendo a simetria exata matemática (1.031 x 948)
const ass2025 = [
  232, // E-mail (180 + 52)
  157, // SAP
  44, // Sults
  104, // Novos Colaboradores (19 + 85)
  81, // Programas Diversos
  66, // Software
  45, // Notebook / Desktop
  14, // Rede / Internet
  52, // PipeRun (48 + 4)
  80, // Impressora (50 + 25 + 5)
  16, // Shop 9 (2 + 3 + 11)
  12, // Telefonia
  10, // SQL
  6, // Drive
  3, // Vendedor
  73, // Infra
  41, // Antigo (vazio) -> Outros Assuntos
];

const ass2026 = [
  124, // E-mail (98 + 26)
  139, // SAP
  153, // Sults
  218, // Novos Colaboradores (151 + 67)
  93, // Programas Diversos
  41, // Software
  65, // Notebook / Desktop
  11, // Rede / Internet
  69, // PipeRun (67 + 2)
  77, // Impressora (49 + 24 + 4)
  25, // Shop 9 (7 + 5 + 13)
  10, // Telefonia
  9, // SQL
  5, // Drive
  2, // Vendedor
  127, // Infra
  113, // Antigo (vazio) -> Outros Assuntos
];

// ── RESPONSÁVEIS (Consolidado Jan-Mai) ───────────────────────────────────
const responsaveis = [
  { nome: "Wiclem Lopes Da Silva", total: 682, nota: 4.85, noPrazo: 385 },
  { nome: "Marcos Barros", total: 576, nota: 4.88, noPrazo: 312 },
  { nome: "Christian Wyterlin Silveira", total: 372, nota: 4.8, noPrazo: 161 },
  { nome: "Danielly Cavalieri", total: 130, nota: 4.86, noPrazo: 49 },
  { nome: "Eduardo Alves", total: 95, nota: 4.92, noPrazo: 38 },
  { nome: "Marcelo Lopes", total: 92, nota: 4.83, noPrazo: 52 },
  { nome: "Tiago Gomes", total: 26, nota: 4.92, noPrazo: 12 },
  { nome: "Plinio Bellas", total: 6, nota: 5.0, noPrazo: 1 },
];

// ── PLUGINS E PADRÕES VISUAIS ───────────────────────────────────────────
Chart.defaults.color = "#7380a0";
Chart.defaults.font.family = "'Source Sans 3', sans-serif";
const grid = "rgba(255,255,255,0.06)";

// PLUGIN RECALIBRADO: Texto escurecido (branco puro) e com sombra para máxima leitura
const datalabelPlugin = {
  id: "datalabel",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden || chart.config.type === "line") return;
      meta.data.forEach((bar, i) => {
        const v = ds.data[i];
        if (v == null) return;
        ctx.save();
        ctx.font = 'bold 11px "Source Sans 3", sans-serif';
        ctx.fillStyle = "#ffffff"; // Escurecido/Clareado para contraste máximo
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)"; // Sombra projetada para destacar o número
        ctx.shadowBlur = 4;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(v, bar.x, bar.y - 4);
        ctx.restore();
      });
    });
  },
};

// ── 1. GRÁFICO: VOLUME DE CHAMADOS (COMPARATIVO AGRUPADO) ────────────────
new Chart(document.getElementById("chartEvolucao"), {
  type: "bar",
  plugins: [datalabelPlugin],
  data: {
    labels: mesesComp,
    datasets: [
      {
        label: "Ano 2025",
        data: volume2025,
        backgroundColor: "rgba(126,170,223,0.75)",
        borderColor: "#7eaadf",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Ano 2026",
        data: volume2026,
        backgroundColor: "rgba(46,78,140,0.85)",
        borderColor: "#2e4e8c",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: {
      x: { grid: { color: grid } },
      y: { grid: { color: grid }, beginAtZero: true },
    },
  },
});

// ── 2. GRÁFICO: CATEGORIAS COMPARATIVAS ──────────────────────────────────
new Chart(document.getElementById("chartCategoria"), {
  type: "bar",
  data: {
    labels: categorias,
    datasets: [
      {
        label: "2025",
        data: cat2025,
        backgroundColor: "#5d8ec7",
        borderRadius: 3,
      },
      {
        label: "2026",
        data: cat2026,
        backgroundColor: "#2e4e8c",
        borderRadius: 3,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { grid: { color: grid } }, y: { grid: { display: false } } },
  },
});

// ── 3. GRÁFICO: SLA COMPARATIVO (DUAS LINHAS SOBREPOSTAS) ─────────────────
new Chart(document.getElementById("chartSLA"), {
  type: "line",
  data: {
    labels: mesesComp,
    datasets: [
      {
        label: "SLA 2025",
        data: sla2025,
        borderColor: "#7eaadf",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: "SLA 2026",
        data: sla2026,
        borderColor: "#52b899",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: "Meta 60%",
        data: Array(5).fill(60),
        borderColor: "rgba(224,112,112,0.4)",
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: grid } },
      y: {
        grid: { color: grid },
        min: 30,
        max: 70,
        ticks: { callback: (v) => v + "%" },
      },
    },
  },
});

// ── 4. GRÁFICO: SATISFAÇÃO COMPARATIVA (DUAS LINHAS) ─────────────────────
new Chart(document.getElementById("chartSat"), {
  type: "line",
  data: {
    labels: mesesComp,
    datasets: [
      {
        label: "Nota 2025",
        data: sat2025,
        borderColor: "#d4a84b",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Nota 2026",
        data: sat2026,
        borderColor: "#a0c4e8",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: grid } },
      y: {
        grid: { color: grid },
        min: 4.6,
        max: 5.0,
        ticks: { callback: (v) => v.toFixed(2) },
      },
    },
  },
});

// ── 5. GRÁFICO: UNIDADES COMPARATIVAS ────────────────────────────────────
new Chart(document.getElementById("chartUnidade"), {
  type: "bar",
  data: {
    labels: unidades,
    datasets: [
      {
        label: "2025",
        data: uni2025,
        backgroundColor: "#4a7fc1",
        borderRadius: 3,
      },
      {
        label: "2026",
        data: uni2026,
        backgroundColor: "#e07070",
        borderRadius: 3,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { grid: { color: grid } }, y: { grid: { color: grid } } },
  },
});

// ── 6. GRÁFICO: ASSUNTOS CONSOLIDADOS (17 CATEGORIAS PERFEITAS E VISÍVEIS) ──
new Chart(document.getElementById("chartAssunto"), {
  type: "bar",
  plugins: [datalabelPlugin],
  data: {
    labels: assuntos,
    datasets: [
      {
        label: "Ano 2025",
        data: ass2025,
        backgroundColor: "rgba(126,170,223,0.75)",
        borderRadius: 4,
      },
      {
        label: "Ano 2026",
        data: ass2026,
        backgroundColor: "rgba(46,78,140,0.85)",
        borderRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: grid },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { size: 9, weight: "bold" },
        },
      },
      y: {
        grid: { color: grid },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});

// ── POPULAÇÃO DA TABELA DE PERFORMANCE ───────────────────────────────────
const maxTotal = Math.max(...responsaveis.map((r) => r.total));
const tbody = document.getElementById("respBody");

responsaveis.forEach((r) => {
  const pct = ((r.noPrazo / r.total) * 100).toFixed(1);
  const slaCls = pct >= 60 ? "sla-high" : pct >= 50 ? "sla-mid" : "sla-low";
  const barW = Math.round((r.total / maxTotal) * 100);
  const stars =
    "★".repeat(Math.round(r.nota)) + "☆".repeat(5 - Math.round(r.nota));

  tbody.insertAdjacentHTML(
    "beforeend",
    `
    <tr>
      <td class="name-cell">${r.nome}</td>
      <td><strong>${r.total}</strong></td>
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
