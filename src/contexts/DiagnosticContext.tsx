import React, { createContext, useContext, useState, ReactNode } from "react";

export interface QuestionnaireData {
  // Bloco 1 — Dados Pessoais e Financeiros
  nomeCompleto: string;
  email: string;
  telefone: string;
  idade: string;
  estadoCivil: string;
  dependentes: string;
  rendaBruta: string;
  rendaLiquida: string;
  fontesRenda: string;
  estabilidadeRenda: string;
  despesasFixas: string;
  reservaEmergencia: string;
  patrimonioFinanceiro: string;
  patrimonioImobiliario: string;
  dividas: string;
  modeloIR: string;
  pgblVgbl: string;
  // Bloco 2 — Objetivos
  objetivo: string;
  horizonte: string;
  necessidadeLiquidez: string;
  eventosPrevistos: string;
  aporteDisponivel: string;
  aporteEfetivo: string;
  valorInicial: string;
  // Bloco 3 — Perfil de Risco
  experiencia: string;
  reacaoQuedas: string;
  perdaMaxima: string;
  perfilAnbima: string;
  prioridadeRisco: string;
  aversoes: string;
  // Bloco 4 — Tributário
  interessePGBL: string;
  investimentoExterior: string;
  preferenciaComplexidade: string;
  frequenciaAcompanhamento: string;
  // Bloco 5 — Proteção
  seguroVida: string;
  planejamentoSucessorio: string;
  dependentesProtecao: string;
  patrimonioAcima5M: string;
}

export interface DiagnosticState {
  questionnaire: Partial<QuestionnaireData>;
  uploadedFiles: File[];
  personalNarrative: string;
  audioBlob: Blob | null;
  currentStep: number;
  consentGiven: boolean;
  diagnosisResult: any | null;
  diagnosisError: string | null;
}

interface DiagnosticContextType {
  state: DiagnosticState;
  updateQuestionnaire: (data: Partial<QuestionnaireData>) => void;
  setUploadedFiles: (files: File[]) => void;
  setPersonalNarrative: (text: string) => void;
  setAudioBlob: (blob: Blob | null) => void;
  setCurrentStep: (step: number) => void;
  setConsentGiven: (v: boolean) => void;
  setDiagnosisResult: (result: any | null) => void;
  setDiagnosisError: (error: string | null) => void;
}

const DiagnosticContext = createContext<DiagnosticContextType | null>(null);

export const useDiagnostic = () => {
  const ctx = useContext(DiagnosticContext);
  if (!ctx) throw new Error("useDiagnostic must be used within DiagnosticProvider");
  return ctx;
};

export const DiagnosticProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DiagnosticState>({
    questionnaire: {},
    uploadedFiles: [],
    personalNarrative: "",
    audioBlob: null,
    currentStep: 1,
    consentGiven: false,
    diagnosisResult: null,
    diagnosisError: null,
  });

  const updateQuestionnaire = (data: Partial<QuestionnaireData>) =>
    setState((s) => ({ ...s, questionnaire: { ...s.questionnaire, ...data } }));
  const setUploadedFiles = (files: File[]) => setState((s) => ({ ...s, uploadedFiles: files }));
  const setPersonalNarrative = (text: string) => setState((s) => ({ ...s, personalNarrative: text }));
  const setAudioBlob = (blob: Blob | null) => setState((s) => ({ ...s, audioBlob: blob }));
  const setCurrentStep = (step: number) => setState((s) => ({ ...s, currentStep: step }));
  const setConsentGiven = (v: boolean) => setState((s) => ({ ...s, consentGiven: v }));
  const setDiagnosisResult = (result: any | null) => setState((s) => ({ ...s, diagnosisResult: result }));
  const setDiagnosisError = (error: string | null) => setState((s) => ({ ...s, diagnosisError: error }));

  return (
    <DiagnosticContext.Provider
      value={{ state, updateQuestionnaire, setUploadedFiles, setPersonalNarrative, setAudioBlob, setCurrentStep, setConsentGiven, setDiagnosisResult, setDiagnosisError }}
    >
      {children}
    </DiagnosticContext.Provider>
  );
};
