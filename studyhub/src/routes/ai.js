import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/chat", async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.json({ reply: "AI is not configured. Please ask your admin to set OPENAI_API_KEY." });
  }
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: messages || [{ role: "user", content: "Hello" }] })
    });
    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
    res.json({ reply: content });
  } catch (e) {
    res.json({ reply: "AI service error. Try again later." });
  }
});

export default router;
