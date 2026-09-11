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
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// System instruction enforcing non-guilt terminology and ChatGPT response format
const SYSTEM_INSTRUCTION = `You are ANALYSER AI, an AI-powered criminal-network investigation assistant for authorized law enforcement investigators.
Primary design inspiration: Clean conversational copilot.

CRITICAL ETHICAL RULES:
1. The AI MUST NOT declare guilt.
2. ALWAYS use precise investigative hedging language:
   - "Potential connection"
   - "Investigation lead"
   - "Unusual pattern"
   - "Investigation priority"
   - "Requires verification"
3. Avoid definitive accusations or emotional bias.

CASE CONTEXT (Case NX-2047: Urban Chain-Snatching & Gold Fencing Syndicate):
- Deepak Mehta: Suspected receiver and intermediary anchor between street snatchers and commercial fronts. Linked to Prakash Traders and Om Enterprises.
- Suresh Yadav: Field handler dispatching two-wheeler riders (Golden Star Gang). 42 calls with Deepak Mehta.
- Kavita Nair: Compliance officer and authorized digital token holder for Om Enterprises. Shared IP logins with Deepak Mehta.
- Prakash Traders: Shell wholesale entity with ₹18.4L turnover in Bank of Baroda #4902 and zero tax filings.
- Om Enterprises: Layering vehicle transferring ₹18.4L in 6 tranches. Flagged by Isolation Forest.
- Gaurav G: Melts unrefined gold into crude bars (420g crude bar seized).
- Evidence: FIR No. 204/2026, Seizure Memo MK-883, Bank of Baroda ledger #4902, BSNL CDR Dump.

RESPONSE FORMAT (ChatGPT style):
Provide a direct, conversational answer with Markdown formatting:
[1-2 clear summary sentences]

### Key connections
• **Entity Name**
  Relationship type
  Brief detail

### Investigation lead
[Specific lead or unusual pattern, noting "Requires verification"]

### Evidence
[Evidence document names]
Confidence: [Percentage between 80% and 95%]`;

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Analyser AI', case: 'NX-2047' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: query,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      const text = response.text || '';
      return res.json({
        text,
        confidence: 88,
      });
    }

    // If no API key configured, signal client to use local case intelligence
    return res.status(200).json({
      useLocalFallback: true,
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.status(200).json({
      useLocalFallback: true,
      error: error.message,
    });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Analyser AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
