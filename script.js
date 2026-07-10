// ── CONFIGURAÇÃO ──────────────────────────────────────────────────────────
// ⚠️ Link CSV publicado do Google Sheets
const GOOGLE_SHEETS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzs4z4cP6FIKJYr9qGOnA_mcl8giq7MTx6Q9lqqAOrpgT62qwrWvX9Q1o5XvMZeqeXDQzJC5GaLGDM/pub?output=csv";

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
  const anoBase = parseInt(document.getElementById("anoBase")?.value || 2026);
  const mesInicio = parseInt(document.getElementById("mesInicio")?.value || 1);
  const mesFim = parseInt(document.getElementById("mesFim")?.value || 6);
  return { anoBase, anoComp: anoBase - 1, mesInicio, mesFim };
}
function getMesesLabels() {
  const { mesInicio, mesFim } = getPeriodo();
  const l = [];
  for (let m = mesInicio; m <= mesFim; m++) l.push(NOMES_MESES[m - 1]);
  return l;
}
function getMesesNum() {
  const { mesInicio, mesFim } = getPeriodo();
  const n = [];
  for (let m = mesInicio; m <= mesFim; m++) n.push(m);
  return n;
}

function atualizarResumo() {
  const { anoBase, anoComp, mesInicio, mesFim } = getPeriodo();
  const mI = NOMES_MESES[mesInicio - 1],
    mF = NOMES_MESES[mesFim - 1];
  const periodo = mesInicio === mesFim ? mI : `${mI}–${mF}`;
  const texto = `${periodo} ${anoBase} vs ${anoComp}`;
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  set("periodoResumo", texto);
  set("subtitlePeriodo", `Análise Comparativa de Desempenho · ${texto}`);
  set("footerPeriodo", texto);
  set("titleVolume", `Volume de Chamados por Mês · ${texto}`);
  set("subVolume", `Comparativo sazonal ${periodo} (${anoBase} vs ${anoComp})`);
  set("titleCategorias", `Categorias: ${anoBase} vs ${anoComp}`);
  set(
    "subCategorias",
    `Top 8 categorias com ≥5 chamados · ${periodo} · não soma com o total do KPI`,
  );
  set("titleSLA", `SLA por Mês: ${anoBase} vs ${anoComp}`);
  set("titleSat", `Satisfação Média · ${texto}`);
  set("subSat", `Notas de atendimento · ${periodo} (${anoBase} vs ${anoComp})`);
  set("titleTempo", `Tempo Mediano de Resolução por Mês · ${texto}`);
  set(
    "subTempo",
    `Mediana de horas entre abertura e conclusão/resolução · ${periodo}`,
  );
  set("titlePerf", `Performance da Equipe · ${periodo} ${anoBase}`);
  set("subPerf", `Métricas agregadas — ${texto}`);
  set("titleAssuntos", `Top 10 Assuntos: ${anoBase} vs ${anoComp}`);
  set(
    "subAssuntos",
    `Top 10 assuntos · ${periodo} · não soma com o total do KPI`,
  );
  set(
    "titleAssuntoTempo",
    `Tempo Mediano de Resolução por Assuntos · ${texto}`,
  );
  set(
    "subAssuntoTempo",
    `Mediana de horas para os mesmos top 10 assuntos · ${periodo}`,
  );
  set("kpiVolumeSub", `Período: ${texto}`);
}

let dadosAtivos = null;

