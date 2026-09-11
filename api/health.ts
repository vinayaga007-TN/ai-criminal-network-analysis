export default function handler(_req: any, res: any) {
  res.status(200).json({ status: 'ok', app: 'Analyser AI', case: 'NX-2047' });
}
