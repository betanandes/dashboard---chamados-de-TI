// ── CONFIGURAÇÃO ──────────────────────────────────────────────────────────
const SULTS_TOKEN = "O2Zhc3Rkcnl3YWxsOzE3NzQ4OTI1MTQwOTk=";
const SULTS_API = "https://api.sults.com.br/api/v1/chamado/ticket";
const DEPTO_TI = 9;
const USUARIO_ID = 1617;

// ── PERÍODO DINÂMICO ──────────────────────────────────────────────────────
const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function getPeriodo() {
  const anoBase = parseInt(document.getElementById("anoBase")?.value || 2025);
  const mesInicio = parseInt(document.getElementById("mesInicio")?.value || 1);
  const mesFim = parseInt(document.getElementById("mesFim")?.value || 5);
  const anoComp = anoBase - 1;
  return { anoBase, anoComp, mesInicio, mesFim };
}

function getMesesLabels() {
  const { mesInicio, mesFim } = getPeriodo();
  const labels = [];
  for (let m = mesInicio; m <= mesFim; m++) labels.push(NOMES_MESES[m - 1]);
  return labels;
}

function getMesesNum() {
  const { mesInicio, mesFim } = getPeriodo();
  const nums = [];
  for (let m = mesInicio; m <= mesFim; m++) nums.push(m);
  return nums;
}

function atualizarResumo() {
  const { anoBase, anoComp, mesInicio, mesFim } = getPeriodo();
  const mInicio = NOMES_MESES[mesInicio - 1];
  const mFim = NOMES_MESES[mesFim - 1];
  const periodo = mesInicio === mesFim ? `${mInicio}` : `${mInicio}–${mFim}`;
  const texto = `${periodo} ${anoBase} vs ${anoComp}`;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("periodoResumo", texto);
  set("subtitlePeriodo", `Análise Comparativa de Desempenho · ${texto}`);
  set("footerPeriodo", texto);

  // Títulos dinâmicos dos gráficos
  set("titleVolume", `Volume de Chamados por Mês · ${texto}`);
  set("subVolume", `Comparativo sazonal ${periodo} (${anoBase} vs ${anoComp})`);
  set("titleCategorias", `Categorias: ${anoBase} vs ${anoComp}`);
  set(
    "subCategorias",
    `Comparativo de volumetria das principais frentes · ${periodo}`,
  );
  set("titleSLA", `SLA por Mês: ${anoBase} vs ${anoComp}`);
  set("titleSat", `Evolução da Satisfação Média · ${texto}`);
  set(
    "subSat",
    `Comparativo das notas de atendimento · ${periodo} (${anoBase} vs ${anoComp})`,
  );
  set("titlePerf", `Performance da Equipe de TI · ${periodo} ${anoBase}`);
  set("subPerf", `Métricas agregadas dos atendimentos — ${texto}`);
  set(
    "titleAssuntos",
    `Top 10 Assuntos Mais Recorrentes: ${anoBase} vs ${anoComp}`,
  );
  set(
    "subAssuntos",
    `Ordenado por volume total · ${periodo} (${anoBase} vs ${anoComp})`,
  );
  set("kpiVolumeSub", `Período: ${texto}`);
}
let dadosAtivos = null;

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

// ── HELPERS ───────────────────────────────────────────────────────────────
const parseDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  const t = new Date(v);
  return isNaN(t) ? null : t;
};

const headers = {
  Authorization: SULTS_TOKEN,
  "Content-Type": "application/json;charset=UTF-8",
};