// ── DADOS PADRÃO — Jan-Jun 2026 vs 2025 (dados reais combinados) ─────────
const dadosPadrao = {
  volume2025: [193, 125, 163, 224, 229, 284],
  volume2026: [257, 230, 163, 197, 201, 132],
  sla2025: [58.0, 52.8, 54.6, 48.2, 52.8, 63.4],
  sla2026: [39.7, 53.0, 44.2, 39.1, 55.2, 48.5],
  sat2025: [4.89, 4.8, 4.91, 4.89, 4.91, 4.93],
  sat2026: [null, null, null, null, null, null],
  tempoMediano2025: [46.1, 72.6, 84.1, 52.8, 48.1, 22.5],
  tempoMediano2026: [52.5, 21.8, 45.1, 45.3, 23.4, 27.0],
  categorias: [
    "SAP",
    "E-mail",
    "Suporte",
    "Programas Div.",
    "Sults",
    "PipeRun",
    "Impressora",
    "Acesso",
  ],
  cat2025: [205, 151, 129, 123, 94, 91, 88, 85],
  cat2026: [0, 0, 0, 0, 0, 0, 0, 0],
  assuntosRaw: [
    { label: "SAP", v2025: 154, v2026: 0 },
    {
      label: "Programas Diversos (S9, Nasajon, Active e etc...)",
      v2025: 123,
      v2026: 0,
    },
    { label: "E-mail", v2025: 110, v2026: 0 },
    { label: "Suporte › Notebook / Desktop", v2025: 78, v2026: 0 },
    { label: "Acesso › Novos Colaboradores", v2025: 77, v2026: 0 },
    { label: "Sults", v2025: 71, v2026: 0 },
    { label: "Suporte › Software", v2025: 69, v2026: 0 },
    { label: "Impressora › Instalação / Reparo", v2025: 56, v2026: 0 },
    { label: "Suporte › Hardware", v2025: 40, v2026: 0 },
    { label: "PipeRun › Suporte PipeRun", v2025: 39, v2026: 0 },
  ],
  assuntosTempo: [
    { label: "SAP", tempoBase: 47.9, tempoComp: null },
    {
      label: "Programas Diversos (S9, Nasajon, Active e etc...)",
      tempoBase: 28.4,
      tempoComp: null,
    },
    { label: "E-mail", tempoBase: 68.2, tempoComp: null },
    { label: "Suporte › Notebook / Desktop", tempoBase: 77.3, tempoComp: null },
    {
      label: "Acesso › Novos Colaboradores",
      tempoBase: 173.0,
      tempoComp: null,
    },
    { label: "Sults", tempoBase: 19.4, tempoComp: null },
    { label: "Suporte › Software", tempoBase: 15.6, tempoComp: null },
    {
      label: "Impressora › Instalação / Reparo",
      tempoBase: 26.0,
      tempoComp: null,
    },
    { label: "Suporte › Hardware", tempoBase: 18.0, tempoComp: null },
    { label: "PipeRun › Suporte PipeRun", tempoBase: 40.0, tempoComp: null },
  ],
  responsaveis: [
    { nome: "Marcos Barros", total: 451, nota: 4.92, noPrazo: 249 },
    { nome: "Wiclem Lopes", total: 357, nota: 4.89, noPrazo: 212 },
    {
      nome: "Christian Wyterlin Silveira",
      total: 244,
      nota: 4.82,
      noPrazo: 120,
    },
    { nome: "Tiago da Silva Gomes", total: 56, nota: 4.97, noPrazo: 33 },
    { nome: "Marcelo Lourenço Lopes", total: 57, nota: 4.87, noPrazo: 35 },
    { nome: "Danielly Cavalieri", total: 38, nota: 4.9, noPrazo: 22 },
    { nome: "Plinio Bellas", total: 10, nota: 5.0, noPrazo: 4 },
  ],
  totalGeral: 2398,
  avaliados: 820,
  totalFiltro: 2398,
  slaGlobal: 55.5,
  tempoMediano: 39.7,
  total2025: 1218,
  total2026: 1180,
  anoBase: 2026,
  anoComp: 2025,
};

// ── HELPERS ───────────────────────────────────────────────────────────────
const parseDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v === "number") {
    // Serial date do Excel/Sheets
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + v * 86400000);
  }
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    // Formato dd/MM/yyyy HH:mm:ss ou dd/MM/yyyy
    if (s.includes("/")) {
      const [datePart, timePart] = s.split(" ");
      const parts = datePart.split("/");
      if (parts.length === 3) {
        let [d2, m2, y2] = parts;
        if (y2.length === 2) y2 = "20" + y2;
        const dt = new Date(
          `${y2}-${m2.padStart(2, "0")}-${d2.padStart(2, "0")}T${timePart || "00:00:00"}`,
        );
        if (!isNaN(dt)) return dt;
      }
    }
    // Formato ISO ou outros aceitos nativamente
    const t = new Date(s);
    return isNaN(t) ? null : t;
  }
  return null;
};

// ── BUSCA PLANILHA DO GOOGLE SHEETS (CSV) ─────────────────────────────────
async function buscarPlanilhaGoogleSheets() {
  if (!GOOGLE_SHEETS_URL)
    throw new Error("Link do Google Sheets não configurado");
  // Cache-buster para garantir dados sempre atualizados
  const url = `${GOOGLE_SHEETS_URL}&_t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status} ao acessar o Google Sheets`);
  const csvText = await res.text();
  const workbook = XLSX.read(csvText, {
    type: "string",
    cellDates: true,
    raw: false,
  });
  return processarPlanilha(workbook);
}

