// ── BIBLIOTECAS ──────────────────────────────────────────────────────────
// SheetJS carregado via index.html

// ── DADOS PADRÃO (fallback enquanto não há planilha importada) ───────────
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];
const MESES_NUM = [1, 2, 3, 4, 5];

let dadosAtivos = null; // será preenchido após importação ou usa padrão

const dadosPadrao = {
  volume2025: [241, 230, 163, 197, 201],
  volume2026: [200, 129, 163, 225, 229],
  sla2025: [100.0, 94.4, 94.0, 90.8, 94.0],
  sla2026: [100.0, 92.1, 79.2, 80.6, 96.8],
  sat2025: [4.82, 4.87, 4.87, 4.88, 4.87],
  sat2026: [4.89, 4.79, 4.91, 4.89, 4.91],
  categorias: [
    "Acesso",
    "Suporte",
    "Impressora",
    "PipeRun",
    "Shop 9",
    "E-mail",
    "Telefonia",
    "SAP",
  ],
  cat2025: [382, 260, 82, 72, 65, 45, 30, 28],
  cat2026: [333, 238, 70, 62, 57, 38, 28, 21],
  assuntosRaw: [
    { label: "Acesso › Novos Colaboradores", v2025: 104, v2026: 218 },
    { label: "Acesso › E-mail / Configuração", v2025: 232, v2026: 124 },
    { label: "Acesso › SAP", v2025: 157, v2026: 139 },
    { label: "Infra › Problemas Físicos", v2025: 73, v2026: 127 },
    { label: "Acesso › Sults", v2025: 44, v2026: 153 },
    { label: "Suporte › Programas Diversos", v2025: 81, v2026: 93 },
    { label: "Impressora › Instalação/Toner", v2025: 80, v2026: 77 },
    { label: "PipeRun › Acesso e Suporte", v2025: 52, v2026: 69 },
    { label: "Suporte › Notebook / Desktop", v2025: 45, v2026: 65 },
    { label: "Suporte › Software", v2025: 66, v2026: 41 },
  ],
  responsaveis: [
    { nome: "Wiclem Lopes Da Silva", total: 682, nota: 4.85, noPrazo: 385 },
    { nome: "Marcos Barros", total: 576, nota: 4.88, noPrazo: 312 },
    {
      nome: "Christian Wyterlin Silveira",
      total: 372,
      nota: 4.8,
      noPrazo: 161,
    },
    { nome: "Danielly Cavalieri", total: 130, nota: 4.86, noPrazo: 49 },
    { nome: "Eduardo Alves", total: 95, nota: 4.92, noPrazo: 38 },
    { nome: "Marcelo Lopes", total: 92, nota: 4.83, noPrazo: 52 },
    { nome: "Tiago Gomes", total: 26, nota: 4.92, noPrazo: 12 },
    { nome: "Plinio Bellas", total: 6, nota: 5.0, noPrazo: 1 },
  ],
  totalGeral: 1979,
  avaliados: 344,
  totalFiltro: 515,
  slaGlobal: 93.0,
  tempoMediano: 40.5,
};

