'use client';

import { useState } from "react";
import { GlassCard, LoadingSpinner } from "@/components/ui";
import { performScan } from "@/lib/api";
import { ScanResult } from "@/types";

export default function ScanPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await performScan(input);
      setResult(data);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } }; message?: string };
      setError(axiosError.response?.data?.error || axiosError.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Threat Scanner</h1>

      <div className="flex gap-4">
        <input
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-purple-500 focus:outline-none"
          placeholder="Enter URL, domain, or suspicious text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
        <button onClick={handleScan} disabled={loading} className="bg-white text-black px-6 rounded-xl font-medium disabled:opacity-50">
          {loading ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-10 flex items-center gap-3 text-zinc-400">
          <LoadingSpinner size="md" />
          <span>Analyzing with AI...</span>
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-6">
          <GlassCard className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="text-xl font-bold">Verdict</h2>
            <p className="text-red-400 mt-2">{result.risk_level || 'HIGH RISK'}</p>
            <p className="text-4xl font-bold mt-2">{result.risk_score ?? 0}/100</p>
          </GlassCard>

          <GlassCard className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="font-bold mb-2">AI Explanation</h2>
            <p className="text-zinc-400">{result.ai_explanation || 'No explanation available.'}</p>
          </GlassCard>

          <GlassCard className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="font-bold mb-2">Risk Signals</h2>
            {result.risk_signals && result.risk_signals.length > 0 ? (
              <ul className="list-disc pl-5 text-zinc-400 space-y-1">
                {result.risk_signals.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500">No risk signals detected.</p>
            )}
          </GlassCard>
        </div>
      )}
    </main>
  );
}