// ── CONFIGURAÇÃO DE LABELS DOS MESES COMPARATIVOS ──────────────────────
const mesesComp = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];

const volume2025 = [241, 230, 163, 197, 201];
const volume2026 = [200, 129, 163, 225, 229];

const sla2025 = [48.2, 51.7, 44.2, 38.6, 53.2];
const sla2026 = [53.5, 47.3, 51.7, 45.6, 48.9];

const sat2025 = [4.82, 4.87, 4.87, 4.88, 4.87];
const sat2026 = [4.89, 4.79, 4.91, 4.89, 4.91];

// ── CATEGORIAS: ordenado por 2026 decrescente ───────────────────────────
const catRaw = [
  { nome: "Acesso", v2025: 382, v2026: 333 },
  { nome: "Suporte", v2025: 260, v2026: 238 },
  { nome: "Impressora", v2025: 82, v2026: 70 },
  { nome: "PipeRun", v2025: 72, v2026: 62 },
  { nome: "Shop 9", v2025: 65, v2026: 57 },
  { nome: "E-mail", v2025: 45, v2026: 38 },
  { nome: "Telefonia", v2025: 30, v2026: 28 },
  { nome: "SAP", v2025: 28, v2026: 21 },
];
// Ordenar por 2026
catRaw.sort((a, b) => b.v2026 - a.v2026);
const categorias = catRaw.map((c) => c.nome);
const cat2025 = catRaw.map((c) => c.v2025);
const cat2026 = catRaw.map((c) => c.v2026);
const catVariacao = catRaw.map((c) =>
  (((c.v2026 - c.v2025) / c.v2025) * 100).toFixed(0),
);

// ── UNIDADES ────────────────────────────────────────────────────────────
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

// ── ASSUNTOS: agrupados por categoria-mãe ───────────────────────────────
// Estrutura: { grupo, label, v2025, v2026 }
// Um item com v2025=null e v2026=null é separador de grupo
const assuntosRaw = [
  // ACESSO
  {
    grupo: "Acesso",
    label: "Acesso › Novos Colaboradores",
    v2025: 104,
    v2026: 218,
  },
  {
    grupo: "Acesso",
    label: "Acesso › E-mail / Configuração",
    v2025: 232,
    v2026: 124,
  },
  { grupo: "Acesso", label: "Acesso › Sults", v2025: 44, v2026: 153 },
  { grupo: "Acesso", label: "Acesso › SAP", v2025: 157, v2026: 139 },
  // INFRAESTRUTURA
  { grupo: "Infra", label: "Infra › Problemas Físicos", v2025: 73, v2026: 127 },
  // SUPORTE
  {
    grupo: "Suporte",
    label: "Suporte › Programas Diversos",
    v2025: 81,
    v2026: 93,
  },
  {
    grupo: "Suporte",
    label: "Suporte › Notebook / Desktop",
    v2025: 45,
    v2026: 65,
  },
  { grupo: "Suporte", label: "Suporte › Software", v2025: 66, v2026: 41 },
  {
    grupo: "Suporte",
    label: "Suporte › Rede / Internet",
    v2025: 14,
    v2026: 11,
  },
  // IMPRESSORA
  {
    grupo: "Impressora",
    label: "Impressora › Instalação / Toner",
    v2025: 80,
    v2026: 77,
  },
  // PIPERUN
  {
    grupo: "PipeRun",
    label: "PipeRun › Acesso e Suporte",
    v2025: 52,
    v2026: 69,
  },
  // SHOP 9
  {
    grupo: "Shop 9",
    label: "Shop 9 › Acessos / Certificados",
    v2025: 16,
    v2026: 25,
  },
  // TELEFONIA
  { grupo: "Telefonia", label: "Telefonia › Nova linha", v2025: 12, v2026: 10 },
  // OUTROS
  { grupo: "Outros", label: "Banco de Dados › SQL", v2025: 10, v2026: 9 },
  { grupo: "Outros", label: "Drive de rede", v2025: 6, v2026: 5 },
];

const assLabels = assuntosRaw.map((a) => a.label);
const ass2025 = assuntosRaw.map((a) => a.v2025);
const ass2026 = assuntosRaw.map((a) => a.v2026);

