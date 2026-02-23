import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mic, MicOff, Square, Play, SkipForward } from "lucide-react";
import { useState, useRef, useCallback } from "react";

const guideQuestions = [
  "Qual é a sua maior preocupação financeira hoje? O que tira seu sono?",
  "Você já tomou uma decisão financeira da qual se arrependeu?",
  "Quando o mercado cai forte, o que você sente e o que faz?",
  "O que liberdade financeira significa para você, concretamente?",
  "Tem algo no seu dinheiro que sabe que deveria mudar mas ainda não mudou?",
];

const PersonalNarrative = () => {
  const navigate = useNavigate();
  const { state, setPersonalNarrative, setAudioBlob } = useDiagnostic();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasAudio, setHasAudio] = useState(!!state.audioBlob);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunks.current = [];
      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setHasAudio(true);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      // Microphone not available
    }
  }, [setAudioBlob]);

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleGenerate = () => {
    navigate("/processando");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold mb-2 text-foreground">Relato Pessoal</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Compartilhe sua relação com dinheiro. Isso permite uma análise comportamental mais profunda.{" "}
          <span className="text-accent-foreground">Esta etapa é opcional.</span>
        </p>

        {/* Guide questions */}
        <div className="space-y-3 mb-8">
          <p className="text-sm font-medium text-foreground mb-3">Perguntas-guia para inspiração:</p>
          {guideQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setActiveQuestion(activeQuestion === i ? null : i)}
              className={`w-full text-left glass-card p-4 text-sm transition-all ${
                activeQuestion === i ? "glow-border text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-primary font-semibold mr-2">{i + 1}.</span>
              {q}
            </button>
          ))}
        </div>

        {/* Text area */}
        <div className="mb-8">
          <Textarea
            value={state.personalNarrative}
            onChange={(e) => setPersonalNarrative(e.target.value)}
            placeholder="Escreva livremente sobre sua relação com dinheiro, investimentos e seus objetivos de vida..."
            className="bg-input border-border focus:ring-primary min-h-[160px] text-foreground"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {state.personalNarrative.length > 0 ? `${state.personalNarrative.length} caracteres` : ""}
          </p>
        </div>

        {/* Audio recorder */}
        <div className="glass-card p-6 mb-8">
          <p className="text-sm font-medium text-foreground mb-4">Ou grave um áudio (máx. 10 minutos)</p>
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <Button onClick={startRecording} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Mic className="w-4 h-4 mr-2" />
                Gravar áudio
              </Button>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive animate-pulse-glow" />
                  <span className="text-sm font-mono text-foreground">{formatTime(recordingTime)}</span>
                </div>
                <Button onClick={stopRecording} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </Button>
              </>
            )}
            {hasAudio && !isRecording && (
              <span className="text-sm text-primary flex items-center gap-1">
                <Play className="w-3 h-3" /> Áudio gravado
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/upload")} className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Extratos
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleGenerate} className="border-border text-muted-foreground hover:bg-secondary">
              <SkipForward className="w-4 h-4 mr-2" />
              Pular
            </Button>
            <Button onClick={handleGenerate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Gerar meu diagnóstico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalNarrative;
