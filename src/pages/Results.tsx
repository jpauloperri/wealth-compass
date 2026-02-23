import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Brain, BarChart3, AlertTriangle, TrendingUp, Target, ArrowLeftRight,
  Package, PieChart, Shield, Heart, Activity, RefreshCw, Calculator,
  FileText, Download, RotateCcw, Share2,
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
];

const allocationData = [
  { name: "Pós-Fixado", value: 25, color: COLORS[0] },
  { name: "IPCA+", value: 20, color: COLORS[1] },
  { name: "RV Brasil", value: 15, color: COLORS[2] },
  { name: "FIIs", value: 12, color: COLORS[3] },
  { name: "RV Internacional", value: 10, color: COLORS[4] },
  { name: "Multimercado", value: 8, color: COLORS[5] },
  { name: "Crédito Privado", value: 5, color: COLORS[6] },
  { name: "Caixa/Reserva", value: 5, color: COLORS[7] },
];

const comparisonData = [
  { classe: "Pós-Fixado", atual: 45, alvo: 25 },
  { classe: "IPCA+", atual: 10, alvo: 20 },
  { classe: "RV Brasil", atual: 8, alvo: 15 },
  { classe: "FIIs", atual: 5, alvo: 12 },
  { classe: "Internacional", atual: 0, alvo: 10 },
  { classe: "Multi", atual: 20, alvo: 8 },
  { classe: "Crédito Priv.", atual: 12, alvo: 5 },
];

const mockPortfolio = [
  { ativo: "Tesouro Selic 2029", classe: "Pós-Fixado", tipo: "Core", pct: 15, valor: "R$ 75.000" },
  { ativo: "CDB Banco XP 120% CDI", classe: "Pós-Fixado", tipo: "Core", pct: 10, valor: "R$ 50.000" },
  { ativo: "Tesouro IPCA+ 2035", classe: "IPCA+", tipo: "Core", pct: 12, valor: "R$ 60.000" },
  { ativo: "Debênture Infra IPCA+7%", classe: "IPCA+", tipo: "Satélite", pct: 8, valor: "R$ 40.000" },
  { ativo: "BOVA11 (ETF Ibovespa)", classe: "RV Brasil", tipo: "Core", pct: 10, valor: "R$ 50.000" },
  { ativo: "Ações Blue Chips", classe: "RV Brasil", tipo: "Satélite", pct: 5, valor: "R$ 25.000" },
  { ativo: "XPML11 / HGLG11", classe: "FIIs", tipo: "Core", pct: 12, valor: "R$ 60.000" },
  { ativo: "IVVB11 (S&P 500)", classe: "RV Intl", tipo: "Core", pct: 10, valor: "R$ 50.000" },
  { ativo: "Kapitalo Kappa FIC FIM", classe: "Multi", tipo: "Satélite", pct: 8, valor: "R$ 40.000" },
  { ativo: "CRA / CRI Selecionados", classe: "Crédito Priv.", tipo: "Satélite", pct: 5, valor: "R$ 25.000" },
  { ativo: "Conta Remunerada", classe: "Caixa", tipo: "Core", pct: 5, valor: "R$ 25.000" },
];

const SectionIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
    <Icon className="w-4 h-4 text-primary" />
  </div>
);

