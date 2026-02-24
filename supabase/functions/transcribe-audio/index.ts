import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response(JSON.stringify({ error: "No audio file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Read the audio file and encode as base64
    const audioBytes = new Uint8Array(await audioFile.arrayBuffer());
    const audioBase64 = base64Encode(audioBytes);

    // Determine MIME type
    const mimeType = audioFile.type || "audio/webm";

    console.log(`Transcribing audio: ${audioFile.name}, size: ${audioBytes.length}, type: ${mimeType}`);

    // Use Gemini multimodal to transcribe
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Você é um transcritor de áudio especializado em português brasileiro. Transcreva o áudio fornecido com precisão. Retorne APENAS o texto transcrito, sem comentários adicionais, sem formatação markdown.",
          },
          {
            role: "user",
            content: [
              {
                type: "input_audio",
                input_audio: {
                  data: audioBase64,
                  format: mimeType.includes("wav") ? "wav" : mimeType.includes("mp3") ? "mp3" : "wav",
                },
              },
              {
                type: "text",
                text: "Transcreva este áudio em português brasileiro. Retorne apenas o texto transcrito.",
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Transcription error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    const transcription = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ transcription }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("transcribe-audio error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