// ── PROCESSAMENTO DOS CHAMADOS ─────────────────────────────────────────────
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
    const ano = d.aberto.getFullYear(),
      mes = d.aberto.getMonth() + 1;
    return (
      (ano === anoBase || ano === anoComp) && mes >= mesInicio && mes <= mesFim
    );
  });
  if (!filtrado.length) return null;

  filtrado.forEach((d) => {
    // Resolvido e Concluído são tratados como equivalentes:
    // ambos indicam que o problema foi solucionado, com ou sem o
    // encerramento formal no sistema
    d.dataEfetiva = d.concluido || d.resolvido || null;

    const prazoHoras =
      d.prazo && d.aberto ? (d.prazo - d.aberto) / 3600000 : null;
    // G1: Prazo cadastrado com menos de 24h — erro de configuração no Sults,
    // não reflete um SLA real acordado. Tratado como "no prazo".
    const prazoIrreal =
      prazoHoras !== null && prazoHoras > 0 && prazoHoras < 24;
    // G2: Sem prazo cadastrado — campo obrigatório não preenchido.
    const semPrazo = !d.prazo;

    d.noPrazoBase = !!(d.dataEfetiva && d.prazo && d.dataEfetiva <= d.prazo);
    d.noPrazoCor = d.noPrazoBase || prazoIrreal || semPrazo;
    d.motivoCorrecao = prazoIrreal
      ? "Prazo irreal (<24h)"
      : semPrazo
        ? "Sem prazo cadastrado"
        : null;
  });

  const porAnoMes = (ano, mes) =>
    filtrado.filter(
      (d) => d.aberto.getFullYear() === ano && d.aberto.getMonth() + 1 === mes,
    );
  const slaMes = (ano, mes, campo) => {
    const s = porAnoMes(ano, mes);
    return s.length
      ? +((s.filter((d) => d[campo]).length / s.length) * 100).toFixed(1)
      : null;
  };
  const satMes = (ano, mes) => {
    const s = porAnoMes(ano, mes).filter((d) => d.satisfacao);
    return s.length
      ? +(s.reduce((a, b) => a + b.satisfacao, 0) / s.length).toFixed(2)
      : null;
  };

  const medianaArr = (arr) => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    const meio = Math.floor(s.length / 2);
    return s.length % 2 !== 0 ? s[meio] : (s[meio - 1] + s[meio]) / 2;
  };
  const tempoMedianoMes = (ano, mes) => {
    const s = porAnoMes(ano, mes)
      .filter((d) => d.dataEfetiva && d.aberto)
      .map((d) => (d.dataEfetiva - d.aberto) / 3600000);
    const m = medianaArr(s);
    return m !== null ? +m.toFixed(1) : null;
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

  // Tempo Mediano de Resolução por Assunto — usa os mesmos top 10 assuntos
  // já selecionados acima, para manter os dois gráficos comparáveis.
  // Não altera nenhum cálculo existente (SLA, volume, KPIs) — campo aditivo.
  const assTempoMap = {};
  filtrado.forEach((d) => {
    if (!d.dataEfetiva || !d.aberto) return;
    const ass = d.assunto.replace(">", "›").trim() || "Outros",
      ano = d.aberto.getFullYear();
    if (!assTempoMap[ass]) assTempoMap[ass] = { base: [], comp: [] };
    const horas = (d.dataEfetiva - d.aberto) / 3600000;
    if (ano === anoBase) assTempoMap[ass].base.push(horas);
    if (ano === anoComp) assTempoMap[ass].comp.push(horas);
  });
  const assuntosTempo = assArr.map((a) => ({
    label: a.label,
    tempoBase: medianaArr(assTempoMap[a.label]?.base || []),
    tempoComp: medianaArr(assTempoMap[a.label]?.comp || []),
  }));

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
  // Tempo Mediano de Resolução — usa dataEfetiva (concluido ?? resolvido)
  // para manter a mesma população de chamados usada no cálculo de SLA.
  // Mediana calculada corretamente: média dos dois valores centrais
  // quando a quantidade de chamados é par (não apenas um deles).
  const tempos = filtrado
    .filter((d) => d.dataEfetiva && d.aberto)
    .map((d) => (d.dataEfetiva - d.aberto) / 3600000);
  const tempoMediano = +(medianaArr(tempos) || 0).toFixed(1);

  const comSolucao = filtrado.filter((d) => d.dataEfetiva);
  const emAberto = filtrado.filter((d) => !d.dataEfetiva);
  const corrigidos = filtrado.filter((d) => d.motivoCorrecao);
  const slaBase = +(
    (filtrado.filter((d) => d.noPrazoBase).length / filtrado.length) *
    100
  ).toFixed(1);
  console.group(`📊 SLA — ${anoBase} vs ${anoComp}`);
  console.log(
    `Total: ${filtrado.length} | Resolvidos/Concluídos: ${comSolucao.length} | Em aberto: ${emAberto.length}`,
  );
  console.log(
    `SLA sem correções: ${slaBase}% | SLA com correções (prazo irreal/ausente): ${slaGlobal}%`,
  );
  console.log(
    `Chamados corrigidos: ${corrigidos.length} (${((corrigidos.length / filtrado.length) * 100).toFixed(1)}%)`,
  );
  const motivos = {};
  corrigidos.forEach((d) => {
    motivos[d.motivoCorrecao] = (motivos[d.motivoCorrecao] || 0) + 1;
  });
  Object.entries(motivos).forEach(([m, n]) =>
    console.log(`  - ${m}: ${n} chamados`),
  );
  console.groupEnd();

  return {
    volume2025: mesesNum.map((m) => porAnoMes(anoBase, m).length),
    volume2026: mesesNum.map((m) => porAnoMes(anoComp, m).length),
    sla2025: mesesNum.map((m) => slaMes(anoBase, m, "noPrazoCor")),
    sla2026: mesesNum.map((m) => slaMes(anoComp, m, "noPrazoCor")),
    sat2025: mesesNum.map((m) => satMes(anoBase, m)),
    sat2026: mesesNum.map((m) => satMes(anoComp, m)),
    tempoMediano2025: mesesNum.map((m) => tempoMedianoMes(anoBase, m)),
    tempoMediano2026: mesesNum.map((m) => tempoMedianoMes(anoComp, m)),
    categorias: catArr.map((c) => c.nome),
    cat2025: catArr.map((c) => c.v2025),
    cat2026: catArr.map((c) => c.v2026),
    assuntosRaw: assArr,
    assuntosTempo,
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

function processarPlanilha(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  console.group("📋 Diagnóstico da Planilha");
  console.log(`Total de linhas lidas: ${rows.length}`);
  if (rows.length) console.log("Colunas encontradas:", Object.keys(rows[0]));
  console.groupEnd();
  if (!rows.length) return null;
  const { anoBase, anoComp, mesInicio, mesFim } = getPeriodo();
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
    departamento: String(r["DEPARTAMENTO"] || r["Departamento"] || ""),
    satisfacao:
      parseFloat(
        r["SATISFAÇÃO NOTA"] ||
          r["SATISFACAO NOTA"] ||
          r["Satisfação Nota"] ||
          0,
      ) || null,
    situacao: String(r["SITUAÇÃO"] || r["SITUACAO"] || r["Situação"] || ""),
  }));

  // Diagnóstico: quantas linhas têm data de abertura válida
  const semData = dados.filter((d) => !d.aberto).length;
  console.log(
    `⚠️ Linhas sem data de abertura válida (descartadas): ${semData}`,
  );

  // Diagnóstico: distribuição por ano/mês antes do filtro de período
  const distribuicao = {};
  dados.forEach((d) => {
    if (!d.aberto) return;
    const chave = `${d.aberto.getFullYear()}-${String(d.aberto.getMonth() + 1).padStart(2, "0")}`;
    distribuicao[chave] = (distribuicao[chave] || 0) + 1;
  });
  console.log(
    "📅 Distribuição por Ano-Mês (todos os dados da planilha):",
    distribuicao,
  );

  const filtrado = dados.filter((d) => {
    if (!d.aberto) return false;
    const ano = d.aberto.getFullYear(),
      mes = d.aberto.getMonth() + 1;
    const noPeriodo =
      (ano === anoBase || ano === anoComp) && mes >= mesInicio && mes <= mesFim;
    // Se a coluna DEPARTAMENTO existir e não for TI, descarta (segurança extra)
    const deptoOk =
      !d.departamento || d.departamento.toLowerCase().includes("tecnologia");
    return noPeriodo && deptoOk;
  });
  const descartadosDepto = dados.filter(
    (d) =>
      d.departamento && !d.departamento.toLowerCase().includes("tecnologia"),
  ).length;
  if (descartadosDepto)
    console.log(
      `🚫 Linhas de outros departamentos descartadas: ${descartadosDepto}`,
    );
  console.log(
    `✅ Linhas após filtro de período (${anoBase} e ${anoComp}, mês ${mesInicio}-${mesFim}): ${filtrado.length}`,
  );
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

