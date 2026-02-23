import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Button } from "@/components/ui/button";
import StepProgressBar from "@/components/StepProgressBar";
import FormField from "@/components/FormField";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const stepLabels = ["Dados Pessoais", "Objetivos", "Perfil de Risco", "Tributação", "Proteção"];

const Questionnaire = () => {
  const navigate = useNavigate();
  const { state, updateQuestionnaire, setCurrentStep } = useDiagnostic();
  const q = state.questionnaire;
  const step = state.currentStep;
  const set = (field: string) => (value: string) => updateQuestionnaire({ [field]: value });

  const nextStep = () => {
    if (step < 5) setCurrentStep(step + 1);
    else navigate("/upload");
  };

  const prevStep = () => {
    if (step > 1) setCurrentStep(step - 1);
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold mb-2 text-foreground">Questionário de Perfil</h1>
        <p className="text-muted-foreground text-sm mb-8">Etapa {step} de 5 — {stepLabels[step - 1]}</p>

        <StepProgressBar currentStep={step} totalSteps={5} labels={stepLabels} />

        <div className="glass-card p-6 md:p-8 space-y-5">
          {step === 1 && (
            <>
              <FormField type="text" name="nomeCompleto" label="Nome completo" required value={q.nomeCompleto || ""} onChange={set("nomeCompleto")} />
              <div className="grid md:grid-cols-2 gap-5">
                <FormField type="email" name="email" label="E-mail" required value={q.email || ""} onChange={set("email")} />
                <FormField type="tel" name="telefone" label="Telefone" value={q.telefone || ""} onChange={set("telefone")} placeholder="(11) 99999-9999" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <FormField type="number" name="idade" label="Idade" required value={q.idade || ""} onChange={set("idade")} />
                <FormField type="select" name="estadoCivil" label="Estado civil" value={q.estadoCivil || ""} onChange={set("estadoCivil")} options={[
                  { value: "solteiro", label: "Solteiro(a)" },
                  { value: "casado-comunhao-parcial", label: "Casado(a) — Comunhão Parcial" },
                  { value: "casado-comunhao-total", label: "Casado(a) — Comunhão Total" },
                  { value: "casado-separacao", label: "Casado(a) — Separação de Bens" },
                  { value: "uniao-estavel", label: "União Estável" },
                  { value: "divorciado", label: "Divorciado(a)" },
                  { value: "viuvo", label: "Viúvo(a)" },
                ]} />
              </div>
              <FormField type="text" name="dependentes" label="Dependentes (quantidade e idades)" value={q.dependentes || ""} onChange={set("dependentes")} placeholder="Ex: 2 filhos (5 e 12 anos)" />
              <div className="grid md:grid-cols-2 gap-5">
                <FormField type="currency" name="rendaBruta" label="Renda mensal bruta" required value={q.rendaBruta || ""} onChange={set("rendaBruta")} />
                <FormField type="currency" name="rendaLiquida" label="Renda mensal líquida" required value={q.rendaLiquida || ""} onChange={set("rendaLiquida")} />
              </div>
              <FormField type="select" name="fontesRenda" label="Fontes de renda" value={q.fontesRenda || ""} onChange={set("fontesRenda")} options={[
                { value: "clt", label: "CLT" },
                { value: "autonomo", label: "Autônomo" },
                { value: "empresario", label: "Empresário" },
                { value: "servidor", label: "Servidor Público" },
                { value: "aposentado", label: "Aposentado" },
                { value: "multiplas", label: "Múltiplas fontes" },
              ]} />
              <FormField type="radio" name="estabilidadeRenda" label="Estabilidade da renda" value={q.estabilidadeRenda || ""} onChange={set("estabilidadeRenda")} options={[
                { value: "estavel", label: "Estável e previsível" },
                { value: "variavel-base", label: "Variável com base razoável" },
                { value: "altamente-variavel", label: "Altamente variável" },
              ]} />
              <FormField type="currency" name="despesasFixas" label="Despesas mensais fixas estimadas" value={q.despesasFixas || ""} onChange={set("despesasFixas")} />
              <FormField type="textarea" name="reservaEmergencia" label="Reserva de emergência constituída?" value={q.reservaEmergencia || ""} onChange={set("reservaEmergencia")} placeholder="Sim, R$ XX.XXX / Não / Parcialmente — valor atual" />
              <div className="grid md:grid-cols-2 gap-5">
                <FormField type="currency" name="patrimonioFinanceiro" label="Patrimônio financeiro total" required value={q.patrimonioFinanceiro || ""} onChange={set("patrimonioFinanceiro")} hint="Dinheiro + investimentos" />
                <FormField type="currency" name="patrimonioImobiliario" label="Patrimônio imobiliário" value={q.patrimonioImobiliario || ""} onChange={set("patrimonioImobiliario")} hint="Excluindo moradia principal" />
              </div>
              <FormField type="textarea" name="dividas" label="Dívidas e financiamentos" value={q.dividas || ""} onChange={set("dividas")} placeholder="Tipo e saldo devedor. Ex: Financiamento imobiliário R$ 200.000" />
              <FormField type="radio" name="modeloIR" label="Modelo de declaração de IR" value={q.modeloIR || ""} onChange={set("modeloIR")} options={[
                { value: "simplificado", label: "Simplificado" },
                { value: "completo", label: "Completo" },
              ]} />
              <FormField type="textarea" name="pgblVgbl" label="Possui PGBL ou VGBL?" value={q.pgblVgbl || ""} onChange={set("pgblVgbl")} placeholder="Sim — detalhar produto, valor e taxa / Não" />
            </>
          )}

          {step === 2 && (
            <>
              <FormField type="select" name="objetivo" label="Objetivo principal do portfólio" required value={q.objetivo || ""} onChange={set("objetivo")} options={[
                { value: "aposentadoria", label: "Aposentadoria" },
                { value: "renda-passiva", label: "Renda passiva" },
                { value: "acumulacao", label: "Acumulação de patrimônio" },
                { value: "objetivo-especifico", label: "Objetivo específico com prazo" },
              ]} />
              <FormField type="radio" name="horizonte" label="Horizonte de investimento" required value={q.horizonte || ""} onChange={set("horizonte")} options={[
                { value: "curto", label: "Curto (< 2 anos)" },
                { value: "medio", label: "Médio (2–5 anos)" },
                { value: "longo", label: "Longo (5–10 anos)" },
                { value: "muito-longo", label: "Muito longo (> 10 anos)" },
              ]} />
              <FormField type="textarea" name="necessidadeLiquidez" label="Necessidade de liquidez recorrente?" value={q.necessidadeLiquidez || ""} onChange={set("necessidadeLiquidez")} placeholder="Saques mensais previstos com valor / Não" />
              <FormField type="textarea" name="eventosPrevistos" label="Eventos financeiros relevantes previstos" value={q.eventosPrevistos || ""} onChange={set("eventosPrevistos")} placeholder="Ex: compra de imóvel em 2 anos (R$ 500.000)" />
              <div className="grid md:grid-cols-2 gap-5">
                <FormField type="currency" name="aporteDisponivel" label="Aporte mensal disponível" required value={q.aporteDisponivel || ""} onChange={set("aporteDisponivel")} />
                <FormField type="currency" name="aporteEfetivo" label="Aporte efetivo (últimos 12m)" value={q.aporteEfetivo || ""} onChange={set("aporteEfetivo")} hint="Se diferente, explique abaixo" />
              </div>
              <FormField type="currency" name="valorInicial" label="Valor inicial a ser alocado agora" value={q.valorInicial || ""} onChange={set("valorInicial")} />
            </>
          )}

          {step === 3 && (
            <>
              <FormField type="radio" name="experiencia" label="Experiência com investimentos" required value={q.experiencia || ""} onChange={set("experiencia")} options={[
                { value: "iniciante", label: "Iniciante" },
                { value: "intermediario", label: "Intermediário" },
                { value: "avancado", label: "Avançado" },
              ]} />
              <FormField type="textarea" name="reacaoQuedas" label="Já passou por quedas relevantes? Como reagiu?" value={q.reacaoQuedas || ""} onChange={set("reacaoQuedas")} placeholder="Descreva a situação e sua reação..." />
              <FormField type="radio" name="perdaMaxima" label="Perda máxima temporária que suportaria sem resgatar" required value={q.perdaMaxima || ""} onChange={set("perdaMaxima")} options={[
                { value: "5", label: "5%" },
                { value: "10", label: "10%" },
                { value: "20", label: "20%" },
                { value: "30+", label: "30%+" },
              ]} />
              <FormField type="radio" name="perfilAnbima" label="Perfil ANBIMA autodeclarado" value={q.perfilAnbima || ""} onChange={set("perfilAnbima")} options={[
                { value: "conservador", label: "Conservador" },
                { value: "moderado", label: "Moderado" },
                { value: "arrojado", label: "Arrojado" },
                { value: "agressivo", label: "Agressivo" },
              ]} />
              <FormField type="radio" name="prioridadeRisco" label="Prioridade entre segurança e retorno" value={q.prioridadeRisco || ""} onChange={set("prioridadeRisco")} options={[
                { value: "preservar", label: "Preservar capital" },
                { value: "oscilacao-moderada", label: "Aceito oscilação moderada" },
                { value: "retorno-maximo", label: "Busco retorno máximo" },
              ]} />
              <FormField type="textarea" name="aversoes" label="Aversão a algum tipo de ativo ou estratégia?" value={q.aversoes || ""} onChange={set("aversoes")} placeholder="Ex: não quero ações, não quero cripto, prefiro evitar crédito privado..." />
            </>
          )}

          {step === 4 && (
            <>
              <FormField type="radio" name="interessePGBL" label="Interesse em otimização tributária via PGBL?" value={q.interessePGBL || ""} onChange={set("interessePGBL")} options={[
                { value: "sim", label: "Sim" },
                { value: "nao", label: "Não" },
                { value: "nao-sei", label: "Não sei" },
              ]} />
              <FormField type="select" name="investimentoExterior" label="Investe no exterior?" value={q.investimentoExterior || ""} onChange={set("investimentoExterior")} options={[
                { value: "sim", label: "Sim — possuo conta em corretora internacional" },
                { value: "interesse", label: "Não, mas tenho interesse" },
                { value: "sem-interesse", label: "Não tenho interesse" },
              ]} />
              <FormField type="radio" name="preferenciaComplexidade" label="Preferência por simplicidade ou complexidade?" value={q.preferenciaComplexidade || ""} onChange={set("preferenciaComplexidade")} options={[
                { value: "poucos-produtos", label: "Poucos produtos, simples" },
                { value: "aceito-complexidade", label: "Aceito complexidade se justificar" },
              ]} />
              <FormField type="radio" name="frequenciaAcompanhamento" label="Frequência desejada de acompanhamento" value={q.frequenciaAcompanhamento || ""} onChange={set("frequenciaAcompanhamento")} options={[
                { value: "mensal", label: "Mensal" },
                { value: "trimestral", label: "Trimestral" },
                { value: "semestral", label: "Semestral" },
              ]} />
            </>
          )}

          {step === 5 && (
            <>
              <FormField type="textarea" name="seguroVida" label="Possui seguro de vida?" value={q.seguroVida || ""} onChange={set("seguroVida")} placeholder="Sim — tipo e cobertura / Não" />
              <FormField type="radio" name="planejamentoSucessorio" label="Possui planejamento sucessório formalizado?" value={q.planejamentoSucessorio || ""} onChange={set("planejamentoSucessorio")} options={[
                { value: "sim", label: "Sim" },
                { value: "nao", label: "Não" },
                { value: "em-andamento", label: "Em andamento" },
              ]} />
              <FormField type="textarea" name="dependentesProtecao" label="Dependentes que precisariam de proteção?" value={q.dependentesProtecao || ""} onChange={set("dependentesProtecao")} placeholder="Em caso de falecimento ou invalidez" />
              <FormField type="radio" name="patrimonioAcima5M" label="Patrimônio total estimado é superior a R$ 5 milhões?" value={q.patrimonioAcima5M || ""} onChange={set("patrimonioAcima5M")} options={[
                { value: "sim", label: "Sim" },
                { value: "nao", label: "Não" },
                { value: "prefiro-nao-informar", label: "Prefiro não informar" },
              ]} />
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevStep} className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 1 ? "Voltar" : "Anterior"}
          </Button>
          <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {step === 5 ? "Próximo: Upload de Extratos" : "Próximo"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
