/**
 * PDF OCR & Extract Parser Service
 * Extrai dados de extratos em PDF (Tesouro, Corretora, Banco, Previdência)
 */

import type { ExtratoParsed } from "@/types/gap-report";
import * as pdfjsLib from "pdfjs-dist";

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extrai texto de PDF usando pdfjs-dist
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textCompleto = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textoPage = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      textCompleto += textoPage + "\n";
    }

    return textCompleto;
  } catch (e) {
    console.error("PDF extraction error:", e);
    throw new Error(`Falha ao ler PDF: ${e instanceof Error ? e.message : "Erro desconhecido"}`);
  }
}

/**
 * Parse extrato de Tesouro Direto
 */
function parseTesouroDireto(text: string): Partial<ExtratoParsed> {
  const saldos: Record<string, number> = {};

  // Padrões de títulos
  const padroes = [
    /Tesouro\s+(?:IPCA|Selic|Prefixado)\s+.*?[\s$R]+([0-9.,]+)/gi,
    /Saldo\s+(?:Tesouro|IPCA|Selic).*?[\s$R]+([0-9.,]+)/gi,
  ];

  padroes.forEach((padrao) => {
    let match;
    while ((match = padrao.exec(text)) !== null) {
      const valor = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
      if (valor > 0) {
        const titulo = text.substring(Math.max(0, match.index - 50), match.index)
          .split("\n").pop() || "Tesouro";
        saldos[titulo.trim()] = valor;
      }
    }
  });

  return {
    tipo: "Tesouro" as const,
    saldos,
  };
}

/**
 * Parse extrato de Corretora
 */
