import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Upload as UploadIcon, FileText, X, AlertCircle } from "lucide-react";
import { useCallback, useRef } from "react";

const ACCEPTED = ".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv,.txt";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const Upload = () => {
  const navigate = useNavigate();
  const { state, setUploadedFiles } = useDiagnostic();
  const files = state.uploadedFiles;
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const valid = Array.from(newFiles).filter((f) => f.size <= MAX_FILE_SIZE);
      setUploadedFiles([...files, ...valid]);
    },
    [files, setUploadedFiles]
  );

  const removeFile = (i: number) => setUploadedFiles(files.filter((_, idx) => idx !== i));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold mb-2 text-foreground">Upload de Extratos</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Envie os extratos da sua carteira de investimentos para análise detalhada.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="glass-card p-12 text-center cursor-pointer hover:border-primary/50 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
            <UploadIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-foreground font-medium mb-1">Arraste arquivos aqui ou clique para selecionar</p>
          <p className="text-sm text-muted-foreground">PDF, imagens, Excel, CSV ou texto — até 20MB por arquivo</p>
          <input ref={inputRef} type="file" multiple accept={ACCEPTED} onChange={(e) => addFiles(e.target.files)} className="hidden" />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            {files.map((f, i) => (
              <div key={i} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(f.size)}</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            Se você não possui investimentos atualmente, pode pular esta etapa. A análise será focada na construção de
            uma carteira do zero.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => navigate("/questionario")} className="border-border text-foreground hover:bg-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Questionário
          </Button>
          <Button onClick={() => navigate("/relato")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {files.length > 0 ? "Próximo: Relato Pessoal" : "Pular e continuar"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