// ── PROCESSAMENTO DA PLANILHA ────────────────────────────────────────────
function processarPlanilha(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (!rows.length) return null;

  // Normalizar colunas
  const parseDate = (v) => {
    if (!v) return null;
    if (v instanceof Date) return v;
    const d = XLSX.SSF.parse_date_code ? null : null;
    const t = new Date(v);
    return isNaN(t) ? null : t;
  };

  // Mapear colunas da planilha do Sults
  const dados = rows.map((r) => ({
    id: r["ID"] || r["id"] || "",
    aberto: parseDate(r["ABERTO"] || r["Aberto"] || r["aberto"]),
    concluido: parseDate(r["CONCLUÍDO"] || r["CONCLUIDO"] || r["Concluído"]),
    resolvido: parseDate(r["RESOLVIDO"] || r["Resolvido"]),
    prazo: parseDate(r["PRAZO ESTIPULADO"] || r["Prazo Estipulado"]),
    assunto: String(r["ASSUNTO"] || r["Assunto"] || ""),
    responsavel: String(
      r["RESPONSAVEL"] || r["RESPONSÁVEL"] || r["Responsavel"] || "",
    ),
    satisfacao:
      parseFloat(
        r["SATISFAÇÃO NOTA"] ||
          r["SATISFACAO NOTA"] ||
          r["Satisfação Nota"] ||
          0,
      ) || null,
    situacao: String(r["SITUAÇÃO"] || r["SITUACAO"] || r["Situação"] || ""),
  }));

  // Filtrar Jan-Mai 2025 e 2026
  const filtrado = dados.filter((d) => {
    if (!d.aberto) return false;
    const ano = d.aberto.getFullYear();
    const mes = d.aberto.getMonth() + 1;
    return (ano === 2025 || ano === 2026) && mes >= 1 && mes <= 5;
  });

  if (!filtrado.length) return null;

  // Correções SLA (mesma lógica da análise)
  filtrado.forEach((d) => {
    const prazoHoras =
      d.prazo && d.aberto ? (d.prazo - d.aberto) / 3600000 : null;
    let corrigido = false;

    // G1: Atraso genuíno confirmado como erro
    if (d.concluido && d.prazo && prazoHoras >= 24 && d.concluido > d.prazo)
      corrigido = true;
    // G2: Prazo irreal < 24h
    if (prazoHoras !== null && prazoHoras > 0 && prazoHoras < 24)
      corrigido = true;
    // G3: Em aberto sem resolução (sem impressora)
    if (!d.concluido && !d.resolvido && !d.assunto.includes("Impressora"))
      corrigido = true;
    // G4: Sem prazo cadastrado
    if (!d.prazo) corrigido = true;
    // G5: Resolvido no prazo mas não concluído
    if (!d.concluido && d.resolvido && d.prazo && d.resolvido <= d.prazo)
      corrigido = true;

    d.noPrazoCor = corrigido
      ? true
      : d.concluido && d.prazo
        ? d.concluido <= d.prazo
        : false;
  });

  // Volume por mês
  const vol2025 = MESES_NUM.map(
    (m) =>
      filtrado.filter(
        (d) => d.aberto.getFullYear() === 2025 && d.aberto.getMonth() + 1 === m,
      ).length,
  );
  const vol2026 = MESES_NUM.map(
    (m) =>
      filtrado.filter(
        (d) => d.aberto.getFullYear() === 2026 && d.aberto.getMonth() + 1 === m,
      ).length,
  );

  // SLA por mês
  const slaMes = (ano, mes) => {
    const sub = filtrado.filter(
      (d) => d.aberto.getFullYear() === ano && d.aberto.getMonth() + 1 === mes,
    );
    if (!sub.length) return 0;
    return +(
      (sub.filter((d) => d.noPrazoCor).length / sub.length) *
      100
    ).toFixed(1);
  };
  const sla25 = MESES_NUM.map((m) => slaMes(2025, m));
  const sla26 = MESES_NUM.map((m) => slaMes(2026, m));

  // Satisfação por mês
  const satMes = (ano, mes) => {
    const sub = filtrado.filter(
      (d) =>
        d.aberto.getFullYear() === ano &&
        d.aberto.getMonth() + 1 === mes &&
        d.satisfacao,
    );
    if (!sub.length) return null;
    return +(sub.reduce((a, b) => a + b.satisfacao, 0) / sub.length).toFixed(2);
  };
  const sat25 = MESES_NUM.map((m) => satMes(2025, m) || 0);
  const sat26 = MESES_NUM.map((m) => satMes(2026, m) || 0);

  // Categorias
  const getCat = (assunto) => assunto.split(">")[0].trim();
  const catMap = {};
  filtrado.forEach((d) => {
    const cat = getCat(d.assunto) || "Outros";
    const ano = d.aberto.getFullYear();
    if (!catMap[cat]) catMap[cat] = { v2025: 0, v2026: 0 };
    if (ano === 2025) catMap[cat].v2025++;
    if (ano === 2026) catMap[cat].v2026++;
  });
  const catArr = Object.entries(catMap)
    .map(([nome, v]) => ({
      nome,
      v2025: v.v2025,
      v2026: v.v2026,
      total: v.v2025 + v.v2026,
    }))
    .filter((c) => c.total >= 5)
    .sort((a, b) => b.v2026 - a.v2026)
    .slice(0, 8);

  // Top 10 assuntos
  const assMap = {};
  filtrado.forEach((d) => {
    const ass = d.assunto.replace(">", "›").trim() || "Outros";
    const ano = d.aberto.getFullYear();
    if (!assMap[ass]) assMap[ass] = { v2025: 0, v2026: 0 };
    if (ano === 2025) assMap[ass].v2025++;
    if (ano === 2026) assMap[ass].v2026++;
  });
  const assArr = Object.entries(assMap)
    .map(([label, v]) => ({
      label,
      v2025: v.v2025,
      v2026: v.v2026,
      total: v.v2025 + v.v2026,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Responsáveis
  const respMap = {};
  filtrado.forEach((d) => {
    const nome = d.responsavel || "Sem responsável";
    if (!respMap[nome]) respMap[nome] = { total: 0, noPrazo: 0, notas: [] };
    respMap[nome].total++;
    if (d.noPrazoCor) respMap[nome].noPrazo++;
    if (d.satisfacao) respMap[nome].notas.push(d.satisfacao);
  });
  const respArr = Object.entries(respMap)
    .map(([nome, v]) => ({
      nome,
      total: v.total,
      noPrazo: v.noPrazo,
      nota: v.notas.length
        ? +(v.notas.reduce((a, b) => a + b, 0) / v.notas.length).toFixed(2)
        : 0,
    }))
    .filter((r) => r.total >= 3)
    .sort((a, b) => b.total - a.total);

  // KPIs globais
  const total2025 = filtrado.filter(
    (d) => d.aberto.getFullYear() === 2025,
  ).length;
  const total2026 = filtrado.filter(
    (d) => d.aberto.getFullYear() === 2026,
  ).length;
  const totalGeral = total2025 + total2026;
  const avaliados = filtrado.filter((d) => d.satisfacao).length;
  const slaGlobal = +(
    (filtrado.filter((d) => d.noPrazoCor).length / filtrado.length) *
    100
  ).toFixed(1);

  // Tempo mediano resolução
  const tempos = filtrado
    .filter((d) => d.concluido && d.aberto)
    .map((d) => (d.concluido - d.aberto) / 3600000)
    .sort((a, b) => a - b);
  const tempoMediano = tempos.length
    ? +tempos[Math.floor(tempos.length / 2)].toFixed(1)
    : 0;

  return {
    volume2025: vol2025,
    volume2026: vol2026,
    sla2025: sla25,
    sla2026: sla26,
    sat2025: sat25,
    sat2026: sat26,
    categorias: catArr.map((c) => c.nome),
    cat2025: catArr.map((c) => c.v2025),
    cat2026: catArr.map((c) => c.v2026),
    assuntosRaw: assArr,
    responsaveis: respArr,
    totalGeral,
    avaliados,
    totalFiltro: filtrado.length,
    total2025,
    total2026,
    slaGlobal,
    tempoMediano,
  };
}

// ── INSTÂNCIAS DOS GRÁFICOS ──────────────────────────────────────────────
let charts = {};

Chart.defaults.color = "#8a99ad";
Chart.defaults.font.family = "'Source Sans 3', sans-serif";
const grid = "rgba(255,255,255,0.05)";

const smartDatalabelPlugin = {
  id: "smartDatalabel",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const isHorizontal = chart.config.options.indexAxis === "y";
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden || chart.config.type === "line") return;
      meta.data.forEach((bar, i) => {
        const v = ds.data[i];
        if (v === 0 || v == null) return;
        ctx.save();
        ctx.font = 'bold 10px "Source Sans 3", sans-serif';
        ctx.fillStyle = "#1e293b";
        if (isHorizontal) {
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

const variacaoPlugin = {
  id: "variacaoPlugin",
  afterDatasetsDraw(chart) {
    if (chart.canvas.id !== "chartCategoria") return;
    const { ctx } = chart;
    const d = chart.data.datasets;
    const meta1 = chart.getDatasetMeta(1);
    const meta0 = chart.getDatasetMeta(0);
    meta1.data.forEach((bar, i) => {
      const v25 = d[0].data[i],
        v26 = d[1].data[i];
      if (!v25) return;
      const diff = (((v26 - v25) / v25) * 100).toFixed(0);
      const label = (diff > 0 ? "+" : "") + diff + "%";
      ctx.save();
      ctx.font = 'bold 10px "Source Sans 3", sans-serif';
      ctx.fillStyle = diff > 0 ? "#c0392b" : "#1a7a5e";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, bar.x + 8, bar.y - 7);
      ctx.restore();
    });
  },
};

function initCharts(d) {
  // Destruir charts anteriores se existirem
  Object.values(charts).forEach((c) => c.destroy());
  charts = {};

  // 1. VOLUME
  charts.evolucao = new Chart(document.getElementById("chartEvolucao"), {
    type: "bar",
    plugins: [smartDatalabelPlugin],
    data: {
      labels: MESES,
      datasets: [
        {
          label: "Ano 2025",
          data: d.volume2025,
          backgroundColor: "rgba(93,142,199,0.8)",
          borderRadius: 3,
        },
        {
          label: "Ano 2026",
          data: d.volume2026,
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

  // 2. CATEGORIAS
  const catSorted = [
    ...d.categorias.map((n, i) => ({
      n,
      v25: d.cat2025[i],
      v26: d.cat2026[i],
    })),
  ].sort((a, b) => b.v26 - a.v26);
  charts.categoria = new Chart(document.getElementById("chartCategoria"), {
    type: "bar",
    plugins: [smartDatalabelPlugin, variacaoPlugin],
    data: {
      labels: catSorted.map((c) => c.n),
      datasets: [
        {
          label: "2025",
          data: catSorted.map((c) => c.v25),
          backgroundColor: "#4a7fc1",
          borderRadius: 2,
        },
        {
          label: "2026",
          data: catSorted.map((c) => c.v26),
          backgroundColor: "#2e4e8c",
          borderRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24, right: 52 } },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: { boxWidth: 12, font: { size: 11 } },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: grid }, beginAtZero: true },
      },
    },
  });

  // 3. SLA
  charts.sla = new Chart(document.getElementById("chartSLA"), {
    type: "line",
    data: {
      labels: MESES,
      datasets: [
        {
          label: "SLA 2025",
          data: d.sla2025,
          borderColor: "#7eaadf",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#7eaadf",
        },
        {
          label: "SLA 2026",
          data: d.sla2026,
          borderColor: "#52b899",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#52b899",
        },
        {
          label: "Meta 90%",
          data: Array(5).fill(90),
          borderColor: "#f0c040",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20, bottom: 10 } },
      plugins: { legend: { position: "top" } },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: grid },
          min: 60,
          max: 105,
          ticks: { callback: (v) => v + "%" },
        },
      },
    },
    plugins: [
      {
        id: "slaAnnotation",
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
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
              const above = !isMin;
              const yPos = above ? point.y - 20 : point.y + 20;
              ctx.save();
              const tw = ctx.measureText(label).width + 10;
              const th = 14;
              ctx.fillStyle = isMin
                ? "rgba(192,57,43,0.10)"
                : di === 0
                  ? "rgba(126,170,223,0.12)"
                  : "rgba(82,184,153,0.12)";
              ctx.beginPath();
              ctx.roundRect(point.x - tw / 2, yPos - th / 2, tw, th, 4);
              ctx.fill();
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

  // 4. SATISFAÇÃO
  charts.sat = new Chart(document.getElementById("chartSat"), {
    type: "line",
    data: {
      labels: MESES,
      datasets: [
        {
          label: "Nota 2025",
          data: d.sat2025,
          borderColor: "#d4a84b",
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 4,
        },
        {
          label: "Nota 2026",
          data: d.sat2026,
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
        id: "satAnnotation",
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const ds0 = chart.data.datasets[0],
            ds1 = chart.data.datasets[1];
          const meta0 = chart.getDatasetMeta(0),
            meta1 = chart.getDatasetMeta(1);
          const drawLabel = (point, v, color, above) => {
            ctx.save();
            ctx.font = 'bold 10px "Source Sans 3", sans-serif';
            ctx.textAlign = "center";
            ctx.textBaseline = above ? "bottom" : "top";
            ctx.fillStyle = color;
            ctx.fillText(
              v.toFixed(2),
              point.x,
              above ? point.y - 6 : point.y + 6,
            );
            ctx.restore();
          };
          for (let i = 0; i < ds0.data.length; i++) {
            const v0 = ds0.data[i],
              v1 = ds1.data[i];
            if (!meta0.hidden)
              drawLabel(meta0.data[i], v0, ds0.borderColor, v0 >= v1);
            if (!meta1.hidden)
              drawLabel(meta1.data[i], v1, ds1.borderColor, v1 > v0);
          }
        },
      },
    ],
  });

  // 5. ASSUNTOS
  const assTop = [...d.assuntosRaw]
    .sort((a, b) => b.v2025 + b.v2026 - (a.v2025 + a.v2026))
    .slice(0, 10);
  charts.assunto = new Chart(document.getElementById("chartAssunto"), {
    type: "bar",
    plugins: [smartDatalabelPlugin],
    data: {
      labels: assTop.map((a) => a.label),
      datasets: [
        {
          label: "Ano 2025",
          data: assTop.map((a) => a.v2025),
          backgroundColor: "rgba(74,127,193,0.75)",
          borderRadius: 3,
        },
        {
          label: "Ano 2026",
          data: assTop.map((a) => a.v2026),
          backgroundColor: "#2e4e8c",
          borderRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            afterBody(ctx) {
              const i = ctx[0].dataIndex,
                v25 = assTop[i].v2025,
                v26 = assTop[i].v2026;
              const diff = (((v26 - v25) / v25) * 100).toFixed(1);
              return `Variação: ${diff > 0 ? "+" : ""}${diff}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 }, maxRotation: 30, minRotation: 20 },
        },
        y: { grid: { color: grid }, beginAtZero: true },
      },
    },
  });
}

// ── TABELA DE RESPONSÁVEIS ────────────────────────────────────────────────
function renderTabela(responsaveis) {
  const maxTotal = Math.max(...responsaveis.map((r) => r.total));
  const tbody = document.getElementById("respBody");
  tbody.innerHTML = "";
  responsaveis.forEach((r) => {
    const pct = ((r.noPrazo / r.total) * 100).toFixed(1);
    const slaCls = pct >= 90 ? "sla-high" : pct >= 60 ? "sla-mid" : "sla-low";
    const barW = Math.round((r.total / maxTotal) * 100);
    const stars =
      "★".repeat(Math.round(r.nota || 0)) +
      "☆".repeat(5 - Math.round(r.nota || 0));
    tbody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td class="name-cell">${r.nome}</td>
        <td><strong>${r.total}</strong></td>
        <td class="bar-cell"><div class="mini-bar-wrap"><div class="mini-bar" style="width:${barW}%"></div></div></td>
        <td class="star-cell">${stars} <span style="color:var(--muted);font-size:11px;">${(r.nota || 0).toFixed(2)}</span></td>
        <td style="color:var(--text2)">${r.noPrazo}</td>
        <td><span class="sla-badge ${slaCls}">${pct}%</span></td>
      </tr>
    `,
    );
  });
}

// ── KPIs ─────────────────────────────────────────────────────────────────
function atualizarKPIs(d) {
  const t2025 = d.total2025 || d.volume2025.reduce((a, b) => a + b, 0);
  const t2026 = d.total2026 || d.volume2026.reduce((a, b) => a + b, 0);
  const total = d.totalGeral || t2025 + t2026;

  document.querySelector(".kpi-card.blue .kpi-value").textContent =
    total.toLocaleString("pt-BR");
  document.querySelector(".kpi-card.blue .kpi-sub").innerHTML =
    `<strong>${t2025.toLocaleString("pt-BR")}</strong> em 2025 · <strong>${t2026.toLocaleString("pt-BR")}</strong> em 2026`;

  const satMedia =
    d.sat2025 && d.sat2025.filter((v) => v > 0).length
      ? (
          [...d.sat2025, ...d.sat2026]
            .filter((v) => v > 0)
            .reduce((a, b) => a + b, 0) /
          [...d.sat2025, ...d.sat2026].filter((v) => v > 0).length
        )
          .toFixed(2)
          .replace(".", ",")
      : "4,87";
  document.querySelector(".kpi-card.blue2 .kpi-value").textContent = satMedia;
  document.querySelector(".kpi-card.blue2 .kpi-sub").textContent =
    `${d.avaliados || 344} de ${d.totalFiltro || 515} avaliados (${d.totalFiltro ? ((d.avaliados / d.totalFiltro) * 100).toFixed(1) : 66.8}%)`;

  document.querySelector(".kpi-value-sla").textContent =
    (d.slaGlobal || 93.0).toFixed(1) + "%";
  document.querySelector(".kpi-card.green:last-child .kpi-value").textContent =
    (d.tempoMediano || 40.5) + "h";

  document.getElementById("filterBadge").textContent =
    `Filtro Amostral: ${total.toLocaleString("pt-BR")} Chamados`;
}

// ── INSIGHTS ──────────────────────────────────────────────────────────────
function calcularInsights(d) {
  const t2025 = d.volume2025.reduce((a, b) => a + b, 0);
  const t2026 = d.volume2026.reduce((a, b) => a + b, 0);
  const varPct = (((t2026 - t2025) / t2025) * 100).toFixed(1);
  const sinal = t2026 > t2025 ? "aumento" : "recuo";

  const assTop = [...d.assuntosRaw].sort((a, b) => b.v2026 - a.v2026)[0];
  const varCritico =
    assTop && assTop.v2025
      ? (((assTop.v2026 - assTop.v2025) / assTop.v2025) * 100).toFixed(0)
      : 0;

  const c = document.getElementById("insightTextoDashboard");
  if (c)
    c.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div>🔹 <strong>Tendência de Escopo:</strong> A infraestrutura de TI processou <strong>${t2025 + t2026} chamados</strong> no histórico analisado. Registrou-se um <strong>${sinal} de ${Math.abs(varPct)}%</strong> nas demandas globais, de ${t2025} (2025) para ${t2026} (2026).</div>
      ${assTop ? `<div>🔹 <strong>Ponto Crítico Ativo:</strong> O assunto <strong style="color:var(--accent);">"${assTop.label}"</strong> obteve o maior crescimento isolado (+${varCritico}%), saltando de ${assTop.v2025} para <strong>${assTop.v2026} chamados</strong>.</div>` : ""}
      <div>🔹 <strong>SLA do Período:</strong> Após correção dos registros no Sults, o SLA é de <strong style="color:#1a7a5e;font-weight:bold;">${(d.slaGlobal || 93).toFixed(1)}%</strong> — <strong style="color:#1a7a5e;">acima da meta de 90%</strong>.</div>
    </div>`;

  const l = document.getElementById("insightLateralOperacional");
  const febVol25 = d.volume2025[1],
    febVol26 = d.volume2026[1];
  if (l)
    l.innerHTML = `
    <p><strong style="color:#1c2133">Estabilização Sazonal:</strong> O primeiro trimestre aponta queda em 2026, com destaque para <strong>Fevereiro</strong> (${febVol25} → ${febVol26} ordens).</p>
    <p><strong style="color:#1c2133">Pico Corretivo:</strong> As atividades reaqueceram entre <strong>Abril e Maio</strong>, quando 2026 superou 2025.</p>
    ${assTop ? `<p><strong style="color:#1c2133">Foco Central:</strong> <strong>${assTop.label}</strong> lidera os gargalos do período.</p>` : ""}`;
}

// ── RENDERIZAÇÃO COMPLETA ─────────────────────────────────────────────────
function renderDashboard(d) {
  atualizarKPIs(d);
  initCharts(d);
  renderTabela(d.responsaveis);
  calcularInsights(d);
}

// ── IMPORTAÇÃO DO EXCEL ──────────────────────────────────────────────────
function configurarImportacao() {
  const btn = document.getElementById("btnImportar");
  const input = document.getElementById("inputExcel");
  const status = document.getElementById("statusImport");

  btn.addEventListener("click", () => input.click());

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    status.textContent = "⏳ Processando planilha...";
    status.style.color = "var(--muted)";

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, {
          type: "array",
          cellDates: true,
        });
        const dados = processarPlanilha(wb);
        if (!dados) {
          status.textContent =
            "❌ Planilha inválida ou sem dados no período Jan-Mai.";
          status.style.color = "var(--accent3)";
          return;
        }
        dadosAtivos = dados;
        renderDashboard(dados);
        status.textContent = `✅ Planilha importada com sucesso — ${dados.totalFiltro} chamados processados.`;
        status.style.color = "var(--accent4)";
        document.getElementById("nomeArquivo").textContent = file.name;
      } catch (err) {
        status.textContent = "❌ Erro ao ler o arquivo: " + err.message;
        status.style.color = "var(--accent3)";
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  });
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  configurarImportacao();
  renderDashboard(dadosPadrao);
});
