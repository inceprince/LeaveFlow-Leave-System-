// Extractive fallback — used when no API key is set
function extractiveSummary(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 4);
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  const top = sentences
    .map(s => ({
      text: s.trim(),
      score: s.toLowerCase().split(/\W+/).filter(w => w.length > 4).reduce((sum, w) => sum + (freq[w] || 0), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => `• ${s.text}`);

  return top.join('\n');
}

export async function summarizeAnnouncement(text) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    await new Promise(r => setTimeout(r, 600));
    return extractiveSummary(text);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Summarize this company announcement in exactly 3 concise bullet points. Start each bullet with "•":\n\n${text}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    return extractiveSummary(text);
  }

  const data = await response.json();
  const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return result || extractiveSummary(text);
}
