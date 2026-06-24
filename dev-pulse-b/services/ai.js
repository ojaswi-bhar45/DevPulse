const OPENAI_API = "https://api.openai.com/v1/chat/completions";

async function generatePRSummary(diffText, prTitle) {
  const truncatedDiff =
    diffText.length > 20000
      ? diffText.slice(0, 20000) + "\n\n...(diff truncated to 20000 chars)"
      : diffText;

  const res = await fetch(OPENAI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a code review assistant. Given a PR title and diff, provide a concise analysis.

Respond with valid JSON only (no markdown, no code fences):
{
  "summary": "What changed, key files modified, purpose, impact",
  "riskLevel": "low|medium|high",
  "reviewNotes": "What reviewers should focus on, potential issues, areas of concern"
}`,
        },
        {
          role: "user",
          content: `PR Title: ${prTitle}\n\nDiff:\n${truncatedDiff}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content in OpenAI response");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${content}`);
  }
}

module.exports = { generatePRSummary };