// Cores por grupo para identificação visual
const grupoColors = {
  Acesso: { c25: "rgba(74,127,193,0.75)", c26: "#2e4e8c" },
  Infra: { c25: "rgba(160,100,200,0.75)", c26: "#7b3fa0" },
  Suporte: { c25: "rgba(82,184,153,0.75)", c26: "#1a7a5e" },
  Impressora: { c25: "rgba(208,152,60,0.75)", c26: "#b07d2a" },
  PipeRun: { c25: "rgba(224,112,112,0.75)", c26: "#c0392b" },
  "Shop 9": { c25: "rgba(100,160,100,0.75)", c26: "#2e7d32" },
  Telefonia: { c25: "rgba(120,120,180,0.75)", c26: "#3949ab" },
  Outros: { c25: "rgba(160,160,160,0.75)", c26: "#607080" },
};

// ── RESPONSÁVEIS ────────────────────────────────────────────────────────
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

// ── PLUGINS E CONFIGURAÇÕES VISUAIS ─────────────────────────────────────
Chart.defaults.color = "#8a99ad";
Chart.defaults.font.family = "'Source Sans 3', sans-serif";
const grid = "rgba(255,255,255,0.05)";

// Plugin datalabel genérico
const smartDatalabelPlugin = {
  id: "smartDatalabel",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden || chart.config.type === "line") return;
      meta.data.forEach((bar, i) => {
        const v = ds.data[i];
        if (v === 0 || v == null) return;
        ctx.save();
        if (chart.canvas.id === "chartAssunto") {
          ctx.font = 'bold 11px "Source Sans 3", sans-serif';
          ctx.fillStyle = "#1e293b";
        } else {
          ctx.font = 'bold 10px "Source Sans 3", sans-serif';
          ctx.fillStyle = "#ffffff";
        }
        if (chart.config.options.indexAxis === "y") {
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(v, bar.x + 6, bar.y);
        } else {
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(v, bar.x, bar.y - 4);
        }
        ctx.restore();
      });
    });
  },
};

// Plugin variação % no gráfico de categorias
const variacaoPlugin = {
  id: "variacaoPlugin",
  afterDatasetsDraw(chart) {
    if (chart.canvas.id !== "chartCategoria") return;
    const { ctx } = chart;
    const meta0 = chart.getDatasetMeta(0); // 2025
    const meta1 = chart.getDatasetMeta(1); // 2026
    meta1.data.forEach((bar, i) => {
      const v25 = cat2025[i];
      const v26 = cat2026[i];
      const diff = (((v26 - v25) / v25) * 100).toFixed(0);
      const label = (diff > 0 ? "+" : "") + diff + "%";
      const color = diff > 0 ? "#c0392b" : "#1a7a5e";
      ctx.save();
      ctx.font = 'bold 10px "Source Sans 3", sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      // Posicionar após o maior valor entre 2025 e 2026
      const maxX = Math.max(meta0.data[i].x, bar.x);
      ctx.fillText(label, maxX + 32, bar.y - 7);
      ctx.restore();
    });
  },
};

// ── 1. VOLUME DE CHAMADOS ────────────────────────────────────────────────
new Chart(document.getElementById("chartEvolucao"), {
  type: "bar",
  plugins: [smartDatalabelPlugin],
  data: {
    labels: mesesComp,
    datasets: [
      {
        label: "Ano 2025",
        data: volume2025,
        backgroundColor: "rgba(93,142,199,0.8)",
        borderRadius: 3,
      },
      {
        label: "Ano 2026",
        data: volume2026,
        backgroundColor: "rgba(46,78,140,0.95)",
        borderRadius: 3,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top", labels: { boxWidth: 12 } } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: grid }, beginAtZero: true },
    },
  },
});

// ── 2. CATEGORIAS (horizontal, ordenado por 2026, com variação %) ────────
new Chart(document.getElementById("chartCategoria"), {
  type: "bar",
  plugins: [smartDatalabelPlugin, variacaoPlugin],
  data: {
    labels: categorias,
    datasets: [
      {
        label: "2025",
        data: cat2025,
        backgroundColor: "#4a7fc1",
        borderRadius: 2,
      },
      {
        label: "2026",
        data: cat2026,
        backgroundColor: "#2e4e8c",
        borderRadius: 2,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { right: 52 } },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { boxWidth: 12, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          afterBody(ctx) {
            const i = ctx[0].dataIndex;
            const v25 = cat2025[i],
              v26 = cat2026[i];
            const diff = (((v26 - v25) / v25) * 100).toFixed(1);
            return `Variação: ${diff > 0 ? "+" : ""}${diff}%`;
          },
        },
      },
    },
    scales: {
      x: { grid: { color: grid }, beginAtZero: true },
      y: { grid: { display: false } },
    },
  },
});

