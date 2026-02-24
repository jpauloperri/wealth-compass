import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Brain, BarChart3, AlertTriangle, TrendingUp, Target, ArrowLeftRight,
  Package, PieChart, Shield, Heart, Activity, RefreshCw, Calculator,
  FileText, Download, RotateCcw, Share2, DollarSign, Layers,
} from "lucide-react";
import { PieChart as RPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(200, 70%, 50%)",
  "hsl(45, 90%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 70%, 55%)",
  "hsl(120, 50%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(210, 60%, 45%)",
  "hsl(340, 60%, 50%)",
  "hsl(60, 70%, 50%)",
];

const SectionIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
    <Icon className="w-4 h-4 text-primary" />
  </div>
);

const Results = () => {
  const navigate = useNavigate();
  const { state } = useDiagnostic();
  const d = state.diagnosisResult;
  const clientName = state.questionnaire.nomeCompleto || "Cliente";

  // If no diagnosis data, show fallback
  if (!d) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Nenhum diagnóstico disponível</h2>
          <p className="text-muted-foreground text-sm mb-6">Complete o questionário para gerar seu diagnóstico patrimonial.</p>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Começar diagnóstico
          </Button>
        </div>
      </div>
    );
  }

  const ips = d.ips || {};
  const comportamental = d.comportamental;
  const carteiraAtual = d.carteiraAtual || [];
  const alertas = d.alertasCriticos || [];
  const fluxo = d.fluxoCaixa || {};
  const carteiraAlvo = (d.carteiraAlvo || []).map((item: any, i: number) => ({ ...item, color: COLORS[i % COLORS.length] }));
  const comparativo = d.comparativo || [];
  const carteiraFinal = d.carteiraFinal || [];
  const movimentacoes = d.movimentacoes || [];
  const parametros = d.parametros || {};
  const tributaria = d.estrategiaTributaria || [];
  const escudo = d.escudoPatrimonial || {};
  const riscos = d.riscosEMitigantes || [];
  const followUp = d.followUp || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* IPS Summary Card */}
        <div className="glass-card glow-border p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">Política de Investimento — Resumo</h1>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Cliente:</span> <span className="text-foreground font-medium ml-2">{clientName}</span></div>
            <div><span className="text-muted-foreground">Data:</span> <span className="text-foreground font-medium ml-2">{new Date().toLocaleDateString("pt-BR")}</span></div>
            <div><span className="text-muted-foreground">Perfil:</span> <span className="text-primary font-medium ml-2">{ips.perfil || "—"}</span></div>
            <div><span className="text-muted-foreground">Horizonte:</span> <span className="text-foreground font-medium ml-2">{ips.horizonte || "—"}</span></div>
            <div><span className="text-muted-foreground">Patrimônio:</span> <span className="text-foreground font-medium ml-2">{ips.patrimonioFinanceiro || state.questionnaire.patrimonioFinanceiro || "—"}</span></div>
            <div><span className="text-muted-foreground">Retorno Esperado:</span> <span className="text-foreground font-medium ml-2">{ips.retornoEsperado || "—"}</span></div>
            <div><span className="text-muted-foreground">Drawdown Máx.:</span> <span className="text-foreground font-medium ml-2">{ips.drawdownMaximo || "—"}</span></div>
            <div><span className="text-muted-foreground">Próxima Revisão:</span> <span className="text-foreground font-medium ml-2">{ips.proximaRevisao || "—"}</span></div>
            {ips.benchmark && (
              <div className="md:col-span-2"><span className="text-muted-foreground">Benchmark:</span> <span className="text-foreground font-medium ml-2">{ips.benchmark}</span></div>
            )}
            {ips.objetivo && (
              <div className="md:col-span-2"><span className="text-muted-foreground">Objetivo:</span> <span className="text-foreground font-medium ml-2">{ips.objetivo}</span></div>
            )}
          </div>
        </div>

        {/* Sections */}
        <Accordion type="multiple" defaultValue={["comportamental", "carteira", "alertas", "fluxo", "alvo", "comparativo", "movimentacoes", "final", "parametros", "tributaria", "escudo", "riscos", "followup"]} className="space-y-3">
          {/* Behavioral Profile */}
          {comportamental && (
            <AccordionItem value="comportamental" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={Brain} />
                  <span className="font-display font-semibold text-foreground">Perfil Comportamental</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-secondary-foreground space-y-4">
                {comportamental.padraoEmocional && (
                  <div>
                    <h4 className="text-foreground font-medium mb-1">Padrão Emocional</h4>
                    <p>{comportamental.padraoEmocional}</p>
                  </div>
                )}
                {comportamental.viesesIdentificados && (
                  <div>
                    <h4 className="text-foreground font-medium mb-1">Vieses Identificados</h4>
                    <p>{comportamental.viesesIdentificados}</p>
                  </div>
                )}
                {comportamental.inconsistencias && (
                  <div>
                    <h4 className="text-foreground font-medium mb-1">Inconsistências Discurso vs. Ação</h4>
                    <p>{comportamental.inconsistencias}</p>
                  </div>
                )}
                {comportamental.diretrizComportamental && (
                  <div className="glass-card p-4 glow-border">
                    <h4 className="text-primary font-medium mb-1">💡 Diretriz Comportamental</h4>
                    <p className="text-foreground">"{comportamental.diretrizComportamental}"</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Current Portfolio */}
          {carteiraAtual.length > 0 && (
            <AccordionItem value="carteira" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={BarChart3} />
                  <span className="font-display font-semibold text-foreground">Raio-X da Carteira Atual</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Ativo</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Classe</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carteiraAtual.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 text-foreground">{row.ativo}</td>
                          <td className="py-2 text-secondary-foreground">{row.classe}</td>
                          <td className="py-2 text-right text-foreground">{row.pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Critical Alerts */}
          {alertas.length > 0 && (
            <AccordionItem value="alertas" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={AlertTriangle} />
                  <span className="font-display font-semibold text-foreground">Alertas Críticos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm space-y-3">
                {alertas.map((alert: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <span className="text-destructive font-bold text-xs mt-0.5">{i + 1}</span>
                    <p className="text-secondary-foreground">{alert}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Cash Flow */}
          {(fluxo.capacidadeAporte || fluxo.vazamentos || fluxo.margemSeguranca) && (
            <AccordionItem value="fluxo" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={DollarSign} />
                  <span className="font-display font-semibold text-foreground">Análise de Fluxo de Caixa</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-secondary-foreground space-y-3">
                {fluxo.capacidadeAporte && <p><strong className="text-foreground">Capacidade de aporte:</strong> {fluxo.capacidadeAporte}</p>}
                {fluxo.vazamentos && <p><strong className="text-foreground">Vazamentos identificados:</strong> {fluxo.vazamentos}</p>}
                {fluxo.margemSeguranca && <p><strong className="text-foreground">Margem de segurança:</strong> {fluxo.margemSeguranca}</p>}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Target Allocation */}
          {carteiraAlvo.length > 0 && (
            <AccordionItem value="alvo" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={Target} />
                  <span className="font-display font-semibold text-foreground">Carteira-Alvo</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPieChart>
                        <Pie data={carteiraAlvo} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                          {carteiraAlvo.map((entry: any, i: number) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </RPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {carteiraAlvo.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                          <span className="text-secondary-foreground">{item.nome}</span>
                        </div>
                        <span className="text-foreground font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Comparison */}
          {comparativo.length > 0 && (
            <AccordionItem value="comparativo" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={ArrowLeftRight} />
                  <span className="font-display font-semibold text-foreground">Comparativo Atual vs. Alvo</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparativo} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 14%, 16%)" />
                      <XAxis dataKey="classe" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(222, 14%, 16%)" }} />
                      <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(222, 14%, 16%)" }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(222, 20%, 8%)", border: "1px solid hsl(222, 14%, 16%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
                      <Bar dataKey="atual" name="Atual" fill="hsl(215, 15%, 35%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="alvo" name="Alvo" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Movimentações */}
          {movimentacoes.length > 0 && (
            <AccordionItem value="movimentacoes" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={Layers} />
                  <span className="font-display font-semibold text-foreground">Plano de Movimentação</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Posição</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Ação</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Destino</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Timing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimentacoes.map((m: any, i: number) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 text-foreground">{m.posicao}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              m.acao === "MANTER" ? "bg-primary/15 text-primary" :
                              m.acao === "RESGATAR" ? "bg-destructive/15 text-destructive" :
                              "bg-accent text-accent-foreground"
                            }`}>{m.acao}</span>
                          </td>
                          <td className="py-2 text-secondary-foreground">{m.destino || "—"}</td>
                          <td className="py-2 text-secondary-foreground">{m.timing || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Final Portfolio */}
          {carteiraFinal.length > 0 && (
            <AccordionItem value="final" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={PieChart} />
                  <span className="font-display font-semibold text-foreground">Carteira Final Consolidada</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">#</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Produto</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Classe</th>
                        <th className="text-center py-2 text-muted-foreground font-medium">Tipo</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">%</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carteiraFinal.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 text-muted-foreground">{i + 1}</td>
                          <td className="py-2 text-foreground font-medium">{row.ativo}{row.ticker ? ` (${row.ticker})` : ""}</td>
                          <td className="py-2 text-secondary-foreground">{row.classe}</td>
                          <td className="py-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              row.tipo === "Core" ? "bg-primary/15 text-primary" : "bg-accent text-accent-foreground"
                            }`}>{row.tipo}</span>
                          </td>
                          <td className="py-2 text-right text-foreground">{row.pct}%</td>
                          <td className="py-2 text-right text-foreground">{row.valor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Parameters */}
          <AccordionItem value="parametros" className="glass-card border-0 px-6">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-3">
                <SectionIcon icon={Activity} />
                <span className="font-display font-semibold text-foreground">Retorno, Risco e Benchmark</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Retorno nominal esperado:</span><br /><span className="text-foreground font-semibold">{parametros.retornoNominal || ips.retornoEsperado || "—"}</span></div>
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Retorno real esperado:</span><br /><span className="text-foreground font-semibold">{parametros.retornoReal || "—"}</span></div>
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Drawdown máximo estimado:</span><br /><span className="text-foreground font-semibold">{parametros.drawdownMaximo || ips.drawdownMaximo || "—"}</span></div>
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Benchmark composto:</span><br /><span className="text-foreground font-semibold">{parametros.benchmarkComposto || ips.benchmark || "—"}</span></div>
              </div>
              {parametros.estrategiaAportes && (
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Estratégia de aportes:</span><br /><span className="text-foreground">{parametros.estrategiaAportes}</span></div>
              )}
              {parametros.rebalanceamento && (
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Rebalanceamento:</span><br /><span className="text-foreground">{parametros.rebalanceamento}</span></div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Tax Strategy */}
          {tributaria.length > 0 && (
            <AccordionItem value="tributaria" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={Calculator} />
                  <span className="font-display font-semibold text-foreground">Estratégia Tributária</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-secondary-foreground space-y-2">
                {tributaria.map((item: string, i: number) => (
                  <p key={i}>• {item}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Escudo Patrimonial */}
          {(escudo.indiceCobertura || escudo.analiseProtecao || escudo.recomendacoes) && (
            <AccordionItem value="escudo" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={Heart} />
                  <span className="font-display font-semibold text-foreground">Escudo Patrimonial</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-secondary-foreground space-y-3">
                {escudo.indiceCobertura && <p><strong className="text-foreground">Índice de cobertura:</strong> {escudo.indiceCobertura}</p>}
                {escudo.analiseProtecao && <p><strong className="text-foreground">Análise de proteção:</strong> {escudo.analiseProtecao}</p>}
                {escudo.recomendacoes && <p><strong className="text-foreground">Recomendações:</strong> {escudo.recomendacoes}</p>}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Riscos e Mitigantes */}
          {riscos.length > 0 && (
            <AccordionItem value="riscos" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={Shield} />
                  <span className="font-display font-semibold text-foreground">Riscos e Mitigantes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm space-y-3">
                {riscos.map((r: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary">
                    <p className="text-foreground font-medium">{r.risco}</p>
                    <p className="text-secondary-foreground mt-1">↳ {r.mitigante}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Follow-up */}
          {followUp.length > 0 && (
            <AccordionItem value="followup" className="glass-card border-0 px-6">
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-3">
                  <SectionIcon icon={FileText} />
                  <span className="font-display font-semibold text-foreground">Roteiro de Follow-up</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-secondary-foreground space-y-2">
                {followUp.map((q: string, i: number) => (
                  <p key={i}>{i + 1}. {q}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-secondary/50 text-xs text-muted-foreground leading-relaxed">
          <strong>Disclaimer:</strong> Esta análise é uma recomendação automatizada com base nas informações fornecidas e não substitui assessoria financeira formal.
          Rentabilidade passada não garanta rentabilidade futura. Antes de implementar qualquer movimentação, avalie sua situação com um profissional
          certificado (CFP®, CGA ou consultor CVM registrado).
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" onClick={() => navigate("/")} className="border-border text-foreground hover:bg-secondary">
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer diagnóstico
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
