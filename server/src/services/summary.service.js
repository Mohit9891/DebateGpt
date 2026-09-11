export function summarizePoint(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const snippet = words.slice(0, 5).join(" ");
  return snippet.length < text.length ? `${snippet}...` : snippet;
}

export function buildSummaryStats({ debate, messages }) {
  const userMessages = messages.filter((m) => m.role === "user");
  const aiMessages = messages.filter((m) => m.role !== "user");
  const totalWords = messages.reduce((a, m) => a + m.content.split(/\s+/).length, 0);
  return {
    debateId: debate._id,
    topic: debate.topic,
    stance: debate.stance,
    personalityId: debate.personalityId,
    yourArguments: userMessages.length,
    aiResponses: aiMessages.length,
    totalMessages: messages.length,
    estReadTimeMin: Math.max(1, Math.round(totalWords / 200)),
    userPoints: userMessages.map((m) => ({ title: summarizePoint(m.content), content: m.content, at: m.createdAt })),
    aiPoints: aiMessages.map((m) => ({ title: summarizePoint(m.content), content: m.content, at: m.createdAt })),
  };
}