// ── 3. SLA COMPARATIVO ───────────────────────────────────────────────────
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
        tension: 0.2,
        pointRadius: 4,
        pointBackgroundColor: "#7eaadf",
      },
      {
        label: "SLA 2026",
        data: sla2026,
        borderColor: "#52b899",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.2,
        pointRadius: 4,
        pointBackgroundColor: "#52b899",
      },
      {
        label: "Meta 60%",
        data: Array(5).fill(60),
        borderColor: "rgba(224,112,112,0.45)",
        borderDash: [6, 6],
        pointRadius: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: grid },
        min: 30,
        max: 70,
        ticks: { callback: (v) => v + "%" },
      },
    },
  },
  plugins: [
    {
      id: "slaAnnotation",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        // Só anotar datasets 0 (2025) e 1 (2026), não a linha de meta
        [0, 1].forEach((di) => {
          const ds = chart.data.datasets[di];
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          const vals = ds.data;
          const minV = Math.min(...vals);
          meta.data.forEach((point, i) => {
            const v = vals[i];
            const isMin = v === minV;
            const label = v.toFixed(1) + "%";

            // Posição: mínimos ficam abaixo, demais acima
            const above = !isMin;
            const yPos = above ? point.y - 14 : point.y + 14;

            ctx.save();

            // Pill de fundo suave
            const tw = ctx.measureText(label).width + 10;
            const th = 14;
            const rx = point.x - tw / 2;
            const ry = yPos - th / 2;
            const pillColor = isMin
              ? "rgba(192,57,43,0.10)"
              : di === 0
                ? "rgba(126,170,223,0.12)"
                : "rgba(82,184,153,0.12)";
            ctx.fillStyle = pillColor;
            ctx.beginPath();
            ctx.roundRect(rx, ry, tw, th, 4);
            ctx.fill();

            // Texto
            ctx.font = 'bold 10px "Source Sans 3", sans-serif';
            ctx.fillStyle = isMin ? "#c0392b" : ds.borderColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, point.x, yPos);

            ctx.restore();
          });
        });
      },
    },
  ],
});

// ── 4. SATISFAÇÃO ────────────────────────────────────────────────────────
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
        tension: 0.2,
        pointRadius: 4,
      },
      {
        label: "Nota 2026",
        data: sat2026,
        borderColor: "#a0c4e8",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: grid },
        min: 4.6,
        max: 5.0,
        ticks: { callback: (v) => v.toFixed(2), stepSize: 0.05 },
      },
    },
  },
  plugins: [
    {
      // Anotações em todos os pontos
      id: "satAnnotation",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, di) => {
          const meta = chart.getDatasetMeta(di);
          if (meta.hidden) return;
          const vals = ds.data;
          const minV = Math.min(...vals);
          meta.data.forEach((point, i) => {
            const v = vals[i];
            const isMin = v === minV;
            ctx.save();
            ctx.font = 'bold 10px "Source Sans 3", sans-serif';
            ctx.fillStyle = isMin ? "#c0392b" : ds.borderColor;
            ctx.textAlign = "center";
            // Valores mínimos ficam abaixo do ponto, demais ficam acima
            ctx.textBaseline = isMin ? "top" : "bottom";
            ctx.fillText(
              v.toFixed(2),
              point.x,
              isMin ? point.y + 6 : point.y - 6,
            );
            ctx.restore();
          });
        });
      },
    },
  ],
});

// ── 5. UNIDADES ──────────────────────────────────────────────────────────
new Chart(document.getElementById("chartUnidade"), {
  type: "bar",
  plugins: [smartDatalabelPlugin],
  data: {
    labels: unidades,
    datasets: [
      {
        label: "2025",
        data: uni2025,
        backgroundColor: "#4a7fc1",
        borderRadius: 2,
      },
      {
        label: "2026",
        data: uni2026,
        backgroundColor: "#e07070",
        borderRadius: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: grid } },
    },
  },
});

// ── 6. ASSUNTOS (agrupado por categoria-mãe, rótulos em linha única) ─────
// Cores por linha (baseadas no grupo de cada assunto)
const assColors25 = assuntosRaw.map(
  (a) => grupoColors[a.grupo]?.c25 || "rgba(74,127,193,0.75)",
);
const assColors26 = assuntosRaw.map(
  (a) => grupoColors[a.grupo]?.c26 || "#2e4e8c",
);