// ── BUSCA API SULTS (paralela) ────────────────────────────────────────────
async function buscarTodosChamados(onProgresso) {
  const { anoComp, mesInicio, mesFim, anoBase } = getPeriodo();

  const abertoStart = `${anoComp}-${String(mesInicio).padStart(2, "0")}-01T00:00:00Z`;
  const abertoEnd = `${anoBase}-${String(mesFim).padStart(2, "0")}-${new Date(anoBase, mesFim, 0).getDate()}T23:59:59Z`;
  const baseUrl = `${SULTS_API}?limit=100&departamento=${DEPTO_TI}&abertoStart=${abertoStart}&abertoEnd=${abertoEnd}`;

  // 1. Busca a primeira página para descobrir totalPage
  const primeiraRes = await fetch(`${baseUrl}&start=0`, {
    method: "GET",
    headers,
  });
  if (!primeiraRes.ok)
    throw new Error(`Erro ${primeiraRes.status}: ${primeiraRes.statusText}`);
  const primeiraJson = await primeiraRes.json();
  const totalPaginas = primeiraJson.totalPage || 1;
  const todos = [...(primeiraJson.data || [])];

  if (onProgresso) onProgresso(1, totalPaginas, todos.length);

  if (totalPaginas > 1) {
    // 2. Dispara todas as páginas restantes em paralelo
    const promises = [];
    for (let p = 1; p < totalPaginas; p++) {
      promises.push(
        fetch(`${baseUrl}&start=${p}`, { method: "GET", headers })
          .then((r) => r.json())
          .then((json) => {
            todos.push(...(json.data || []));
            if (onProgresso)
              onProgresso(todos.length, totalPaginas * 100, todos.length);
            return json;
          }),
      );
    }
    await Promise.all(promises);
  }

  if (onProgresso) onProgresso(totalPaginas, totalPaginas, todos.length);
  return todos;
}

// ── BUSCA CHAMADOS PENDENTES (resolvidos não concluídos) ──────────────────
async function buscarChamadosPendentes() {
  const res = await fetch(
    `${SULTS_API}?start=0&limit=100&departamento=${DEPTO_TI}&situacao=3`,
    { method: "GET", headers },
  );
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

// ── CONCLUIR CHAMADO ──────────────────────────────────────────────────────
async function concluirChamado(chamadoId) {
  const res = await fetch(`${SULTS_API}/${chamadoId}/action/conclude`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ pessoaId: USUARIO_ID }),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return true;
}

