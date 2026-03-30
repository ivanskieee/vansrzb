// api/chat.ts

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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  // --- MOCK RESPONSE ---
  let reply = "I can only answer questions about Ivan.";
  if (message.toLowerCase().includes("skills")) reply = "Ivan's skills include React.js, TypeScript, Tailwind CSS, PHP, and MySQL.";
  else if (message.toLowerCase().includes("projects")) reply = "Ivan has worked on School Portal of Registrar and Teacher Evaluation System.";
  else if (message.toLowerCase().includes("who is ivan")) reply = "Ivan Brilata is an IT graduate seeking a job as a Junior Web Developer.";

  res.status(200).json({ reply });
}