// ── GRÁFICOS ───────────────────────────────────────────────────────────────
let charts = {};
Chart.defaults.color = "#8a8a92";
Chart.defaults.font.family = "Inter, system-ui, sans-serif";
const grid = "rgba(24,24,27,0.06)";

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
        ctx.font = "bold 10px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#18181b";
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

function initCharts(d) {
  Object.values(charts).forEach((c) => c.destroy());
  charts = {};
  const meses = getMesesLabels(),
    anoBase = d.anoBase || 2026,
    anoComp = d.anoComp || 2025;

  charts.evolucao = new Chart(document.getElementById("chartEvolucao"), {
    type: "bar",
    plugins: [smartDatalabelPlugin],
    data: {
      labels: meses,
      datasets: [
        {
          label: `Ano ${anoBase}`,
          data: d.volume2025,
          backgroundColor: "rgba(192,39,45,0.85)",
          borderRadius: 3,
        },
        {
          label: `Ano ${anoComp}`,
          data: d.volume2026,
          backgroundColor: "rgba(82,82,91,0.85)",
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
  ].sort((a, b) => b.v25 - a.v25);
  charts.categoria = new Chart(document.getElementById("chartCategoria"), {
    type: "bar",
    plugins: [smartDatalabelPlugin],
    data: {
      labels: cs.map((c) => c.n),
      datasets: [
        {
          label: `${anoBase}`,
          data: cs.map((c) => c.v25),
          backgroundColor: "#c0272d",
          borderRadius: 2,
        },
        {
          label: `${anoComp}`,
          data: cs.map((c) => c.v26),
          backgroundColor: "#3f3f46",
          borderRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 20, right: 40 } },
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

  const slaBase = (d.sla2025 || []).map((v) => v ?? undefined);
  const slaComp = (d.sla2026 || []).map((v) => v ?? undefined);

  charts.sla = new Chart(document.getElementById("chartSLA"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        {
          label: `SLA ${anoBase}`,
          data: slaBase,
          borderColor: "#c0272d",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#c0272d",
          spanGaps: false,
        },
        {
          label: `SLA ${anoComp}`,
          data: slaComp,
          borderColor: "#52525b",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#52525b",
          spanGaps: false,
        },
        {
          label: "Meta 90%",
          data: Array(meses.length).fill(90),
          borderColor: "#b07d2a",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 28, bottom: 10 } },
      plugins: {
        legend: {
          position: "top",
          labels: { boxWidth: 14, font: { size: 11 }, padding: 12 },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const v = ctx.parsed.y;
              return v != null
                ? ` ${ctx.dataset.label}: ${v.toFixed(1)}%`
                : ` sem dados`;
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: grid },
          min: 0,
          max: 105,
          ticks: { callback: (v) => v + "%", stepSize: 10 },
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
            meta.data.forEach((point, i) => {
              const v = ds.data[i];
              if (v == null || v === undefined) return;
              const label = v.toFixed(1) + "%",
                yPos = point.y - 18;
              ctx.save();
              const tw = ctx.measureText(label).width + 10,
                th = 14;
              ctx.fillStyle =
                di === 0 ? "rgba(192,39,45,0.12)" : "rgba(82,82,91,0.12)";
              ctx.beginPath();
              ctx.roundRect(point.x - tw / 2, yPos - th / 2, tw, th, 4);
              ctx.fill();
              ctx.font = "bold 10px Inter, system-ui, sans-serif";
              ctx.fillStyle = ds.borderColor;
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
          borderColor: "#c0272d",
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 4,
        },
        {
          label: `Nota ${anoComp}`,
          data: d.sat2026,
          borderColor: "#a1a1aa",
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
            label: (ctx) =>
              ` ${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(2) || "—"}`,
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
            meta1 = chart.getDatasetMeta(1);
          const draw = (point, v, color, above) => {
            if (v == null) return;
            ctx.save();
            ctx.font = "bold 10px Inter, system-ui, sans-serif";
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
          for (let i = 0; i < (ds0.data || []).length; i++) {
            const v0 = ds0.data[i],
              v1 = ds1?.data[i];
            if (!meta0.hidden)
              draw(meta0.data[i], v0, ds0.borderColor, v0 >= v1);
            if (meta1 && !meta1.hidden)
              draw(meta1.data[i], v1, ds1.borderColor, v1 > v0);
          }
        },
      },
    ],
  });

  const tempoBase = (d.tempoMediano2025 || []).map((v) => v ?? undefined);
  const tempoComp = (d.tempoMediano2026 || []).map((v) => v ?? undefined);

  charts.tempo = new Chart(document.getElementById("chartTempo"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        {
          label: `Tempo ${anoBase}`,
          data: tempoBase,
          borderColor: "#c0272d",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#c0272d",
          spanGaps: false,
        },
        {
          label: `Tempo ${anoComp}`,
          data: tempoComp,
          borderColor: "#52525b",
          backgroundColor: "transparent",
          borderWidth: 2.5,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: "#52525b",
          spanGaps: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 28, bottom: 10 } },
      plugins: {
        legend: {
          position: "top",
          labels: { boxWidth: 14, font: { size: 11 }, padding: 12 },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const v = ctx.parsed.y;
              return v != null
                ? ` ${ctx.dataset.label}: ${v.toFixed(1)}h`
                : ` sem dados`;
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: grid },
          beginAtZero: true,
          ticks: { callback: (v) => v + "h" },
        },
      },
    },
    plugins: [
      {
        id: "tempoAnnotation",
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          [0, 1].forEach((di) => {
            const ds = chart.data.datasets[di],
              meta = chart.getDatasetMeta(di);
            if (meta.hidden) return;
            meta.data.forEach((point, i) => {
              const v = ds.data[i];
              if (v == null || v === undefined) return;
              const label = v.toFixed(1) + "h",
                yPos = point.y - 18;
              ctx.save();
              const tw = ctx.measureText(label).width + 10,
                th = 14;
              ctx.fillStyle =
                di === 0 ? "rgba(192,39,45,0.12)" : "rgba(82,82,91,0.12)";
              ctx.beginPath();
              ctx.roundRect(point.x - tw / 2, yPos - th / 2, tw, th, 4);
              ctx.fill();
              ctx.font = "bold 10px Inter, system-ui, sans-serif";
              ctx.fillStyle = ds.borderColor;
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
          backgroundColor: "rgba(192,39,45,0.8)",
          borderRadius: 3,
        },
        {
          label: `Ano ${anoComp}`,
          data: at.map((a) => a.v2026),
          backgroundColor: "#3f3f46",
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
                diff = v26 > 0 ? (((v25 - v26) / v26) * 100).toFixed(1) : "—";
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

  // Tempo Mediano de Resolução por Assunto — mesmo estilo visual do gráfico
  // "Tempo Mediano de Resolução por Mês" (linha com pontos anotados)
  const atTempo = d.assuntosTempo || [];
  const assTempoBase = atTempo.map((a) => a.tempoBase ?? undefined);
  const assTempoComp = atTempo.map((a) => a.tempoComp ?? undefined);

  charts.assuntoTempo = new Chart(
    document.getElementById("chartAssuntoTempo"),
    {
      type: "line",
      data: {
        labels: atTempo.map((a) => a.label),
        datasets: [
          {
            label: `Ano ${anoBase}`,
            data: assTempoBase,
            borderColor: "#c0272d",
            backgroundColor: "transparent",
            borderWidth: 2.5,
            tension: 0.2,
            pointRadius: 4,
            pointBackgroundColor: "#c0272d",
            spanGaps: false,
          },
          {
            label: `Ano ${anoComp}`,
            data: assTempoComp,
            borderColor: "#52525b",
            backgroundColor: "transparent",
            borderWidth: 2.5,
            tension: 0.2,
            pointRadius: 4,
            pointBackgroundColor: "#52525b",
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 28, bottom: 10 } },
        plugins: {
          legend: {
            position: "top",
            labels: { boxWidth: 14, font: { size: 11 }, padding: 12 },
          },
          tooltip: {
            callbacks: {
              label(ctx) {
                const v = ctx.parsed.y;
                return v != null
                  ? ` ${ctx.dataset.label}: ${v.toFixed(1)}h`
                  : ` ${ctx.dataset.label}: sem dados`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, maxRotation: 35, minRotation: 20 },
          },
          y: {
            grid: { color: grid },
            beginAtZero: true,
            ticks: { callback: (v) => v + "h" },
          },
        },
      },
      plugins: [
        {
          id: "assTempoAnnotation",
          afterDatasetsDraw(chart) {
            const { ctx } = chart;
            [0, 1].forEach((di) => {
              const ds = chart.data.datasets[di],
                meta = chart.getDatasetMeta(di);
              if (meta.hidden) return;
              meta.data.forEach((point, i) => {
                const v = ds.data[i];
                if (v == null || v === undefined) return;
                const label = v.toFixed(1) + "h",
                  yPos = point.y - 18;
                ctx.save();
                const tw = ctx.measureText(label).width + 10,
                  th = 14;
                ctx.fillStyle =
                  di === 0 ? "rgba(192,39,45,0.12)" : "rgba(82,82,91,0.12)";
                ctx.beginPath();
                ctx.roundRect(point.x - tw / 2, yPos - th / 2, tw, th, 4);
                ctx.fill();
                ctx.font = "bold 10px Inter, system-ui, sans-serif";
                ctx.fillStyle = ds.borderColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, point.x, yPos);
                ctx.restore();
              });
            });
          },
        },
      ],
    },
  );
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
  const t2025 = d.total2025 || 0,
    t2026 = d.total2026 || 0,
    total = d.totalGeral || t2025 + t2026;

  document.querySelector(".kpi-card.blue .kpi-value").textContent =
    total.toLocaleString("pt-BR");
  document.querySelector(".kpi-card.blue .kpi-sub").innerHTML =
    `<strong>${t2025.toLocaleString("pt-BR")}</strong> em ${d.anoBase || anoBase} · <strong>${t2026.toLocaleString("pt-BR")}</strong> em ${d.anoComp || anoComp}`;

  const allSat = [...(d.sat2025 || []), ...(d.sat2026 || [])].filter(
    (v) => v && v > 0,
  );
  const satMedia = allSat.length
    ? (allSat.reduce((a, b) => a + b, 0) / allSat.length)
        .toFixed(2)
        .replace(".", ",")
    : "4,87";
  document.querySelector(".kpi-card.blue2 .kpi-value").textContent = satMedia;
  document.querySelector(".kpi-card.blue2 .kpi-sub").textContent =
    `${d.avaliados || 0} avaliados (${d.totalFiltro ? ((d.avaliados / d.totalFiltro) * 100).toFixed(1) : 0}%)`;

  document.querySelector(".kpi-value-sla").textContent =
    (d.slaGlobal || 0).toFixed(1) + "%";

  document.querySelector(".kpi-card.green:last-child .kpi-value").textContent =
    (d.tempoMediano || 0) + "h";
  document.getElementById("filterBadge").textContent =
    `${total.toLocaleString("pt-BR")} chamados · Depto TI`;
}

// ── HELPERS DE INTERPRETAÇÃO EXECUTIVA (somente leitura dos dados já calculados) ──
function _mediaSimples(arr) {
  const v = (arr || []).filter((x) => x != null);
  return v.length
    ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2)
    : null;
}
function _medianaSimples(arr) {
  const v = (arr || []).filter((x) => x != null).sort((a, b) => a - b);
  if (!v.length) return null;
  const meio = Math.floor(v.length / 2);
  return +(v.length % 2 !== 0 ? v[meio] : (v[meio - 1] + v[meio]) / 2).toFixed(
    1,
  );
}
function _mediaPonderada(pctArr, pesoArr) {
  let num = 0,
    den = 0;
  (pctArr || []).forEach((p, i) => {
    const w = (pesoArr || [])[i];
    if (p != null && w) {
      num += p * w;
      den += w;
    }
  });
  return den ? +(num / den).toFixed(1) : null;
}
function _classificarVariacao(pct) {
  const p = Math.abs(pct);
  if (p < 3)
    return { texto: "estabilidade operacional", cor: "var(--accent2)" };
  if (pct >= 15)
    return { texto: "aumento expressivo da demanda", cor: "var(--accent3)" };
  if (pct >= 3)
    return { texto: "crescimento controlado", cor: "var(--accent4)" };
  if (pct <= -15)
    return { texto: "redução expressiva do volume", cor: "var(--accent4)" };
  return { texto: "redução moderada do volume", cor: "var(--accent4)" };
}
function _classificarSLA(v) {
  if (v >= 90)
    return { texto: "desempenho acima da meta", cor: "var(--accent4)" };
  if (v >= 75)
    return {
      texto: "dentro de faixa operacional aceitável, porém abaixo da meta",
      cor: "var(--accent5)",
    };
  return {
    texto: "abaixo da meta e requer atenção da gestão",
    cor: "var(--accent3)",
  };
}

function calcularInsights(d) {
  const { anoBase, anoComp } = getPeriodo();
  const meses = getMesesLabels();

  // ── Volume e tendência ──
  const tBase = d.volume2025.reduce((a, b) => a + b, 0),
    tComp = d.volume2026.reduce((a, b) => a + b, 0);
  const varPct = tComp > 0 ? +(((tBase - tComp) / tComp) * 100).toFixed(1) : 0;
  const variacao = _classificarVariacao(varPct);

  // ── Categoria líder e categoria com maior crescimento (apenas entre as top categorias exibidas) ──
  const catLider =
    d.categorias && d.categorias.length
      ? {
          nome: d.categorias[0],
          vBase: d.cat2025[0] || 0,
          vComp: d.cat2026[0] || 0,
        }
      : null;
  const catShare =
    catLider && tBase > 0 ? +((catLider.vBase / tBase) * 100).toFixed(1) : null;

  let catCresceu = null,
    catCresceuPct = -Infinity;
  (d.categorias || []).forEach((nome, i) => {
    const vB = d.cat2025[i] || 0,
      vC = d.cat2026[i] || 0;
    if (vC > 0) {
      const g = ((vB - vC) / vC) * 100;
      if (g > catCresceuPct) {
        catCresceuPct = g;
        catCresceu = { nome, vB, vC, g: +g.toFixed(1) };
      }
    }
  });
  const temCrescimentoRelevante = catCresceu && catCresceu.g >= 10;

  // ── Assunto líder (granularidade mais fina que categoria) ──
  const assTop = [...d.assuntosRaw].sort((a, b) => b.v2025 - a.v2025)[0];

  // ── Sazonalidade: mês de maior e menor volume no ano base ──
  const volPorMes = d.volume2025.map((v, i) => ({ mes: meses[i], v }));
  const mesMax = [...volPorMes].sort((a, b) => b.v - a.v)[0];
  const mesMin = [...volPorMes].sort((a, b) => a.v - b.v)[0];

  // ── SLA: combinado (igual ao KPI) + comparação aproximada entre os dois anos ──
  const slaStatus = _classificarSLA(d.slaGlobal || 0);
  const slaBaseAprox = _mediaPonderada(d.sla2025, d.volume2025);
  const slaCompAprox = _mediaPonderada(d.sla2026, d.volume2026);
  let slaTendenciaTxt = "";
  if (slaBaseAprox != null && slaCompAprox != null) {
    const diffSla = +(slaBaseAprox - slaCompAprox).toFixed(1);
    slaTendenciaTxt =
      diffSla > 1
        ? `melhora de ${diffSla}pp frente a ${anoComp}`
        : diffSla < -1
          ? `queda de ${Math.abs(diffSla)}pp frente a ${anoComp}`
          : `estável frente a ${anoComp}`;
  }

  // ── Satisfação ──
  const satBase = _mediaSimples(d.sat2025),
    satComp = _mediaSimples(d.sat2026);
  let satTendenciaTxt = "";
  if (satBase != null && satComp != null) {
    const diffSat = +(satBase - satComp).toFixed(2);
    satTendenciaTxt =
      diffSat > 0.03
        ? "melhora da satisfação"
        : diffSat < -0.03
          ? "queda na satisfação — ponto de atenção"
          : "satisfação estável";
  }

  // ── Tempo mediano: mês mais crítico ──
  const tempoPorMes = (d.tempoMediano2025 || [])
    .map((v, i) => ({ mes: meses[i], v }))
    .filter((x) => x.v != null);
  const tempoPico = tempoPorMes.length
    ? [...tempoPorMes].sort((a, b) => b.v - a.v)[0]
    : null;

  // ══════════════════════════════════════════════════════════════════════
  // ÁREA 1 — ANÁLISE DINÂMICA (resumo executivo)
  // ══════════════════════════════════════════════════════════════════════
  const c = document.getElementById("insightTextoDashboard");
  if (c) {
    const linhas = [];

    linhas.push(
      `🔹 <strong>Volume:</strong> ${tBase.toLocaleString("pt-BR")} chamados em ${meses[0]}–${meses[meses.length - 1]} ${anoBase}${tComp ? ` (vs ${tComp.toLocaleString("pt-BR")} em ${anoComp})` : ""} — <strong style="color:${variacao.cor}">${variacao.texto}</strong>${tComp ? ` de ${Math.abs(varPct)}%` : ""}.`,
    );

    if (catLider && catLider.vBase > 0) {
      linhas.push(
        `🔹 <strong>Categoria líder:</strong> <strong style="color:var(--accent)">"${catLider.nome}"</strong> concentra <strong>${catShare}%</strong> do volume (${catLider.vBase} chamados)${assTop && assTop.v2025 > 0 ? `; o assunto mais recorrente é <strong>"${assTop.label}"</strong> (${assTop.v2025} chamados)` : ""}.`,
      );
    }

    if (temCrescimentoRelevante) {
      linhas.push(
        `🔹 <strong>Alerta de demanda:</strong> <strong style="color:var(--accent3)">"${catCresceu.nome}"</strong> cresceu <strong>+${catCresceu.g}%</strong> frente a ${anoComp} (${catCresceu.vC} → ${catCresceu.vB} chamados) — merece investigação de causa raiz.`,
      );
    }

    linhas.push(
      `🔹 <strong>Sazonalidade:</strong> <strong>${mesMax.mes}</strong> concentrou o maior volume (${mesMax.v} chamados); <strong>${mesMin.mes}</strong> teve o menor (${mesMin.v}).`,
    );

    linhas.push(
      `🔹 <strong>SLA:</strong> <strong style="color:${slaStatus.cor};font-weight:bold">${(d.slaGlobal || 0).toFixed(1)}%</strong> — ${slaStatus.texto}${slaTendenciaTxt ? `, com ${slaTendenciaTxt}` : ""}.`,
    );

    linhas.push(
      `🔹 <strong>Satisfação e Tempo de Resposta:</strong> nota média ${satBase != null ? satBase.toFixed(2) : "—"}${satTendenciaTxt ? ` (${satTendenciaTxt})` : ""}; tempo mediano de resolução em <strong>${(d.tempoMediano || 0).toFixed(1)}h</strong>${tempoPico ? `, com pico em <strong>${tempoPico.mes}</strong> (${tempoPico.v.toFixed(1)}h)` : ""}.`,
    );

    c.innerHTML = `<div style="display:flex;flex-direction:column;gap:9px;">${linhas.map((l) => `<div>${l}</div>`).join("")}</div>`;
  }

  // ══════════════════════════════════════════════════════════════════════
  // ÁREA 2 — GARGALOS DO PERÍODO
  // ══════════════════════════════════════════════════════════════════════
  const l = document.getElementById("insightLateralOperacional");
  if (l) {
    const gargalos = [];

    if (catLider && catShare != null && catShare >= 20) {
      gargalos.push(
        `<p><strong style="color:#1c2133">Concentração de demanda:</strong> <strong>"${catLider.nome}"</strong> responde por <strong>${catShare}%</strong> de todos os chamados — risco de gargalo se a equipe responsável estiver subdimensionada.</p>`,
      );
    }

    // Mês com pior SLA no ano base
    const slaPorMes = (d.sla2025 || [])
      .map((v, i) => ({ mes: meses[i], v }))
      .filter((x) => x.v != null);
    if (slaPorMes.length) {
      const piorSla = [...slaPorMes].sort((a, b) => a.v - b.v)[0];
      if (piorSla.v < 75) {
        gargalos.push(
          `<p><strong style="color:#1c2133">Mês mais crítico (SLA):</strong> <strong>${piorSla.mes}</strong> registrou apenas <strong style="color:var(--accent3)">${piorSla.v.toFixed(1)}%</strong> dentro do prazo.</p>`,
        );
      }
    }

    if (tempoPico && tempoPico.v >= 48) {
      gargalos.push(
        `<p><strong style="color:#1c2133">Tempo de resolução elevado:</strong> <strong>${tempoPico.mes}</strong> teve mediana de <strong>${tempoPico.v.toFixed(1)}h</strong> (~${(tempoPico.v / 24).toFixed(1)} dias) para concluir chamados.</p>`,
      );
    }

    if (assTop && assTop.v2025 > 0 && tBase > 0) {
      const assShare = +((assTop.v2025 / tBase) * 100).toFixed(1);
      if (assShare >= 8) {
        gargalos.push(
          `<p><strong style="color:#1c2133">Assunto recorrente:</strong> <strong>"${assTop.label}"</strong> representa <strong>${assShare}%</strong> do volume total — candidato a automação ou base de conhecimento.</p>`,
        );
      }
    }

    if (temCrescimentoRelevante) {
      gargalos.push(
        `<p><strong style="color:#1c2133">Oportunidade de atenção:</strong> crescimento de <strong>+${catCresceu.g}%</strong> em <strong>"${catCresceu.nome}"</strong> pode exigir realocação de recursos.</p>`,
      );
    }

    if (!gargalos.length) {
      gargalos.push(
        `<p><strong style="color:var(--accent4)">Nenhum gargalo crítico identificado</strong> — operação dentro de parâmetros saudáveis no período analisado.</p>`,
      );
    }

    gargalos.push(
      `<p style="margin-top:4px;padding-top:8px;border-top:1px solid var(--border);"><strong style="color:#1c2133">SLA do período:</strong> ${(d.slaGlobal || 0).toFixed(1)}% (Resolvidos + Concluídos)</p>`,
    );

    l.innerHTML = gargalos.join("");
  }
}

function renderDashboard(d) {
  atualizarKPIs(d);
  initCharts(d);
  renderTabela(d.responsaveis);
  calcularInsights(d);
}

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
          status.textContent = "❌ Planilha inválida ou sem dados no período.";
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

// ── ATUALIZAR DO GOOGLE SHEETS ─────────────────────────────────────────────
function configurarGoogleSheets() {
  const btn = document.getElementById("btnSharePoint");
  const status = document.getElementById("statusImport"),
    nome = document.getElementById("nomeArquivo");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "⏳ Buscando...";
    status.textContent = "Conectando ao Google Sheets...";
    status.style.color = "var(--muted)";
    try {
      const dados = await buscarPlanilhaGoogleSheets();
      if (!dados) {
        status.textContent = "❌ Planilha sem dados no período selecionado.";
        status.style.color = "var(--accent3)";
        return;
      }
      dadosAtivos = dados;
      renderDashboard(dados);
      const agora = new Date().toLocaleString("pt-BR");
      status.textContent = `✅ ${dados.totalFiltro} chamados · Atualizado em ${agora}`;
      status.style.color = "var(--accent4)";
      nome.textContent = `Google Sheets · ${agora}`;
    } catch (err) {
      status.textContent = `❌ Erro: ${err.message}`;
      status.style.color = "var(--accent3)";
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;vertical-align:-2px"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>Atualizar da Planilha`;
    }
  });
}

// ── INICIALIZAÇÃO ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Força valores padrão corretos — sobrescreve cache do navegador
  const anoBaseEl = document.getElementById("anoBase");
  const mesInicioEl = document.getElementById("mesInicio");
  const mesFimEl = document.getElementById("mesFim");
  if (anoBaseEl) anoBaseEl.value = "2026";
  if (mesInicioEl) mesInicioEl.value = "1";
  if (mesFimEl) mesFimEl.value = "6";

  configurarImportacao();
  configurarGoogleSheets();

  ["anoBase", "mesInicio", "mesFim"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", () => {
      atualizarResumo();
      const status = document.getElementById("statusImport");
      if (dadosAtivos) {
        status.textContent =
          "⚠️ Período alterado — clique em 'Atualizar da Planilha' para atualizar.";
        status.style.color = "var(--accent5)";
      }
    });
  });

  atualizarResumo();
  renderDashboard(dadosPadrao);
});
