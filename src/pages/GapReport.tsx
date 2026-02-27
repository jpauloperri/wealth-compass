import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  TrendingDown,
  Zap,
  CheckCircle2,
  Clock,
  BarChart3,
  Target,
  Shield,
  ArrowRight,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import type { GapReport } from "@/types/gap-report";

const GapReportComponent = () => {
  const navigate = useNavigate();
  const { state } = useDiagnostic();
  const [exporting, setExporting] = useState(false);

  const report = state.diagnosisResult as GapReport | null;
  const clientName = state.questionnaire.nomeCompleto || "Cliente";

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Nenhum relatório disponível</h2>
          <p className="text-muted-foreground text-sm mb-6">Complete o questionário para gerar seu diagnóstico.</p>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Começar diagnóstico
          </Button>
        </div>
      </div>
    );
  }

  const { snapshot, gaps, riscos, ineficiencias, oportunidades, urgencia } = report;

  const getUrgenciaColor = (score: number) => {
    if (score >= 8) return "text-red-500";
    if (score >= 5) return "text-yellow-500";
    return "text-green-500";
  };

  const getUrgenciaIcon = (score: number) => {
    if (score >= 8) return "🔴";
    if (score >= 5) return "🟡";
    return "🟢";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Diagnóstico Patrimonial
          </h1>
          <p className="text-muted-foreground">
            {clientName} • {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Snapshot Card */}
        <div className="glass-card glow-border p-8 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">📊 Sua Estrutura Patrimonial</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Patrimônio Total</p>
              <p className="text-2xl font-bold text-foreground">{snapshot.patrimonioTotal}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Renda Mensal Líquida</p>
              <p className="text-2xl font-bold text-foreground">{snapshot.rendaMensal}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Margem de Poupança</p>
              <p className="text-2xl font-bold text-green-500">{snapshot.margemPoupanca}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Reserva de Emergência</p>
              <p className="text-lg font-bold text-foreground">{snapshot.reservaEmergencia.valor}</p>
              <p className={`text-sm ${snapshot.reservaEmergencia.status === "OK" ? "text-green-500" : "text-red-500"}`}>
                {snapshot.reservaEmergencia.meses} meses (ideal: {snapshot.reservaEmergencia.ideal})
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Índice de Endividamento</p>
              <p className="text-2xl font-bold text-foreground">{snapshot.indiceEndividamento.percentual}%</p>
              <p className={`text-sm ${snapshot.indiceEndividamento.status === "OK" ? "text-green-500" : "text-red-500"}`}>
                {snapshot.indiceEndividamento.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Perfil Identificado</p>
              <p className="text-lg font-bold text-primary">{snapshot.perfilIdentificado}</p>
              <p className="text-sm text-muted-foreground">Horizonte: {snapshot.horizonte}</p>
            </div>
          </div>
        </div>

        {/* Urgência Score */}
        <div className={`glass-card p-6 mb-8 border-l-4 ${urgencia.score >= 8 ? "border-red-500" : urgencia.score >= 5 ? "border-yellow-500" : "border-green-500"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Nível de Urgência</p>
              <p className={`text-4xl font-bold ${getUrgenciaColor(urgencia.score)}`}>
                {getUrgenciaIcon(urgencia.score)} {urgencia.score}/10
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{urgencia.justificativa}</p>
          </div>
        </div>

        {/* Gaps Críticos */}
        {gaps && gaps.length > 0 && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Gaps Críticos (O que falta)
            </h2>

            <div className="space-y-4">
              {gaps.map((gap, i) => (
                <div key={i} className="border-l-4 border-red-500/50 pl-4 py-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-foreground">{gap.descricao}</p>
                    <span className={`text-xs px-2 py-1 rounded ${gap.severidade === "Crítica" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"}`}>
                      {gap.severidade}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{gap.impacto}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riscos */}
        {riscos && riscos.length > 0 && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              Riscos Identificados (O que está errado)
            </h2>

            <div className="space-y-4">
              {riscos.map((risco, i) => (
                <div key={i} className="border-l-4 border-orange-500/50 pl-4 py-3">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-foreground">{risco.descricao}</p>
                    <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-500">
                      {risco.tipo}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantidade em Risco</p>
                      <p className="font-semibold text-foreground">{risco.quantidade}</p>
                    </div>
                    {risco.drawdown && (
                      <div>
                        <p className="text-muted-foreground">Drawdown Esperado</p>
                        <p className="font-semibold text-red-500">{risco.drawdown}</p>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">Impacto Financeiro</p>
                      <p className="font-semibold text-red-500">{risco.impactoFinanceiro}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ineficiências */}
        {ineficiencias && ineficiencias.length > 0 && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Ineficiências de Capital (Onde está sendo "comido")
            </h2>

            <div className="space-y-4">
              {ineficiencias.map((inefi, i) => (
                <div key={i} className="border-l-4 border-yellow-500/50 pl-4 py-3">
                  <p className="font-semibold text-foreground mb-2">{inefi.descricao}</p>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-secondary/50 rounded p-3">
                      <p className="text-muted-foreground text-xs mb-1">Custo Atual</p>
                      <p className="font-bold text-foreground">{inefi.custoAnualAtual}</p>
                    </div>

                    <div className="bg-secondary/50 rounded p-3">
                      <p className="text-muted-foreground text-xs mb-1">Custo Otimizado</p>
                      <p className="font-bold text-foreground">{inefi.custoAnualOtimizado}</p>
                    </div>

                    <div className="bg-green-500/10 rounded p-3 border border-green-500/20">
                      <p className="text-muted-foreground text-xs mb-1">Economia Anual</p>
                      <p className="font-bold text-green-500">{inefi.economiaAnual}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Oportunidades */}
        {oportunidades && oportunidades.length > 0 && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Oportunidades de Consultoria
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {oportunidades.map((oport, i) => (
                <div key={i} className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/5">
                  <p className="font-semibold text-foreground mb-2">{oport.tema}</p>
                  <p className="text-sm text-muted-foreground mb-3">{oport.descricao}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Impacto Esperado</p>
                      <p className="font-semibold text-blue-500">{oport.impacto}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Tempo de Implementação</p>
                      <p className="font-semibold text-foreground">{oport.tempoImplementacao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumo Executivo */}
        <div className="glass-card p-8 mb-8 bg-primary/5">
          <h2 className="text-xl font-bold text-foreground mb-4">📝 Resumo Executivo</h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{report.resumoExecutivo}</p>
        </div>

        {/* CTA Final */}
        <div className="glass-card p-8 border-2 border-primary/50 mb-8">
          <p className="text-muted-foreground mb-6">{report.ctaFinal}</p>

          <div className="flex flex-col gap-3">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              onClick={() => {
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    `Olá! Gostaria de agendar uma conversa sobre meu GAP REPORT. Cliente: ${clientName}`
                  )}`,
                  "_blank"
                );
              }}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Agendar Conversa com Consultor
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1 py-2"
                onClick={async () => {
                  setExporting(true);
                  try {
                    const { exportarGAPReportPDF } = await import("@/services/exportPDF");
                    exportarGAPReportPDF(report);
                  } catch (e) {
                    alert("❌ Erro ao exportar PDF");
                  } finally {
                    setExporting(false);
                  }
                }}
                disabled={exporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? "Gerando..." : "Exportar PDF"}
              </Button>

              <Button 
                variant="outline"
                className="flex-1 py-2"
                onClick={async () => {
                  try {
                    const { copiarParaClipboard } = await import("@/services/exportPDF");
                    await copiarParaClipboard(report);
                    alert("✅ GAP REPORT copiado!");
                  } catch (e) {
                    alert("❌ Erro ao copiar");
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
          </div>
        </div>

        {/* Voltar */}
        <div className="flex justify-center mb-10">
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refazer Diagnóstico
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GapReportComponent;
