/**
 * PDF Export Service - Gera PDF do GAP REPORT
 */

import html2pdf from "html2pdf.js";
import type { GapReport } from "@/types/gap-report";

/**
 * Formata valor monetário brasileiro
 */
function formatarMoeda(valor: string | number): string {
  if (typeof valor === "string") {
    return valor;
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Gera HTML do GAP REPORT
 */
function generateHTML(report: GapReport): string {
  const urgenciaColor =
    report.urgencia.score >= 8
      ? "#dc2626"
      : report.urgencia.score >= 5
        ? "#ea580c"
        : "#16a34a";

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GAP REPORT - ${report.cliente.nome}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f5f5f5;
          padding: 20px;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        header {
          border-bottom: 3px solid #0ea5e9;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        h1 {
          font-size: 28px;
          color: #0ea5e9;
          margin: 0;
        }
        .header-info {
          font-size: 14px;
          color: #666;
        }
        .cliente-info {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #0ea5e9;
        }
        .cliente-info p {
          margin: 5px 0;
          font-size: 14px;
        }
        .cliente-info strong {
          color: #0ea5e9;
        }
        
        section {
          margin-bottom: 30px;
        }
        section h2 {
          font-size: 18px;
          color: #1e40af;
          border-bottom: 2px solid #dbeafe;
          padding-bottom: 10px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        section h2::before {
          font-size: 20px;
        }
        
        .snapshot {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .snapshot-item {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
        }
        .snapshot-item label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }
        .snapshot-item value {
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
          display: block;
          margin-top: 5px;
        }
        
        .gap-item, .risco-item, .ineficiencia-item, .oportunidade-item {
          background: #f8fafc;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          border-left: 4px solid;
        }
        
        .gap-item { border-left-color: #dc2626; }
        .risco-item { border-left-color: #ea580c; }
        .ineficiencia-item { border-left-color: #eab308; }
        .oportunidade-item { border-left-color: #0ea5e9; }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .item-titulo {
          font-weight: 600;
          color: #1e40af;
        }
        .severidade, .categoria {
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .severidade-critica { background: #fecaca; color: #7f1d1d; }
        .severidade-alta { background: #fed7aa; color: #7c2d12; }
        .severidade-media { background: #fef3c7; color: #78350f; }
        
        .item-descricao {
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }
        
        .item-impacto, .item-economia {
          margin-top: 10px;
          padding: 10px;
          background: rgba(0,0,0,0.02);
          border-radius: 4px;
          font-size: 13px;
          color: #333;
          font-weight: 600;
        }
        
        .urgencia-section {
          background: linear-gradient(135deg, ${urgenciaColor} 0%, ${urgenciaColor}dd 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .urgencia-score {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .urgencia-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 15px;
        }
        .urgencia-justificativa {
          font-size: 14px;
          line-height: 1.6;
        }
        
        .resumo-executivo {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          color: #1e40af;
          line-height: 1.8;
          font-size: 14px;
        }
        
        .cta-final {
          background: #0ea5e9;
          color: white;
          padding: 25px;
          border-radius: 8px;
          margin-top: 30px;
          line-height: 1.8;
          font-size: 14px;
          text-align: center;
        }
        
        footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
        
        .page-break {
          page-break-after: always;
        }
        
        @media print {
          body { background: white; }
          .container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <div class="header-top">
            <h1>📊 GAP REPORT</h1>
            <div class="header-info">
              <p>Data: ${new Date(report.snapshot.patrimonioTotal || new Date()).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
          <div class="cliente-info">
            <p><strong>Cliente:</strong> ${report.cliente.nome}</p>
            <p><strong>Idade:</strong> ${report.cliente.idade} anos | <strong>Profissão:</strong> ${report.cliente.profissao}</p>
          </div>
        </header>

        <!-- SNAPSHOT PATRIMONIAL -->
        <section>
          <h2>📈 Snapshot Patrimonial</h2>
          <div class="snapshot">
            <div class="snapshot-item">
              <label>Patrimônio Total</label>
              <value>${report.snapshot.patrimonioTotal}</value>
            </div>
            <div class="snapshot-item">
              <label>Renda Mensal</label>
              <value>${report.snapshot.rendaMensal}</value>
            </div>
            <div class="snapshot-item">
              <label>Despesas Fixas</label>
              <value>${report.snapshot.despesasFixas}</value>
            </div>
            <div class="snapshot-item">
              <label>Margem de Poupança</label>
              <value>${report.snapshot.margemPoupanca}</value>
            </div>
            <div class="snapshot-item">
              <label>Reserva de Emergência</label>
              <value>${report.snapshot.reservaEmergencia.valor}</value>
              <p style="margin-top: 5px; font-size: 12px; color: #666;">
                ${report.snapshot.reservaEmergencia.meses} meses | Status: <strong>${report.snapshot.reservaEmergencia.status}</strong>
              </p>
            </div>
            <div class="snapshot-item">
              <label>Índice de Endividamento</label>
              <value>${report.snapshot.indiceEndividamento.percentual}%</value>
              <p style="margin-top: 5px; font-size: 12px; color: #666;">Status: <strong>${report.snapshot.indiceEndividamento.status}</strong></p>
            </div>
            <div class="snapshot-item">
              <label>Horizonte de Investimento</label>
              <value>${report.snapshot.horizonte}</value>
            </div>
            <div class="snapshot-item">
              <label>Perfil Identificado</label>
              <value>${report.snapshot.perfilIdentificado}</value>
            </div>
          </div>
        </section>

        <!-- GAPS CRÍTICOS -->
        <section>
          <h2>❌ Gaps Críticos</h2>
          ${report.gaps
            .map(
              (gap) => `
            <div class="gap-item">
              <div class="item-header">
                <div class="item-titulo">${gap.tipo}</div>
                <span class="severidade severidade-${gap.severidade.toLowerCase()}">${gap.severidade}</span>
              </div>
              <div class="item-descricao">${gap.descricao}</div>
              <div class="item-impacto"><strong>Impacto:</strong> ${gap.impacto}</div>
            </div>
          `
            )
            .join("")}
        </section>

        <!-- RISCOS -->
        <section>
          <h2>⚠️ Riscos Identificados</h2>
          ${report.riscos
            .map(
              (risco) => `
            <div class="risco-item">
              <div class="item-header">
                <div class="item-titulo">${risco.tipo}</div>
                <span class="severidade severidade-${risco.severidade.toLowerCase()}">${risco.severidade}</span>
              </div>
              <div class="item-descricao">${risco.descricao}</div>
              ${risco.quantidade ? `<div style="margin-top: 8px; font-size: 13px;"><strong>Quantidade:</strong> ${risco.quantidade}</div>` : ""}
              ${risco.drawdown ? `<div style="margin-top: 8px; font-size: 13px;"><strong>Drawdown:</strong> ${risco.drawdown}</div>` : ""}
              <div class="item-impacto"><strong>Impacto Financeiro:</strong> ${risco.impactoFinanceiro}</div>
            </div>
          `
            )
            .join("")}
        </section>

        <!-- INEFICIÊNCIAS -->
        <section>
          <h2>💸 Ineficiências de Capital</h2>
          ${report.ineficiencias
            .map(
              (inef) => `
            <div class="ineficiencia-item">
              <div class="item-header">
                <div class="item-titulo">${inef.categoria}</div>
              </div>
              <div class="item-descricao">${inef.descricao}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-size: 13px;">
                <div><strong>Custo Atual:</strong> ${inef.custoAnualAtual}</div>
                <div><strong>Custo Otimizado:</strong> ${inef.custoAnualOtimizado}</div>
              </div>
              <div class="item-economia"><strong>💰 Economia Anual:</strong> ${inef.economiaAnual}</div>
            </div>
          `
            )
            .join("")}
        </section>

        <!-- OPORTUNIDADES -->
        <section>
          <h2>🎯 Oportunidades de Consultoria</h2>
          ${report.oportunidades
            .map(
              (op) => `
            <div class="oportunidade-item">
              <div class="item-titulo">${op.tema}</div>
              <div class="item-descricao" style="margin-top: 8px;">${op.descricao}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-size: 13px;">
                <div><strong>Impacto:</strong> ${op.impacto}</div>
                <div><strong>Timing:</strong> ${op.tempoImplementacao}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </section>

        <!-- URGÊNCIA -->
        <div class="urgencia-section">
          <div class="urgencia-label">Score de Urgência</div>
          <div class="urgencia-score">${report.urgencia.score}/10</div>
          <div class="urgencia-justificativa">${report.urgencia.justificativa}</div>
        </div>

        <!-- RESUMO EXECUTIVO -->
        <section>
          <h2>📋 Resumo Executivo</h2>
          <div class="resumo-executivo">
            ${report.resumoExecutivo}
          </div>
        </section>

        <!-- CTA FINAL -->
        <div class="cta-final">
          ${report.ctaFinal}
        </div>

        <footer>
          <p>Este relatório é uma análise automatizada baseada nas informações fornecidas.</p>
          <p>Rentabilidade passada não garante rentabilidade futura. Consulte um profissional certificado antes de tomar decisões de investimento.</p>
          <p>Gerado em ${new Date().toLocaleString("pt-BR")}</p>
        </footer>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Exporta GAP REPORT como PDF
 */
export async function exportarGAPReportPDF(report: GapReport): Promise<void> {
  try {
    const html = generateHTML(report);

    const element = document.createElement("div");
    element.innerHTML = html;

    const options = {
      margin: 10,
      filename: `GAP_REPORT_${report.cliente.nome.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        orientation: "portrait" as const,
        unit: "mm",
        format: "a4",
      },
    };

    html2pdf().set(options).from(element).save();
  } catch (e) {
    console.error("Erro ao exportar PDF:", e);
    throw new Error(`Falha ao gerar PDF: ${e instanceof Error ? e.message : "Erro desconhecido"}`);
  }
}

/**
 * Copia GAP REPORT em formato texto para clipboard
 */
export async function copiarParaClipboard(report: GapReport): Promise<void> {
  const texto = `
GAP REPORT - ${report.cliente.nome}
Data: ${new Date().toLocaleDateString("pt-BR")}

=== SNAPSHOT PATRIMONIAL ===
Patrimônio Total: ${report.snapshot.patrimonioTotal}
Renda Mensal: ${report.snapshot.rendaMensal}
Despesas Fixas: ${report.snapshot.despesasFixas}
Margem de Poupança: ${report.snapshot.margemPoupanca}
Reserva de Emergência: ${report.snapshot.reservaEmergencia.valor} (${report.snapshot.reservaEmergencia.meses} meses)
Índice de Endividamento: ${report.snapshot.indiceEndividamento.percentual}%
Horizonte: ${report.snapshot.horizonte}
Perfil: ${report.snapshot.perfilIdentificado}

=== GAPS CRÍTICOS ===
${report.gaps.map((g) => `- [${g.severidade}] ${g.tipo}: ${g.descricao}\n  Impacto: ${g.impacto}`).join("\n\n")}

=== RISCOS ===
${report.riscos.map((r) => `- [${r.severidade}] ${r.tipo}: ${r.descricao}\n  Impacto: ${r.impactoFinanceiro}`).join("\n\n")}

=== INEFICIÊNCIAS ===
${report.ineficiencias.map((i) => `- ${i.categoria}: ${i.descricao}\n  Custo Atual: ${i.custoAnualAtual} → Otimizado: ${i.custoAnualOtimizado}\n  Economia: ${i.economiaAnual}`).join("\n\n")}

=== OPORTUNIDADES ===
${report.oportunidades.map((o) => `- ${o.tema}: ${o.descricao}\n  Impacto: ${o.impacto} | Timing: ${o.tempoImplementacao}`).join("\n\n")}

=== URGÊNCIA ===
Score: ${report.urgencia.score}/10
${report.urgencia.justificativa}

=== RESUMO EXECUTIVO ===
${report.resumoExecutivo}

=== CTA ===
${report.ctaFinal}
  `;

  try {
    await navigator.clipboard.writeText(texto);
    console.log("✅ Copiado para clipboard");
  } catch (e) {
    console.error("Erro ao copiar:", e);
    throw new Error("Falha ao copiar para clipboard");
  }
}