function parseCorretora(text: string): Partial<ExtratoParsed> {
  const saldos: Record<string, number> = {};
  const taxas: Record<string, number> = {};

  // Renda Fixa
  const rfMatch = text.match(/Renda\s+Fixa\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (rfMatch) {
    saldos["Renda Fixa"] = parseFloat(rfMatch[1].replace(/\./g, "").replace(",", "."));
  }

  // Renda Variável
  const rvMatch = text.match(/Renda\s+Variável\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (rvMatch) {
    saldos["Renda Variável"] = parseFloat(rvMatch[1].replace(/\./g, "").replace(",", "."));
  }

  // Fundos
  const fundsMatch = text.match(/Fundos?\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (fundsMatch) {
    saldos["Fundos"] = parseFloat(fundsMatch[1].replace(/\./g, "").replace(",", "."));
  }

  // Taxa
  const taxaMatch = text.match(/Taxa\s+(?:de\s+)?(?:administração|corretagem)\s*:?\s*([0-9.,]+)%/i);
  if (taxaMatch) {
    taxas["Taxa"] = parseFloat(taxaMatch[1].replace(",", "."));
  }

  return {
    tipo: "Corretora" as const,
    saldos,
    taxas,
  };
}

/**
 * Parse extrato de Banco
 */
function parseBanco(text: string): Partial<ExtratoParsed> {
  const saldos: Record<string, number> = {};

  const cdbMatch = text.match(/CDB\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (cdbMatch) {
    saldos["CDB"] = parseFloat(cdbMatch[1].replace(/\./g, "").replace(",", "."));
  }

  const lciMatch = text.match(/LCI\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (lciMatch) {
    saldos["LCI"] = parseFloat(lciMatch[1].replace(/\./g, "").replace(",", "."));
  }

  const lcaMatch = text.match(/LCA\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (lcaMatch) {
    saldos["LCA"] = parseFloat(lcaMatch[1].replace(/\./g, "").replace(",", "."));
  }

  const appMatch = text.match(/(?:Saldo|Aplicação|Poupança)\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (appMatch) {
    saldos["Aplicações"] = parseFloat(appMatch[1].replace(/\./g, "").replace(",", "."));
  }

  return {
    tipo: "Banco" as const,
    saldos,
  };
}

/**
 * Parse extrato de Previdência
 */
function parsePrevidencia(text: string): Partial<ExtratoParsed> {
  const saldos: Record<string, number> = {};

  const saldoMatch = text.match(/(?:Saldo\s+)?Total\s+[\s\S]*?R\$\s+([0-9.,]+)/i);
  if (saldoMatch) {
    saldos["Previdência Privada"] = parseFloat(saldoMatch[1].replace(/\./g, "").replace(",", "."));
  }

  const tipo = text.includes("PGBL") ? "PGBL" : text.includes("VGBL") ? "VGBL" : "Previdência";
  if (saldos["Previdência Privada"]) {
    saldos[tipo] = saldos["Previdência Privada"];
    delete saldos["Previdência Privada"];
  }

  return {
    tipo: "Previdência" as const,
    saldos,
  };
}

/**
 * Detecta tipo de extrato
 */
function detectTipoExtrato(text: string): "Tesouro" | "Corretora" | "Banco" | "Previdência" | "Outro" {
  const textoNormalizado = text.toUpperCase();

  if (textoNormalizado.includes("TESOURO DIRETO") || textoNormalizado.includes("B3")) {
    return "Tesouro";
  }
  if (
    textoNormalizado.includes("CORRETORA") ||
    textoNormalizado.includes("XP") ||
    textoNormalizado.includes("GENIAL") ||
    textoNormalizado.includes("CLEAR")
  ) {
    return "Corretora";
  }
  if (
    textoNormalizado.includes("BANCO") ||
    textoNormalizado.includes("CDB") ||
    textoNormalizado.includes("LCI") ||
    textoNormalizado.includes("LCA")
  ) {
    return "Banco";
  }
  if (textoNormalizado.includes("PREVIDÊNCIA") || textoNormalizado.includes("PGBL") || textoNormalizado.includes("VGBL")) {
    return "Previdência";
  }

  return "Outro";
}

/**
 * Main: Processa PDF extraído como texto
 */
export async function parseExtratoFinanceiro(textoDoPDF: string, nomeArquivo: string): Promise<ExtratoParsed> {
  const tipo = detectTipoExtrato(textoDoPDF);

  let resultado: Partial<ExtratoParsed> = {
    tipo,
    dataExtracao: new Date().toISOString().split("T")[0],
  };

  switch (tipo) {
    case "Tesouro":
      resultado = { ...resultado, ...parseTesouroDireto(textoDoPDF) };
      break;
    case "Corretora":
      resultado = { ...resultado, ...parseCorretora(textoDoPDF) };
      break;
    case "Banco":
      resultado = { ...resultado, ...parseBanco(textoDoPDF) };
      break;
    case "Previdência":
      resultado = { ...resultado, ...parsePrevidencia(textoDoPDF) };
      break;
    default:
      // Fallback genérico
      const valoresGenericosMatch = textoDoPDF.matchAll(/R\$\s+([0-9.,]+)/g);
      const valores = Array.from(valoresGenericosMatch).map((m) =>
        parseFloat(m[1].replace(/\./g, "").replace(",", "."))
      );
      if (valores.length > 0) {
        resultado.saldos = { Aplicações: valores.reduce((a, b) => a + b, 0) };
      }
  }

  return resultado as ExtratoParsed;
}

/**
 * Processa múltiplos PDFs
 */
export async function processarExtratosMultiplos(files: File[]): Promise<ExtratoParsed[]> {
  const resultados: ExtratoParsed[] = [];

  for (const file of files) {
    try {
      console.log(`📖 Lendo PDF: ${file.name}`);
      let texto = "";

      if (file.type === "application/pdf") {
        texto = await extractTextFromPDF(file);
      } else if (file.type.startsWith("text/")) {
        texto = await file.text();
      } else {
        console.warn(`⚠️ Formato não suportado: ${file.name}`);
        continue;
      }

      const extrato = await parseExtratoFinanceiro(texto, file.name);
      if (Object.keys(extrato.saldos || {}).length > 0) {
        console.log(`✅ Extraído: ${extrato.tipo}`);
        resultados.push(extrato);
      }
    } catch (e) {
      console.error(`❌ Erro ao processar ${file.name}:`, e);
    }
  }

  return resultados;
}

/**
 * Consolida múltiplos extratos
 */
export function consolidarExtratos(extratos: ExtratoParsed[]): {
  totalPorClasse: Record<string, number>;
  totalGeral: number;
  taxasImplicitas: Record<string, number>;
} {
  let totalGeral = 0;
  const totalPorClasse: Record<string, number> = {};
  const taxasImplicitas: Record<string, number> = {};

  for (const extrato of extratos) {
    for (const [chave, valor] of Object.entries(extrato.saldos || {})) {
      totalPorClasse[chave] = (totalPorClasse[chave] || 0) + valor;
      totalGeral += valor;
    }

    for (const [chave, valor] of Object.entries(extrato.taxas || {})) {
      taxasImplicitas[chave] = (taxasImplicitas[chave] || 0) + valor;
    }
  }

  return {
    totalPorClasse,
    totalGeral,
    taxasImplicitas,
  };
}