const Results = () => {
  const navigate = useNavigate();
  const { state } = useDiagnostic();
  const clientName = state.questionnaire.nomeCompleto || "Cliente";

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
            <div><span className="text-muted-foreground">Perfil:</span> <span className="text-primary font-medium ml-2">Moderado</span></div>
            <div><span className="text-muted-foreground">Horizonte:</span> <span className="text-foreground font-medium ml-2">10+ anos</span></div>
            <div><span className="text-muted-foreground">Patrimônio:</span> <span className="text-foreground font-medium ml-2">{state.questionnaire.patrimonioFinanceiro || "R$ 500.000"}</span></div>
            <div><span className="text-muted-foreground">Retorno Esperado:</span> <span className="text-foreground font-medium ml-2">CDI + 2% a 4% a.a.</span></div>
            <div><span className="text-muted-foreground">Drawdown Máx.:</span> <span className="text-foreground font-medium ml-2">-15%</span></div>
            <div><span className="text-muted-foreground">Próxima Revisão:</span> <span className="text-foreground font-medium ml-2">Ago/2026</span></div>
          </div>
        </div>

        {/* Sections */}
        <Accordion type="multiple" defaultValue={["comportamental", "carteira", "alertas", "alvo", "comparativo", "final"]} className="space-y-3">
          {/* Behavioral Profile */}
          <AccordionItem value="comportamental" className="glass-card border-0 px-6">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-3">
                <SectionIcon icon={Brain} />
                <span className="font-display font-semibold text-foreground">Perfil Comportamental</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm text-secondary-foreground space-y-4">
              <div>
                <h4 className="text-foreground font-medium mb-1">Padrão Emocional</h4>
                <p>Tendência a controle excessivo sobre as finanças, com ansiedade moderada em períodos de volatilidade. Demonstra disciplina no aporte mas paralisia em decisões de realocação.</p>
              </div>
              <div>
                <h4 className="text-foreground font-medium mb-1">Vieses Identificados</h4>
                <p>Viés de status quo (mantém posições por inércia), aversão à perda assimétrica (sente mais a queda que a alta) e ancoragem no preço de compra.</p>
              </div>
              <div className="glass-card p-4 glow-border">
                <h4 className="text-primary font-medium mb-1">💡 Diretriz Comportamental</h4>
                <p className="text-foreground">"Antes de resgatar qualquer posição em queda, aguarde 72 horas e releia esta análise. Se a tese de investimento não mudou, a queda é oportunidade de aporte, não de fuga."</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Current Portfolio */}
          <AccordionItem value="carteira" className="glass-card border-0 px-6">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-3">
                <SectionIcon icon={BarChart3} />
                <span className="font-display font-semibold text-foreground">Raio-X da Carteira Atual</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm">
              <p className="text-muted-foreground mb-4">Diagnóstico baseado nos extratos enviados — posições mapeadas e classificadas.</p>
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
                    {[
                      { ativo: "CDB Banco ABC", classe: "Pós-Fixado", pct: 25 },
                      { ativo: "Fundo DI Premium", classe: "Pós-Fixado", pct: 20 },
                      { ativo: "Fundo Multi XYZ", classe: "Multimercado", pct: 20 },
                      { ativo: "Debênture Corp.", classe: "Crédito Privado", pct: 12 },
                      { ativo: "Tesouro IPCA+ 2029", classe: "IPCA+", pct: 10 },
                      { ativo: "Ações diversas", classe: "RV Brasil", pct: 8 },
                      { ativo: "FIIs", classe: "FIIs", pct: 5 },
                    ].map((row, i) => (
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

          {/* Critical Alerts */}
          <AccordionItem value="alertas" className="glass-card border-0 px-6">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-3">
                <SectionIcon icon={AlertTriangle} />
                <span className="font-display font-semibold text-foreground">Alertas Críticos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm space-y-3">
              {[
                "Concentração excessiva em pós-fixado (45%) — incompatível com horizonte longo e objetivo de acumulação.",
                "Fundo Multi XYZ cobra taxa de 2,5% a.a. com performance medíocre — substituir por alternativa mais eficiente.",
                "Exposição zero ao exterior — risco-país concentrado sem diversificação geográfica.",
                "Reserva de emergência misturada com investimentos — separar para garantir liquidez imediata.",
                "Ausência de PGBL — declaração completa de IR com potencial economia fiscal não aproveitada.",
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <span className="text-destructive font-bold text-xs mt-0.5">{i + 1}</span>
                  <p className="text-secondary-foreground">{alert}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Target Allocation */}
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
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                        {allocationData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {allocationData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-secondary-foreground">{item.name}</span>
                      </div>
                      <span className="text-foreground font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Comparison */}
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
                  <BarChart data={comparisonData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 14%, 16%)" />
                    <XAxis dataKey="classe" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(222, 14%, 16%)" }} />
                    <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(222, 14%, 16%)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(222, 20%, 8%)", border: "1px solid hsl(222, 14%, 16%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }}
                    />
                    <Bar dataKey="atual" name="Atual" fill="hsl(215, 15%, 35%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="alvo" name="Alvo" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Final Portfolio */}
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
                    {mockPortfolio.map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 text-muted-foreground">{i + 1}</td>
                        <td className="py-2 text-foreground font-medium">{row.ativo}</td>
                        <td className="py-2 text-secondary-foreground">{row.classe}</td>
                        <td className="py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            row.tipo === "Core" ? "bg-primary/15 text-primary" : "bg-accent text-accent-foreground"
                          }`}>
                            {row.tipo}
                          </span>
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
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Retorno nominal esperado:</span><br /><span className="text-foreground font-semibold">IPCA + 5% a 7% a.a.</span></div>
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Retorno real esperado:</span><br /><span className="text-foreground font-semibold">5% a 7% a.a.</span></div>
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Drawdown máximo estimado:</span><br /><span className="text-foreground font-semibold">-15% a -20%</span></div>
                <div className="p-4 rounded-lg bg-secondary"><span className="text-muted-foreground">Benchmark composto:</span><br /><span className="text-foreground font-semibold">60% CDI + 25% IPCA+6% + 15% IBOV</span></div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Tax Strategy */}
          <AccordionItem value="tributaria" className="glass-card border-0 px-6">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="flex items-center gap-3">
                <SectionIcon icon={Calculator} />
                <span className="font-display font-semibold text-foreground">Estratégia Tributária</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm text-secondary-foreground space-y-2">
              <p>• Abrir PGBL com aporte de até 12% da renda bruta — economia estimada de R$ 4.200/ano no IR.</p>
              <p>• Priorizar ativos isentos (LCI/LCA, debêntures incentivadas) na faixa de renda fixa.</p>
              <p>• Usar tabela regressiva de IR para novos aportes em renda fixa (prazo {'>'} 2 anos).</p>
              <p>• Evitar come-cotas: preferir ETFs a fundos abertos para exposição a RV.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-secondary/50 text-xs text-muted-foreground leading-relaxed">
          <strong>Disclaimer:</strong> Esta análise é uma recomendação automatizada com base nas informações fornecidas e não substitui assessoria financeira formal.
          Rentabilidade passada não garante rentabilidade futura. Antes de implementar qualquer movimentação, avalie sua situação com um profissional
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
