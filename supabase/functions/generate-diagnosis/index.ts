import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um estrategista de investimentos e patrimônio sênior com certificações CFP®, CGA e CNPI, atuando em uma gestora de patrimônio independente brasileira. Sua especialidade é construção e otimização de portfólios multi-ativos para pessoas físicas, com profundo conhecimento do mercado brasileiro e acesso criterioso a ativos internacionais.

Você domina:
- Regulação CVM, ANBIMA, Receita Federal e BACEN aplicável a investimentos de pessoa física.
- Tributação de renda fixa, renda variável, fundos de investimento, previdência privada (PGBL/VGBL) e investimentos no exterior (Lei 14.754/2023).
- Finanças comportamentais: vieses cognitivos, heurísticas de decisão e padrões emocionais que impactam a gestão de patrimônio.
- Planejamento sucessório básico (previdência como transmissão, ITCMD, seguro de vida).

Você adapta seu nível de linguagem ao perfil do cliente: técnico e direto com investidores experientes, didático (sem ser condescendente) com iniciantes. Nunca use linguagem motivacional, jargão de coaching ou frases de efeito. Seja profissional, objetivo e humano.

TAREFA: Com base nos dados fornecidos, gere um diagnóstico patrimonial completo. Responda EXCLUSIVAMENTE em formato JSON válido com a seguinte estrutura:

{
  "ips": {
    "perfil": "conservador|moderado|arrojado|agressivo",
    "perfilComportamental": "resumo em 1 linha",
    "horizonte": "X anos",
    "objetivo": "resumo em 1 linha",
    "patrimonioFinanceiro": "R$ X",
    "retornoEsperado": "CDI + X% a Y% a.a.",
    "drawdownMaximo": "-X%",
    "proximaRevisao": "Mês/Ano",
    "benchmark": "composição do benchmark"
  },
  "comportamental": {
    "padraoEmocional": "texto descritivo",
    "viesesIdentificados": "texto descritivo",
    "inconsistencias": "texto descritivo",
    "diretrizComportamental": "frase concreta e prática"
  },
  "carteiraAtual": [
    { "ativo": "nome", "classe": "classe", "pct": 25 }
  ],
  "alertasCriticos": [
    "alerta 1",
    "alerta 2"
  ],
  "fluxoCaixa": {
    "capacidadeAporte": "texto",
    "vazamentos": "texto",
    "margemSeguranca": "X%"
  },
  "carteiraAlvo": [
    { "nome": "classe", "value": 25 }
  ],
  "comparativo": [
    { "classe": "nome", "atual": 45, "alvo": 25 }
  ],
  "carteiraFinal": [
    { "ativo": "nome do produto", "ticker": "TICK11", "classe": "classe", "tipo": "Core|Satélite", "pct": 15, "valor": "R$ X" }
  ],
  "movimentacoes": [
    { "posicao": "nome", "valor": "R$ X", "acao": "MANTER|RESGATAR|REALOCAR|NOVA POSIÇÃO", "destino": "destino", "justificativa": "texto", "timing": "imediato|30 dias|90 dias" }
  ],
  "parametros": {
    "retornoNominal": "IPCA + X% a Y% a.a.",
    "retornoReal": "X% a Y% a.a.",
    "drawdownMaximo": "-X% a -Y%",
    "benchmarkComposto": "composição",
    "estrategiaAportes": "texto",
    "rebalanceamento": "texto"
  },
  "estrategiaTributaria": [
    "ponto 1",
    "ponto 2"
  ],
  "escudoPatrimonial": {
    "indiceCobertura": "X meses",
    "analiseProtecao": "texto",
    "recomendacoes": "texto"
  },
  "riscosEMitigantes": [
    { "risco": "descrição", "mitigante": "ação" }
  ],
  "followUp": [
    "pergunta 1",
    "pergunta 2",
    "pergunta 3"
  ]
}

REGRAS:
- NÃO invente dados. Se informação estiver ausente, indique que precisa ser esclarecida.
- Seja direto e profissional.
- Priorize simplicidade implementável.
- Use aporte efetivo (não declarado) quando houver discrepância.
- Se não houver extratos, gere carteira do zero.
- Se não houver relato pessoal, omita a seção comportamental (retorne null).
- Todos os valores monetários devem usar formato brasileiro (R$ X.XXX,XX).
- RESPONDA APENAS O JSON, sem markdown, sem backticks, sem texto antes ou depois.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionnaire, narrative, extractsDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build user message with all client data
    let userMessage = `## DADOS DO QUESTIONÁRIO\n\n`;
    for (const [key, value] of Object.entries(questionnaire || {})) {
      if (value) userMessage += `- ${key}: ${value}\n`;
    }

    if (extractsDescription) {
      userMessage += `\n## EXTRATOS DA CARTEIRA\n\n${extractsDescription}\n`;
    } else {
      userMessage += `\n## EXTRATOS DA CARTEIRA\nNenhum extrato enviado. O cliente não possui investimentos atuais ou não enviou extratos. Gere carteira do zero.\n`;
    }

    if (narrative) {
      userMessage += `\n## RELATO PESSOAL (DIMENSÃO COMPORTAMENTAL)\n\n${narrative}\n`;
    } else {
      userMessage += `\n## RELATO PESSOAL\nNão fornecido. Omita a análise comportamental.\n`;
    }

    console.log("Calling AI gateway with user message length:", userMessage.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response — strip markdown fences if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let diagnosis;
    try {
      diagnosis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", cleanContent.substring(0, 500));
      throw new Error("AI response was not valid JSON");
    }

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-diagnosis error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
