"use client";

import { useState } from "react";

export default function ScanPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!input) return;

    setLoading(true);
    setResult(null);

    // MOCK AI RESPONSE (we replace later with real backend)
    setTimeout(() => {
      setResult({
        score: 23,
        level: "HIGH RISK",
        explanation:
          "This domain shares infrastructure with known phishing campaigns and was registered recently using privacy protection services.",
        signals: [
          "Recently registered domain",
          "Suspicious IP overlap",
          "No SSL certificate history",
          "Matches phishing pattern cluster",
        ],
      });

      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Scan Intelligence Engine</h1>

      {/* INPUT */}
      <div className="flex gap-4">
        <input
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
          placeholder="Enter URL, domain, or suspicious text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleScan}
          className="bg-white text-black px-6 rounded-xl font-medium"
        >
          Scan
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-10 text-zinc-400">Analyzing with AI...</div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-10 space-y-6">
          {/* SCORE CARD */}
          <div className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="text-xl font-bold">Verdict</h2>
            <p className="text-red-400 mt-2">{result.level}</p>
            <p className="text-4xl font-bold mt-2">{result.score}/100</p>
          </div>

          {/* EXPLANATION */}
          <div className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="font-bold mb-2">AI Explanation</h2>
            <p className="text-zinc-400">{result.explanation}</p>
          </div>

          {/* SIGNALS */}
          <div className="p-6 border border-zinc-800 rounded-xl">
            <h2 className="font-bold mb-2">Risk Signals</h2>
            <ul className="list-disc pl-5 text-zinc-400 space-y-1">
              {result.signals.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}