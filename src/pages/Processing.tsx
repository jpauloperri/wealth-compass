import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const messages = [
  "Analisando seu perfil financeiro...",
  "Mapeando sua carteira de investimentos...",
  "Identificando vieses comportamentais...",
  "Calculando alocação ideal...",
  "Otimizando eficiência tributária...",
  "Construindo plano de migração...",
  "Gerando recomendações personalizadas...",
  "Finalizando seu diagnóstico...",
];

const Processing = () => {
  const navigate = useNavigate();
  const [messageIdx, setMessageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIdx((i) => (i + 1) % messages.length);
    }, 3000);

    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 1;
      });
    }, 80);

    // Simulate completion
    const timeout = setTimeout(() => {
      navigate("/resultado");
    }, 8000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Animated icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-card border border-primary/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-foreground mb-2">Processando seu diagnóstico</h2>
        <p className="text-muted-foreground text-sm mb-8 h-5 transition-all">{messages[messageIdx]}</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-primary rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">Tempo estimado: 30s a 2 minutos</p>
      </div>
    </div>
  );
};

export default Processing;
