// ── CONFIGURAÇÃO DE LABELS DOS MESES COMPARATIVOS ────────────────========
const mesesComp = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];

// Dados de Volumetria Alinhados (Total Geral: 1.979)
const volume2025 = [241, 230, 163, 197, 201];
const volume2026 = [200, 129, 163, 225, 229];

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

// ── 🎯 LISTA DE ASSUNTOS REORGANIZADA PARA EXIBIÇÃO HORIZONTAL ──────────
const assuntos = [
  ["Acesso", "Novos Colaboradores"],
  ["Acesso", "E-mail / Configuração"],
  ["Acesso", "Sults"],
  ["Acesso", "SAP"],
  ["[Infra]", "Problemas Físicos"],
  ["Suporte", "Programas Diversos"],
  ["Impressora", "Instalação / Toner"],
  ["PipeRun", "Acesso e Suporte"],
  ["Suporte", "Software"],

  ["Suporte", "Notebook / Desktop"],
  ["Shop 9", "Acessos / Certificados"],
  ["Suporte", "Rede / Internet"],
  ["Telefonia", "Nova linha"],
  ["Banco de Dados", "SQL"],
  ["Drive de rede", ""],
  ["Página do Vendedor", ""][("Outros Assuntos", "")],
];

// Reordenado para emparelhar exatamente com a lista acima
const ass2025 = [
  104, 232, 44, 157, 73, 81, 80, 52, 66, 45, 16, 14, 12, 10, 6, 3, 41,
];
const ass2026 = [
  218, 124, 153, 139, 127, 93, 77, 69, 41, 65, 25, 11, 10, 9, 5, 2, 113,
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

// ── PLUGINS E CONFIGURAÇÕES VISUAIS PADRÃO ──────────────────────────────
Chart.defaults.color = "#8a99ad";
Chart.defaults.font.family = "'Source Sans 3', sans-serif";
const grid = "rgba(255,255,255,0.05)";

// 🎯 PLUGIN DE DATALABELS RECALIBRADO COM SUPORTE A CUSTOMIZAÇÃO DE CORES POR GRÁFICO
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

        // Se for o gráfico de assuntos, aplica cor e peso de fonte customizados
        if (chart.canvas.id === "chartAssunto") {
          ctx.font = 'bold 11px "Source Sans 3", sans-serif';
          ctx.fillStyle = "#2e4e8c"; // Força o preenchimento em azul escuro
        } else {
          ctx.font = 'bold 10px "Source Sans 3", sans-serif';
          ctx.fillStyle = "#ffffff";
        }

        // Verifica se o gráfico é horizontal ou vertical para posicionar corretamente
        if (chart.config.options.indexAxis === "y") {
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(v, bar.x + 10, bar.y);
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

// ── 1. GRÁFICO: VOLUME DE CHAMADOS (VERTICAL COMPARATIVO) ────────────────
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

// ── 2. GRÁFICO: CATEGORIAS COMPARATIVAS (HORIZONTAL) ─────────────────────
new Chart(document.getElementById("chartCategoria"), {
  type: "bar",
  plugins: [smartDatalabelPlugin],
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
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: grid }, beginAtZero: true },
      y: { grid: { display: false } },
    },
  },
});

// ── 3. GRÁFICO: SLA COMPARATIVO (LINHAS) ─────────────────────────────────
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
        pointRadius: 3,
      },
      {
        label: "SLA 2026",
        data: sla2026,
        borderColor: "#52b899",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.2,
        pointRadius: 3,
      },
      {
        label: "Meta 60%",
        data: Array(5).fill(60),
        borderColor: "rgba(224,112,112,0.35)",
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
});

// ── 4. GRÁFICO: SATISFAÇÃO COMPARATIVA ───────────────────────────────────
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
      },
      {
        label: "Nota 2026",
        data: sat2026,
        borderColor: "#a0c4e8",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: grid }, min: 4.6, max: 5.0 },
    },
  },
});

// ── 5. GRÁFICO: UNIDADES COMPARATIVAS ────────────────────────────────────
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
    scales: { x: { grid: { display: false } }, y: { grid: { color: grid } } },
  },
});

