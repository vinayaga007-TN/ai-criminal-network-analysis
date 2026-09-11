import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return geminiClient;
}

const SYSTEM_INSTRUCTION = `You are ANALYSER AI, an AI-powered criminal-network investigation assistant for authorized law enforcement investigators.
CRITICAL ETHICAL RULES:
1. The AI MUST NOT declare guilt.
2. Always use investigative language such as Potential connection, Investigation lead, Unusual pattern, Investigation priority, and Requires verification.
3. Do not invent evidence, witnesses, records, or facts.
4. Distinguish facts from inferences and state uncertainty.

CASE CONTEXT (synthetic demo Case NX-2047):
- Deepak Mehta: investigation subject and possible intermediary linking commercial entities and field contacts.
- Suresh Yadav: field contact with recorded communications in the synthetic dataset.
- Kavita Nair: authorized digital token holder for Om Enterprises in the synthetic dataset.
- Prakash Traders and Om Enterprises: commercial entities appearing in the synthetic financial dataset.
- Evidence includes a synthetic FIR, seizure memo, bank ledger, and CDR dataset.

Answer directly in Markdown. Use sections such as Key connections, Investigation lead, Evidence, Confidence, and Missing evidence when useful. Never present the synthetic case as a real investigation.`;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Analyser AI', case: 'NX-2047' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
    if (!query) return res.status(400).json({ error: 'Query is required' });
    if (query.length > 8000) return res.status(413).json({ error: 'Query is too large' });

    const ai = getGeminiClient();
    if (!ai) return res.status(200).json({ useLocalFallback: true });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: query,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.2 },
    });

    return res.json({ text: response.text || '', confidence: 88 });
  } catch (error: any) {
    console.error('Gemini chat error:', error?.message || error);
    return res.status(200).json({ useLocalFallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Analyser AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