// ── PROCESSAMENTO DOS CHAMADOS ────────────────────────────────────────────
function processarChamados(chamados) {
  const { anoBase, anoComp, mesInicio, mesFim } = getPeriodo();
  const mesesNum = getMesesNum();

  const dados = chamados.map((c) => ({
    id: c.id,
    aberto: parseDate(c.aberto),
    concluido: parseDate(c.concluido),
    resolvido: parseDate(c.resolvido),
    prazo: parseDate(c.resolverEstipulado),
    assunto: c.assunto?.nome || "",
    responsavel: c.responsavel?.nome || "",
    satisfacao: c.avaliacaoNota || null,
    situacao: c.situacao,
  }));

  const filtrado = dados.filter((d) => {
    if (!d.aberto) return false;
    const ano = d.aberto.getFullYear();
    const mes = d.aberto.getMonth() + 1;
    return (
      (ano === anoBase || ano === anoComp) && mes >= mesInicio && mes <= mesFim
    );
  });
  if (!filtrado.length) return null;

  filtrado.forEach((d) => {
    const prazoHoras =
      d.prazo && d.aberto ? (d.prazo - d.aberto) / 3600000 : null;
    let corrigido = false;
    if (d.concluido && d.prazo && prazoHoras >= 24 && d.concluido > d.prazo)
      corrigido = true;
    if (prazoHoras !== null && prazoHoras > 0 && prazoHoras < 24)
      corrigido = true;
    if (!d.concluido && !d.resolvido && !d.assunto.includes("Impressora"))
      corrigido = true;
    if (!d.prazo) corrigido = true;
    if (!d.concluido && d.resolvido && d.prazo && d.resolvido <= d.prazo)
      corrigido = true;
    d.noPrazoCor = corrigido
      ? true
      : d.concluido && d.prazo
        ? d.concluido <= d.prazo
        : false;
  });

  const volBase = mesesNum.map(
    (m) =>
      filtrado.filter(
        (d) =>
          d.aberto.getFullYear() === anoBase && d.aberto.getMonth() + 1 === m,
      ).length,
  );
  const volComp = mesesNum.map(
    (m) =>
      filtrado.filter(
        (d) =>
          d.aberto.getFullYear() === anoComp && d.aberto.getMonth() + 1 === m,
      ).length,
  );
  const slaMes = (ano, mes) => {
    const s = filtrado.filter(
      (d) => d.aberto.getFullYear() === ano && d.aberto.getMonth() + 1 === mes,
    );
    return s.length
      ? +((s.filter((d) => d.noPrazoCor).length / s.length) * 100).toFixed(1)
      : 0;
  };
  const satMes = (ano, mes) => {
    const s = filtrado.filter(
      (d) =>
        d.aberto.getFullYear() === ano &&
        d.aberto.getMonth() + 1 === mes &&
        d.satisfacao,
    );
    return s.length
      ? +(s.reduce((a, b) => a + b.satisfacao, 0) / s.length).toFixed(2)
      : 0;
  };

  const catMap = {};
  filtrado.forEach((d) => {
    const cat = d.assunto.split(">")[0].trim() || "Outros",
      ano = d.aberto.getFullYear();
    if (!catMap[cat]) catMap[cat] = { vBase: 0, vComp: 0 };
    if (ano === anoBase) catMap[cat].vBase++;
    if (ano === anoComp) catMap[cat].vComp++;
  });
  const catArr = Object.entries(catMap)
    .map(([nome, v]) => ({
      nome,
      v2025: v.vBase,
      v2026: v.vComp,
      total: v.vBase + v.vComp,
    }))
    .filter((c) => c.total >= 5)
    .sort((a, b) => b.v2025 - a.v2025)
    .slice(0, 8);

  const assMap = {};
  filtrado.forEach((d) => {
    const ass = d.assunto.replace(">", "›").trim() || "Outros",
      ano = d.aberto.getFullYear();
    if (!assMap[ass]) assMap[ass] = { v2025: 0, v2026: 0 };
    if (ano === anoBase) assMap[ass].v2025++;
    if (ano === anoComp) assMap[ass].v2026++;
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

  const totalBase = filtrado.filter(
    (d) => d.aberto.getFullYear() === anoBase,
  ).length;
  const totalComp = filtrado.filter(
    (d) => d.aberto.getFullYear() === anoComp,
  ).length;
  const avaliados = filtrado.filter((d) => d.satisfacao).length;
  const slaGlobal = +(
    (filtrado.filter((d) => d.noPrazoCor).length / filtrado.length) *
    100
  ).toFixed(1);
  const tempos = filtrado
    .filter((d) => d.concluido && d.aberto)
    .map((d) => (d.concluido - d.aberto) / 3600000)
    .sort((a, b) => a - b);
  const tempoMediano = tempos.length
    ? +tempos[Math.floor(tempos.length / 2)].toFixed(1)
    : 0;

  return {
    volume2025: volBase,
    volume2026: volComp,
    sla2025: mesesNum.map((m) => slaMes(anoBase, m)),
    sla2026: mesesNum.map((m) => slaMes(anoComp, m)),
    sat2025: mesesNum.map((m) => satMes(anoBase, m)),
    sat2026: mesesNum.map((m) => satMes(anoComp, m)),
    categorias: catArr.map((c) => c.nome),
    cat2025: catArr.map((c) => c.v2025),
    cat2026: catArr.map((c) => c.v2026),
    assuntosRaw: assArr,
    responsaveis: respArr,
    totalGeral: totalBase + totalComp,
    avaliados,
    totalFiltro: filtrado.length,
    total2025: totalBase,
    total2026: totalComp,
    slaGlobal,
    tempoMediano,
    anoBase,
    anoComp,
  };
}

// ── PROCESSAMENTO PLANILHA EXCEL ──────────────────────────────────────────
function processarPlanilha(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  if (!rows.length) return null;
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
  const filtrado = dados.filter((d) => {
    if (!d.aberto) return false;
    const ano = d.aberto.getFullYear(),
      mes = d.aberto.getMonth() + 1;
    return (ano === 2025 || ano === 2026) && mes >= 1 && mes <= 5;
  });
  if (!filtrado.length) return null;
  return processarChamados(
    filtrado.map((d) => ({
      id: d.id,
      aberto: d.aberto?.toISOString(),
      concluido: d.concluido?.toISOString(),
      resolvido: d.resolvido?.toISOString(),
      resolverEstipulado: d.prazo?.toISOString(),
      assunto: { nome: d.assunto },
      responsavel: { nome: d.responsavel },
      avaliacaoNota: d.satisfacao,
      situacao: d.situacao,
    })),
  );
}

// ── GRÁFICOS ──────────────────────────────────────────────────────────────
let charts = {};
Chart.defaults.color = "#8a99ad";
Chart.defaults.font.family = "'Source Sans 3', sans-serif";
const grid = "rgba(255,255,255,0.05)";

const smartDatalabelPlugin = {
  id: "smartDatalabel",
  afterDatasetsDraw(chart) {
    const { ctx } = chart,
      isH = chart.config.options.indexAxis === "y";
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden || chart.config.type === "line") return;
      meta.data.forEach((bar, i) => {
        const v = ds.data[i];
        if (v === 0 || v == null) return;
        ctx.save();
        ctx.font = 'bold 10px "Source Sans 3", sans-serif';
        ctx.fillStyle = "#1e293b";
        if (isH) {
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
    const { ctx } = chart,
      d = chart.data.datasets;
    chart.getDatasetMeta(1).data.forEach((bar, i) => {
      const v25 = d[0].data[i],
        v26 = d[1].data[i];
      if (!v25) return;
      const diff = (((v26 - v25) / v25) * 100).toFixed(0),
        label = (diff > 0 ? "+" : "") + diff + "%";
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
  Object.values(charts).forEach((c) => c.destroy());
  charts = {};
  const meses = getMesesLabels();
  const anoBase = d.anoBase || 2025;
  const anoComp = d.anoComp || 2024;

  charts.evolucao = new Chart(document.getElementById("chartEvolucao"), {
    type: "bar",
    plugins: [smartDatalabelPlugin],
    data: {
      labels: meses,
      datasets: [
        {
          label: `Ano ${anoBase}`,
          data: d.volume2025,
          backgroundColor: "rgba(93,142,199,0.8)",
          borderRadius: 3,
        },
        {
          label: `Ano ${anoComp}`,
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
  const cs = [
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
      labels: cs.map((c) => c.n),
      datasets: [
        {
          label: `${anoBase}`,
          data: cs.map((c) => c.v25),
          backgroundColor: "#4a7fc1",
          borderRadius: 2,
        },
        {
          label: `${anoComp}`,
          data: cs.map((c) => c.v26),
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
  charts.sla = new Chart(document.getElementById("chartSLA"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        {
          label: `SLA ${anoBase}`,
          data: d.sla2025,
          borderColor: "#7eaadf",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#7eaadf",
        },
        {
          label: `SLA ${anoComp}`,
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
          data: Array(meses.length).fill(90),
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
            const ds = chart.data.datasets[di],
              meta = chart.getDatasetMeta(di);
            if (meta.hidden) return;
            const vals = ds.data,
              minV = Math.min(...vals);
            meta.data.forEach((point, i) => {
              const v = vals[i],
                isMin = v === minV,
                label = v.toFixed(1) + "%",
                above = !isMin,
                yPos = above ? point.y - 20 : point.y + 20;
              ctx.save();
              const tw = ctx.measureText(label).width + 10,
                th = 14;
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
  charts.sat = new Chart(document.getElementById("chartSat"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        {
          label: `Nota ${anoBase}`,
          data: d.sat2025,
          borderColor: "#d4a84b",
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 4,
        },
        {
          label: `Nota ${anoComp}`,
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
          const { ctx } = chart,
            ds0 = chart.data.datasets[0],
            ds1 = chart.data.datasets[1],
            meta0 = chart.getDatasetMeta(0),
            meta1 = chart.getDatasetMeta(1),
            drawLabel = (point, v, color, above) => {
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
  const at = [...d.assuntosRaw]
    .sort((a, b) => b.v2025 + b.v2026 - (a.v2025 + a.v2026))
    .slice(0, 10);
  charts.assunto = new Chart(document.getElementById("chartAssunto"), {
    type: "bar",
    plugins: [smartDatalabelPlugin],
    data: {
      labels: at.map((a) => a.label),
      datasets: [
        {
          label: `Ano ${anoBase}`,
          data: at.map((a) => a.v2025),
          backgroundColor: "rgba(74,127,193,0.75)",
          borderRadius: 3,
        },
        {
          label: `Ano ${anoComp}`,
          data: at.map((a) => a.v2026),
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
                v25 = at[i].v2025,
                v26 = at[i].v2026,
                diff = (((v26 - v25) / v25) * 100).toFixed(1);
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

function renderTabela(responsaveis) {
  const maxTotal = Math.max(...responsaveis.map((r) => r.total));
  const tbody = document.getElementById("respBody");
  tbody.innerHTML = "";
  responsaveis.forEach((r) => {
    const pct = ((r.noPrazo / r.total) * 100).toFixed(1),
      slaCls = pct >= 90 ? "sla-high" : pct >= 60 ? "sla-mid" : "sla-low";
    const barW = Math.round((r.total / maxTotal) * 100),
      stars =
        "★".repeat(Math.round(r.nota || 0)) +
        "☆".repeat(5 - Math.round(r.nota || 0));
    tbody.insertAdjacentHTML(
      "beforeend",
      `<tr><td class="name-cell">${r.nome}</td><td><strong>${r.total}</strong></td><td class="bar-cell"><div class="mini-bar-wrap"><div class="mini-bar" style="width:${barW}%"></div></div></td><td class="star-cell">${stars} <span style="color:var(--muted);font-size:11px;">${(r.nota || 0).toFixed(2)}</span></td><td style="color:var(--text2)">${r.noPrazo}</td><td><span class="sla-badge ${slaCls}">${pct}%</span></td></tr>`,
    );
  });
}

function atualizarKPIs(d) {
  const { anoBase, anoComp } = getPeriodo();
  const t2025 = d.total2025 || d.volume2025.reduce((a, b) => a + b, 0),
    t2026 = d.total2026 || d.volume2026.reduce((a, b) => a + b, 0),
    total = d.totalGeral || t2025 + t2026;
  document.querySelector(".kpi-card.blue .kpi-value").textContent =
    total.toLocaleString("pt-BR");
  document.querySelector(".kpi-card.blue .kpi-sub").innerHTML =
    `<strong>${t2025.toLocaleString("pt-BR")}</strong> em ${d.anoBase || anoBase} · <strong>${t2026.toLocaleString("pt-BR")}</strong> em ${d.anoComp || anoComp}`;
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
    `Filtro Amostral: ${total.toLocaleString("pt-BR")} Chamados · Depto TI`;
}

function calcularInsights(d) {
  const { anoBase, anoComp, mesInicio, mesFim } = getPeriodo();
  const meses = getMesesLabels();
  const tBase = d.volume2025.reduce((a, b) => a + b, 0);
  const tComp = d.volume2026.reduce((a, b) => a + b, 0);
  const varPct = tComp > 0 ? (((tBase - tComp) / tComp) * 100).toFixed(1) : 0;
  const sinal =
    tBase > tComp ? "crescimento" : tBase < tComp ? "recuo" : "estabilidade";

  // Mês com maior queda e maior pico no ano base vs comparativo
  const diferencas = d.volume2025.map((v, i) => ({
    mes: meses[i],
    diff: v - (d.volume2026[i] || 0),
    vBase: v,
    vComp: d.volume2026[i] || 0,
  }));
  const maiorQueda = [...diferencas].sort((a, b) => b.diff - a.diff)[0];
  const maiorPico = [...diferencas].sort((a, b) => a.diff - b.diff)[0];

  // Assunto com maior volume no ano base
  const assTop = [...d.assuntosRaw].sort((a, b) => b.v2025 - a.v2025)[0];
  const varCritico =
    assTop && assTop.v2026 > 0
      ? (((assTop.v2025 - assTop.v2026) / assTop.v2026) * 100).toFixed(0)
      : "—";
  const sinalCritico =
    assTop && assTop.v2025 > assTop.v2026 ? "crescimento" : "redução";

  // SLA status
  const slaStatus =
    (d.slaGlobal || 0) >= 90
      ? `<strong style="color:#1a7a5e;">acima da meta de 90%</strong>`
      : `<strong style="color:#c0392b;">abaixo da meta de 90%</strong>`;

  const c = document.getElementById("insightTextoDashboard");
  if (c)
    c.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div>🔹 <strong>Tendência de Escopo:</strong> No período <strong>${meses[0]}–${meses[meses.length - 1]} ${anoBase}</strong>, a equipe de TI processou <strong>${tBase.toLocaleString("pt-BR")} chamados</strong> vs <strong>${tComp.toLocaleString("pt-BR")}</strong> no mesmo período de ${anoComp} — um <strong>${sinal} de ${Math.abs(varPct)}%</strong>.</div>
      ${assTop ? `<div>🔹 <strong>Ponto Crítico Ativo:</strong> O assunto <strong style="color:var(--accent);">"${assTop.label}"</strong> foi o mais recorrente em ${anoBase} com <strong>${assTop.v2025} chamados</strong> (${anoComp}: ${assTop.v2026}) — variação de ${sinalCritico === "crescimento" ? "+" : "-"}${Math.abs(varCritico)}%.</div>` : ""}
      <div>🔹 <strong>SLA do Período:</strong> O índice de cumprimento de prazo em ${anoBase} é de <strong style="color:${(d.slaGlobal || 0) >= 90 ? "#1a7a5e" : "#c0392b"};font-weight:bold;">${(d.slaGlobal || 0).toFixed(1)}%</strong> — ${slaStatus}.</div>
    </div>`;

  // Gargalos laterais dinâmicos
  const l = document.getElementById("insightLateralOperacional");
  if (l)
    l.innerHTML = `
    <p><strong style="color:#1c2133">Variação Mensal:</strong> Em ${anoBase}, <strong>${maiorQueda.mes}</strong> registrou o maior volume (${maiorQueda.vBase} chamados vs ${maiorQueda.vComp} em ${anoComp}).</p>
    <p><strong style="color:#1c2133">Ponto de Atenção:</strong> <strong>${maiorPico.mes}</strong> foi o mês com maior crescimento em ${anoComp} em relação a ${anoBase} (${maiorPico.vComp} vs ${maiorPico.vBase}).</p>
    ${assTop ? `<p><strong style="color:#1c2133">Foco Central:</strong> <strong>${assTop.label}</strong> lidera os gargalos com ${assTop.v2025} chamados em ${anoBase}.</p>` : ""}`;
}

function renderDashboard(d) {
  atualizarKPIs(d);
  initCharts(d);
  renderTabela(d.responsaveis);
  calcularInsights(d);
}

// ── PAINEL DE CHAMADOS PENDENTES ──────────────────────────────────────────
async function abrirPainelPendentes() {
  const painel = document.getElementById("painelPendentes");
  const tbody = document.getElementById("pendentesBody");
  const status = document.getElementById("statusPendentes");

  painel.style.display = "block";
  painel.scrollIntoView({ behavior: "smooth", block: "start" });
  tbody.innerHTML = `<tr><td colspan="6" class="painel-loading">Buscando chamados resolvidos pendentes...</td></tr>`;
  status.textContent = "";

  try {
    const chamados = await buscarChamadosPendentes();
    if (!chamados.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="painel-empty">Nenhum chamado pendente de conclusão</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    chamados.forEach((c, idx) => {
      const resolvido = c.resolvido
        ? new Date(c.resolvido).toLocaleDateString("pt-BR")
        : "—";
      const noPrazo =
        c.resolvido &&
        c.resolverEstipulado &&
        new Date(c.resolvido) <= new Date(c.resolverEstipulado);
      const badgeCls = noPrazo ? "badge-prazo" : "badge-atraso";
      const badgeTxt = noPrazo ? "✓ No prazo" : "⚠ Atrasado";
      const rowCls = idx % 2 === 0 ? "painel-row" : "painel-row painel-row-alt";

      tbody.insertAdjacentHTML(
        "beforeend",
        `
        <tr id="row-${c.id}" class="${rowCls}">
          <td class="painel-cell-id">#${c.id}</td>
          <td class="painel-cell-assunto">${c.assunto?.nome || "—"}</td>
          <td class="painel-cell-resp">${c.responsavel?.nome || "—"}</td>
          <td class="painel-cell-data">${resolvido}</td>
          <td><span class="painel-badge ${badgeCls}">${badgeTxt}</span></td>
          <td>
            <button class="btn-concluir" onclick="concluirChamadoUI(${c.id})">
              ✓ Concluir
            </button>
          </td>
        </tr>`,
      );
    });

    status.textContent = `${chamados.length} chamados pendentes`;
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="painel-loading" style="color:#f8a;">Erro ao carregar: ${err.message}</td></tr>`;
  }
}

window.concluirChamadoUI = async function (id) {
  const btn = document.querySelector(`#row-${id} .btn-concluir`);
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Concluindo...";
  }
  try {
    await concluirChamado(id);
    const row = document.getElementById(`row-${id}`);
    if (row) {
      row.style.opacity = "0.4";
      row.style.textDecoration = "line-through";
      row.querySelector(".btn-concluir").textContent = "Concluído";
    }
    const status = document.getElementById("statusPendentes");
    if (status) {
      status.textContent = `Chamado #${id} concluído`;
    }
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "✓ Concluir";
    }
    alert(`Erro ao concluir chamado #${id}: ${err.message}`);
  }
};

// ── IMPORTAÇÃO EXCEL ──────────────────────────────────────────────────────
function configurarImportacao() {
  const btn = document.getElementById("btnImportar"),
    input = document.getElementById("inputExcel"),
    status = document.getElementById("statusImport");
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
          status.textContent = "❌ Planilha inválida ou sem dados Jan-Mai.";
          status.style.color = "var(--accent3)";
          return;
        }
        dadosAtivos = dados;
        renderDashboard(dados);
        status.textContent = `✅ Importado — ${dados.totalFiltro} chamados.`;
        status.style.color = "var(--accent4)";
        document.getElementById("nomeArquivo").textContent = file.name;
      } catch (err) {
        status.textContent = "❌ Erro: " + err.message;
        status.style.color = "var(--accent3)";
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  });
}

// ── BUSCA SULTS ───────────────────────────────────────────────────────────
function configurarBuscaSults() {
  const btn = document.getElementById("btnBuscarSults"),
    status = document.getElementById("statusImport"),
    nome = document.getElementById("nomeArquivo");
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "⏳ Buscando...";
    status.textContent = "Conectando ao Sults (Depto TI)...";
    status.style.color = "var(--muted)";
    try {
      const chamados = await buscarTodosChamados((carregados, total, qtd) => {
        status.textContent = `Carregando — ${qtd} chamados recebidos...`;
      });
      const dados = processarChamados(chamados);
      if (!dados) {
        status.textContent = "❌ Nenhum chamado TI encontrado no período.";
        status.style.color = "var(--accent3)";
        return;
      }
      dadosAtivos = dados;
      renderDashboard(dados);
      const agora = new Date().toLocaleString("pt-BR");
      status.textContent = `✅ ${dados.totalFiltro} chamados TI · Atualizado em ${agora}`;
      status.style.color = "var(--accent4)";
      nome.textContent = `API Sults · Depto TI · ${agora}`;
    } catch (err) {
      status.textContent = `❌ Erro: ${err.message}`;
      status.style.color = "var(--accent3)";
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;vertical-align:-2px"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>Buscar dados do Sults`;
    }
  });
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  configurarImportacao();
  configurarBuscaSults();
  document
    .getElementById("btnPendentes")
    .addEventListener("click", abrirPainelPendentes);
  document.getElementById("btnFecharPainel").addEventListener("click", () => {
    document.getElementById("painelPendentes").style.display = "none";
  });

  // Atualiza resumo ao mudar qualquer select de período
  ["anoBase", "mesInicio", "mesFim"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", () => {
      atualizarResumo();
      // Se havia dados carregados, avisa que precisa buscar novamente
      const status = document.getElementById("statusImport");
      if (dadosAtivos) {
        status.textContent =
          "⚠️ Período alterado — clique em 'Buscar dados do Sults' para atualizar.";
        status.style.color = "var(--accent5)";
      }
    });
  });

  atualizarResumo();
  renderDashboard(dadosPadrao);
});
