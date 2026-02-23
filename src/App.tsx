import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DiagnosticProvider } from "@/contexts/DiagnosticContext";
import Index from "./pages/Index";
import Questionnaire from "./pages/Questionnaire";
import Upload from "./pages/Upload";
import PersonalNarrative from "./pages/PersonalNarrative";
import Processing from "./pages/Processing";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DiagnosticProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/questionario" element={<Questionnaire />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/relato" element={<PersonalNarrative />} />
            <Route path="/processando" element={<Processing />} />
            <Route path="/resultado" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DiagnosticProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