new Chart(document.getElementById("chartAssunto"), {
  type: "bar",
  plugins: [smartDatalabelPlugin],
  data: {
    labels: assLabels,
    datasets: [
      {
        label: "Ano 2025",
        data: ass2025,
        backgroundColor: assColors25,
        borderRadius: 3,
        barThickness: 13,
        categoryPercentage: 0.75,
      },
      {
        label: "Ano 2026",
        data: ass2026,
        backgroundColor: assColors26,
        borderRadius: 3,
        barThickness: 13,
        categoryPercentage: 0.75,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { right: 20 } },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          afterBody(ctx) {
            const i = ctx[0].dataIndex;
            const v25 = ass2025[i],
              v26 = ass2026[i];
            if (!v25) return "";
            const diff = (((v26 - v25) / v25) * 100).toFixed(1);
            return `Variação: ${diff > 0 ? "+" : ""}${diff}%`;
          },
        },
      },
    },
    scales: {
      x: { grid: { color: grid }, beginAtZero: true, grace: "8%" },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 11, weight: "600" },
          color: "#1e293b",
          maxRotation: 0,
        },
      },
    },
  },
});

// ── TABELA DE PERFORMANCE ─────────────────────────────────────────────────
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

// ── INSIGHTS AUTOMÁTICOS ──────────────────────────────────────────────────
function calcularEInjetarInsights() {
  const total2025 = volume2025.reduce((a, b) => a + b, 0);
  const total2026 = volume2026.reduce((a, b) => a + b, 0);
  const varPct = (((total2026 - total2025) / total2025) * 100).toFixed(1);
  const sinal = total2026 > total2025 ? "aumento" : "recuo";

  const mediaSla2025 = (
    sla2025.reduce((a, b) => a + b, 0) / sla2025.length
  ).toFixed(1);
  const mediaSla2026 = (
    sla2026.reduce((a, b) => a + b, 0) / sla2026.length
  ).toFixed(1);

  // Maior crescimento entre assuntos
  let idMaior = 0;
  assuntosRaw.forEach((a, i) => {
    if (a.v2026 > assuntosRaw[idMaior].v2026) idMaior = i;
  });
  const assuntoCritico = assuntosRaw[idMaior];
  const varCritico = (
    ((assuntoCritico.v2026 - assuntoCritico.v2025) / assuntoCritico.v2025) *
    100
  ).toFixed(0);

  const containerCentral = document.getElementById("insightTextoDashboard");
  if (containerCentral) {
    containerCentral.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div>🔹 <strong>Tendência de Escopo:</strong> A infraestrutura de TI processou um montante consolidado de <strong>${total2025 + total2026} chamados</strong> no histórico analisado. Registrou-se um <strong>${sinal} de ${Math.abs(varPct)}%</strong> nas demandas globais, de ${total2025} (2025) para ${total2026} (2026).</div>
        <div>🔹 <strong>Ponto Crítico Ativo:</strong> O assunto <strong style="color:var(--accent);">"${assuntoCritico.label}"</strong> obteve o maior crescimento isolado (+${varCritico}%), saltando de ${assuntoCritico.v2025} para <strong>${assuntoCritico.v2026} chamados</strong>. Recomenda-se auditoria estrutural para atenuar essa recorrência.</div>
        <div>🔹 <strong>Métrica de Nível de Serviço (SLA):</strong> Após revisão e correção dos registros no Sults, o SLA do período é de <strong style="color:#1a7a5e;font-weight:bold;">93,0%</strong> — <strong style="color:#1a7a5e;">acima da meta operacional de 60%</strong>. O SLA bruto de 50,4% refletia erros de cadastro, não falha no atendimento.</div>
      </div>
    `;
  }

  const containerLateral = document.getElementById("insightLateralOperacional");
  if (containerLateral) {
    containerLateral.innerHTML = `
      <p><strong style="color:#1c2133">Estabilização Sazonal:</strong> O primeiro trimestre aponta queda acentuada em 2026, com destaque para <strong>Fevereiro</strong>, que despencou de 230 para apenas 129 ordens abertas.</p>
      <p><strong style="color:#1c2133">Pico Corretivo:</strong> As atividades de suporte reaqueceram entre <strong>Abril e Maio</strong>, períodos nos quais a malha de 2026 superou o histórico de 2025.</p>
      <p><strong style="color:#1c2133">Foco Central:</strong> As solicitações de <strong>${assuntoCritico.label}</strong> e <strong>Acesso › Sults</strong> totalizam a maior fatia dos gargalos preventivos atuais.</p>
    `;
  }
}

calcularEInjetarInsights();
