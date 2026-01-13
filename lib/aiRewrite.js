import fetch from "node-fetch";

export async function rewriteArticle(original) {
  const prompt = `
You are a professional news editor.

Rewrite the following news content into an original, concise, neutral news article.
- Keep facts accurate
- Use simple journalistic language
- Do NOT copy sentences
- Do NOT add opinions
- Structure in 3–5 short paragraphs

CONTENT:
"""
${original}
"""
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You rewrite news professionally." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || original;
}
