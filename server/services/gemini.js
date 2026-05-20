import { env } from "../config/env.js";

function extractText(data) {
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim() || "";
}

export async function askGemini({ prompt, context, instruction }) {
  if (!env.geminiApiKey || env.geminiApiKey === "your-gemini-api-key") {
    throw new Error("Gemini API key is not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    env.geminiModel,
  )}:generateContent?key=${encodeURIComponent(env.geminiApiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${instruction}\n\nRAG_CONTEXT_JSON:\n${JSON.stringify(context, null, 2)}\n\nUSER_QUESTION:\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.25,
        topP: 0.85,
        topK: 40,
        maxOutputTokens: 1400,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini request failed");
  }

  const text = extractText(data);
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}
