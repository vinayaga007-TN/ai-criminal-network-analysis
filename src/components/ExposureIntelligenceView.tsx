import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Search, ShieldCheck, Clock3, Network, LockKeyhole } from 'lucide-react';
import { ExposureIdentifierType } from '../types';
import { scanSyntheticExposure } from '../data/exposureData';

interface Props { theme: 'dark' | 'light'; }

export const ExposureIntelligenceView: React.FC<Props> = ({ theme }) => {
  const [type, setType] = useState<ExposureIdentifierType>('email');
  const [value, setValue] = useState('arjun.rao@example.test');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scanSyntheticExposure> | null>(null);

  const surface = theme === 'dark' ? 'bg-[#212124] border-zinc-700' : 'bg-white border-zinc-200';
  const muted = theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600';

  const scan = () => {
    setScanning(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(scanSyntheticExposure(type, value));
      setScanning(false);
    }, 900);
  };

  const exposurePriority = useMemo(() => {
    if (!result?.matches.length) return null;
    const score = Math.max(...result.matches.map((m) => m.confidence));
    return score >= 90 ? 'HIGH' : score >= 75 ? 'MEDIUM' : 'LOW';
  }, [result]);

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider"><ShieldCheck className="w-4 h-4" /> Exposure Intelligence</div>
          <h1 className="text-2xl font-semibold mt-2">Dark Web Exposure Intelligence</h1>
          <p className={`text-sm mt-1 ${muted}`}>Check an identifier against an authorized or synthetic threat-intelligence dataset and correlate potential exposure signals with the investigation.</p>
        </header>

        <div className={`rounded-2xl border p-5 ${surface}`}>
          <div className="flex items-center gap-2 mb-4"><LockKeyhole className="w-4 h-4 text-cyan-400" /><span className="text-sm font-semibold">Exposure scan</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr_auto] gap-3">
            <select value={type} onChange={(e) => setType(e.target.value as ExposureIdentifierType)} className={`rounded-xl border px-3 py-2.5 text-sm ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
              <option value="email">Email</option><option value="username">Username</option><option value="phone">Phone</option><option value="domain">Domain</option>
            </select>
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter identifier" className={`rounded-xl border px-3 py-2.5 text-sm ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`} />
            <button onClick={scan} disabled={scanning || !value.trim()} className="rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"><Search className="w-4 h-4" />{scanning ? 'Scanning…' : 'Scan Exposure'}</button>
          </div>
          <p className={`text-[11px] mt-3 ${muted}`}>Demo mode: this build uses clearly labeled synthetic threat-intelligence records. It does not crawl Tor, illegal marketplaces, or stolen-data repositories.</p>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className={`rounded-xl border p-4 ${surface}`}><div className={`text-xs ${muted}`}>Exposure status</div><div className="text-lg font-semibold mt-1">{result.matches.length ? 'MATCH FOUND' : 'NO MATCH'}</div></div>
              <div className={`rounded-xl border p-4 ${surface}`}><div className={`text-xs ${muted}`}>Priority</div><div className="text-lg font-semibold mt-1">{exposurePriority || '—'}</div></div>
              <div className={`rounded-xl border p-4 ${surface}`}><div className={`text-xs ${muted}`}>Matches</div><div className="text-lg font-semibold mt-1">{result.matches.length}</div></div>
              <div className={`rounded-xl border p-4 ${surface}`}><div className={`text-xs ${muted}`}>Provider</div><div className="text-sm font-semibold mt-2">Synthetic TI</div></div>
            </div>

            <div className={`rounded-2xl border p-5 ${surface}`}>
              <div className="flex items-center justify-between mb-4"><div><h2 className="font-semibold">Exposure findings</h2><p className={`text-xs mt-1 ${muted}`}>Normalized identifier: {result.queriedIdentifier}</p></div><span className="text-[10px] uppercase px-2 py-1 rounded bg-amber-500/10 text-amber-400">Synthetic data</span></div>
              {result.matches.length === 0 ? <div className={`py-8 text-center ${muted}`}>No matching synthetic exposure was found.</div> : <div className="space-y-3">{result.matches.map((m) => <div key={m.id} className={`rounded-xl border p-4 ${theme === 'dark' ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-semibold text-sm">{m.id}</div><div className="text-xs font-semibold">Confidence {m.confidence}%</div></div>
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs ${muted}`}><div><Clock3 className="w-3.5 h-3.5 inline mr-1" />First seen: {m.firstSeen}</div><div>Latest: {m.lastSeen}</div><div>Data types: {m.dataTypes.join(', ')}</div></div>
                <p className={`text-xs mt-3 ${muted}`}>{m.notes}</p>
              </div>)}</div>}
            </div>

            {result.matches.length > 0 && <div className={`rounded-2xl border p-5 ${surface}`}>
              <div className="flex items-center gap-2"><Network className="w-4 h-4 text-cyan-400" /><h2 className="font-semibold">Case correlation</h2></div>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm"><div className="rounded-xl border border-cyan-500/30 px-4 py-3">Identifier</div><div className="text-zinc-500">→</div><div className="rounded-xl border border-cyan-500/30 px-4 py-3">Exposure {result.matches[0].id}</div><div className="text-zinc-500">→</div><div className="rounded-xl border border-amber-500/30 px-4 py-3">Case entity correlation</div></div>
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"><div className="flex items-center gap-2 text-amber-400 text-sm font-semibold"><AlertTriangle className="w-4 h-4" />Potential connection — requires verification</div><p className={`text-xs mt-2 ${muted}`}>An exposure record is associated with a synthetic case entity. This is an analytical correlation, not proof of ownership, attribution, or criminal activity.</p></div>
            </div>}

            <div className={`rounded-2xl border p-5 ${surface}`}><div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold"><CheckCircle2 className="w-4 h-4" /> Responsible-use status</div><ul className={`text-xs mt-3 space-y-2 ${muted}`}><li>• No dark-web crawling is performed.</li><li>• No stolen credentials or illegal-market data are downloaded.</li><li>• Results are synthetic in this demo.</li><li>• Correlations are investigation leads and require human verification.</li></ul></div>
          </>
        )}
      </div>
    </div>
  );
};