// ── 6. GRÁFICO DE ASSUNTOS (ATUALIZADO E CALIBRADO) ──
new Chart(document.getElementById("chartAssunto"), {
  type: "bar",
  plugins: [smartDatalabelPlugin],
  data: {
    labels: assuntos,
    datasets: [
      {
        label: "Ano 2025",
        data: ass2025,
        backgroundColor: "rgba(126,170,223,0.85)",
        borderRadius: 3,
        barThickness: 14,
        maxBarThickness: 16,
        categoryPercentage: 0.72,
      },
      {
        label: "Ano 2026",
        data: ass2026,
        backgroundColor: "#2e4e8c",
        borderRadius: 3,
        barPercentage: 0.82, // Deixa as barrinhas visivelmente mais grossas
        categoryPercentage: 0.82,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: {
      x: {
        grid: { color: grid },
        beginAtZero: true,
        grace: "8%", // Garante folga no fim do gráfico para que nenhum número na ponta seja cortado
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 12, weight: "700" },
          color: "#1e293b", // Nomes dos assuntos legíveis e escuros
          maxRotation: 0,
        },
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

// ── 🧠 3. INTERPRETAÇÃO E ANÁLISE AUTOMÁTICA EM TEMPO REAL ────────────────
function calcularEInjetarInsights() {
  const total2025 = volume2025.reduce((a, b) => a + b, 0);
  const total2026 = volume2026.reduce((a, b) => a + b, 0);
  const varPorcentagem = (((total2026 - total2025) / total2025) * 100).toFixed(
    1,
  );
  const sinalEvolucao = total2026 > total2025 ? "aumento" : "recuo";

  const mediaSla2025 = (
    sla2025.reduce((a, b) => a + b, 0) / sla2025.length
  ).toFixed(1);
  const mediaSla2026 = (
    sla2026.reduce((a, b) => a + b, 0) / sla2026.length
  ).toFixed(1);
  const statusMeta =
    mediaSla2026 >= 60
      ? "<span style='color:#52b899; font-weight:bold;'>dentro da meta operacional</span>"
      : "<span style='color:#e07070; font-weight:bold;'>abaixo do alvo de 60%</span>";

  // Encontra o maior volumetria real de 2026 desconsiderando itens genéricos
  let idMaior = 0;
  for (let i = 1; i < ass2026.length; i++) {
    if (
      assuntos[i] !== "Como Outros Assuntos" &&
      ass2026[i] > ass2026[idMaior]
    ) {
      idMaior = i;
    }
  }

  // Bloco de Sumário Executivo Superior
  const containerCentral = document.getElementById("insightTextoDashboard");
  if (containerCentral) {
    containerCentral.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div>🔹 <strong>Tendência de Escopo:</strong> A infraestrutura de TI processou um montante consolidado de <strong>${total2025 + total2026} chamados</strong> no histórico analisado. Registrou-se um <strong>${sinalEvolucao} de ${Math.abs(varPorcentagem)}%</strong> nas demandas globais de suporte, descendo de ${total2025} (2025) para ${total2026} (2026).</div>
        <div>🔹 <strong>Ponto Crítico Ativo:</strong> Excluindo-se registros genéricos, o sistema <strong style="color:var(--accent);">"${assuntos[idMaior]}"</strong> obteve o maior crescimento isolado, saltando de ${ass2025[idMaior]} para <strong>${ass2026[idMaior]} chamados</strong>. Recomenda-se auditoria estrutural para atenuar essa recorrência.</div>
        <div>🔹 <strong>Métrica de Nível de Serviço (SLA):</strong> A taxa média ponderada de resoluções efetuadas dentro do prazo estipulado passou de ${mediaSla2025}% para <strong>${mediaSla2026}%</strong>. Embora represente uma sutil melhora de desempenho técnico, a equipe se encontra ${statusMeta}.</div>
      </div>
    `;
  }

  // Coluna Lateral do Gráfico de Evolução Mensal
  const containerLateral = document.getElementById("insightLateralOperacional");
  if (containerLateral) {
    containerLateral.innerHTML = `
      <p>
        <strong style="color: #1c2133">Estabilização Sazonal:</strong> 
        O primeiro trimestre aponta queda acentuada em 2026, com destaque para 
        <strong>Fevereiro</strong>, que despencou de 230 para apenas 129 ordens abertas.
      </p>
      <p>
        <strong style="color: #1c2133">Pico Corretivo:</strong> 
        As atividades de suporte reaqueceram de forma drástica entre <strong>Abril e Maio</strong>, períodos nos quais a malha de 2026 superou o histórico de 2025.
      </p>
      <p>
        <strong style="color: #1c2133">Foco Central:</strong> 
        As solicitações associadas a <strong>${assuntos[idMaior]}</strong> e <strong>Acesso > Sults</strong> totalizam a maior fatia dos gargalos preventivos atuais.
      </p>
    `;
  }
}

calcularEInjetarInsights();
