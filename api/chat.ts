// api/chat.ts (Vercel serverless)

import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

const portfolioData = `
Ivan Brilata is an IT graduate currently seeking a job as a Junior Web Developer.

Skills:
- React.js
- TypeScript
- Tailwind CSS
- PHP
- MySQL

Projects:
- School Portal of Registrar – Enrollment and Tuition Payment System
- Teacher Evaluation System

He focuses on clean UI, minimalist design, and responsive web applications.

He is actively applying for developer roles.
`;

export default async function handler(req: any, res: any) {
  // ✅ Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `
You are an AI assistant for Ivan Brilata's portfolio.

Only answer using this:
${portfolioData}

If unrelated, say:
"I can only answer questions about Ivan."

User: ${message}
AI:
      `,
      maxTokens: 150,
      temperature: 0.7,
    });

    res.status(200).json({
      reply: response.generations[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating response" });
  }
}