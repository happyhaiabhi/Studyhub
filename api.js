// ============================================================
// SamvidhanSaathi — api.js
// Gemini API Configuration
// ⚠️ PASTE YOUR GEMINI API KEY BELOW BEFORE UPLOADING
// Get your key from: aistudio.google.com → API Keys
// ============================================================

const GEMINI_CONFIG = {
  // PASTE YOUR KEY HERE 👇
  API_KEY: "AIzaSyDnUbwcQBSZtsMMbyFlCs-Pem_KfwIcvrw",

  // API endpoint — do not change
  ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",

  // How to use:
  // 1. Go to aistudio.google.com
  // 2. Click "Get API Key"
  // 3. Copy your key
  // 4. Replace "AIzaSyDnUbwcQBSZtsMMbyFlCs-Pem_KfwIcvrw" above with your key
  // 5. Save this file and upload to GitHub
};

// ============================================================
// DO NOT EDIT BELOW THIS LINE
// ============================================================

async function fetchFromGemini(tab, articleNum, articleTitle, articlePart) {
  if (!GEMINI_CONFIG.API_KEY || GEMINI_CONFIG.API_KEY === "AIzaSyDnUbwcQBSZtsMMbyFlCs-Pem_KfwIcvrw") {
    return null; // No API key — use pre-filled data
  }

  const prompts = {
    explain: `You are a fun UPSC/BPSC exam coach. Explain Article ${articleNum} ("${articleTitle}") of the Indian Constitution to a beginner named Abhi. Use: 1) Simple 2-3 line explanation. 2) Historical context. 3) 4-5 bullet key takeaways. Return clean HTML only using div, p, ul, li, strong tags. No markdown. Keep under 400 words.`,

    official: `Give the official constitutional text of Article ${articleNum} ("${articleTitle}") of the Indian Constitution, then a plain English translation of each clause. Return clean HTML only. No markdown.`,

    memory: `Create memory tricks for Article ${articleNum} ("${articleTitle}") for a Bollywood-loving UPSC student: 1) A catchy mnemonic. 2) A Bollywood movie/song/dialogue connection. 3) A visual mental image. Return clean HTML only. Fun and memorable! No markdown.`,

    exam: `For Article ${articleNum} ("${articleTitle}") of the Indian Constitution, give UPSC/BPSC exam tips: 1) How it's tested in Prelims (question patterns). 2) How to use in Mains answers. 3) Common mistakes to avoid. 4) Related articles. Return clean HTML only. No markdown.`,

    laws: `List 3-5 landmark Supreme Court cases related to Article ${articleNum} ("${articleTitle}"). For each: case name, year, 2-line significance. Real cases only. Return clean HTML only. No markdown.`,

    amend: `List all constitutional amendments that changed Article ${articleNum} ("${articleTitle}"). For each: amendment number, year, what changed. If none, say so. Return clean HTML only. No markdown.`,

    trivia: `Give 5-6 fascinating trivia facts about Article ${articleNum} ("${articleTitle}") — Constituent Assembly debates, comparisons with other constitutions, historical incidents. Return clean HTML bullet points only. No markdown.`,
  };

  const prompt = prompts[tab];
  if (!prompt) return null;

  try {
    const response = await fetch(
      `${GEMINI_CONFIG.ENDPOINT}?key=${GEMINI_CONFIG.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
          }
        })
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) return null;

    // Clean up any markdown that slips through
    const cleaned = text
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    return `<div style="padding:16px;font-size:14px;line-height:1.7;color:var(--text2)">${cleaned}</div>`;

  } catch (error) {
    console.log("Gemini API error:", error);
    return null;
  }
}
