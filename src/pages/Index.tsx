import { useNavigate } from "react-router-dom";
import { Shield, BarChart3, Brain, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const steps = [
  { icon: CheckCircle2, title: "Questionário", desc: "Responda sobre seu perfil, objetivos e situação financeira." },
  { icon: BarChart3, title: "Extratos", desc: "Envie os extratos da sua carteira atual para análise." },
  { icon: Brain, title: "Relato Pessoal", desc: "Compartilhe sua relação com dinheiro (opcional)." },
];

const Index = () => {
  const navigate = useNavigate();
  const { state, setConsentGiven } = useDiagnostic();
  const [consent, setConsent] = useState(state.consentGiven);

  const handleStart = () => {
    if (!consent) return;
    setConsentGiven(true);
    navigate("/questionario");
  };

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Hero background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-16">
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">PatrimônioIQ</span>
        </div>

        {/* Hero */}
        <div className="mb-20 animate-fade-in-up">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Diagnóstico Patrimonial
            <br />
            <span className="text-gradient">Inteligente</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Análise completa da sua carteira de investimentos, perfil comportamental e planejamento personalizado com
            base em dados reais.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className="glass-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground font-medium mb-1">ETAPA {i + 1}</div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-8 max-w-lg animate-fade-in-up" style={{ animationDelay: "450ms" }}>
          <div className="flex items-start gap-3 mb-6">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              Autorizo o armazenamento e processamento dos meus dados financeiros conforme descrito na política de
              privacidade (LGPD).
            </label>
          </div>

          <Button
            onClick={handleStart}
            disabled={!consent}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 transition-all"
          >
            Começar meu diagnóstico
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            Esta ferramenta não substitui assessoria financeira formal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
