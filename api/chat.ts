import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are ANALYSER AI, an AI-powered criminal-network investigation assistant for authorized investigators.

CRITICAL ETHICAL RULES:
1. Never declare guilt or make definitive accusations.
2. Use investigative language: Potential connection, Investigation lead, Unusual pattern, Investigation priority, Requires verification.
3. Do not invent evidence, witnesses, records, or facts.
4. Distinguish facts from inferences and state uncertainty.
5. The NX-2047 case is synthetic demo data; never present it as a real investigation.

Answer directly in Markdown with concise sections such as Key connections, Investigation lead, Evidence, Confidence, and Missing evidence when useful.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
    if (!query) return res.status(400).json({ error: 'Query is required' });
    if (query.length > 8000) return res.status(413).json({ error: 'Query is too large' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(200).json({ useLocalFallback: true });

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'analyser-ai-vercel' } },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: query,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.2 },
    });

    return res.status(200).json({ text: response.text || '', confidence: 88 });
  } catch (error: any) {
    console.error('Gemini chat error:', error?.message || error);
    return res.status(200).json({ useLocalFallback: true });
  }
}
