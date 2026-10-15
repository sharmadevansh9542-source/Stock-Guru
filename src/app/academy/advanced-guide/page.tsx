"use client";

import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Layers,
  ShieldAlert,
  Target,
  Sparkles,
  Zap,
} from "lucide-react";

export default function AdvancedGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111c38] to-[#0a0f1d] text-[#f8fafc]">
      {/* Top Navbar */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/academy"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy Hub
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            Module 3: Advanced Institutional Price Action
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            Advanced Candlestick Price Action
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Move beyond retail textbook theory. Learn how institutions, market makers, and algorithmic traders use candlestick patterns to trap retail liquidity and engineer major trend reversals.
          </p>
        </div>

        {/* 1. Multi-Candle Reversal Formations */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">1. High-Probability Multi-Candle Formations</h2>
              <p className="text-xs text-slate-400 font-mono">The highest win-rate reversal structures in modern trading</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-emerald-400 text-lg">Morning Star Formation</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Bullish 3-Candle</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consists of a strong bearish candle, followed by an indecisive small-bodied star (Doji/Spinning Top) showing seller exhaustion, completed by a powerful bullish candle closing well above the 50% level of Candle 1.
              </p>
              <div className="bg-[#0c1222] p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
                <strong className="text-white">Execution Rule:</strong> Enter long upon Candle 3 close. Stop-loss placed strictly below the star shadow low. Target 1:2.5 RR.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-rose-400 text-lg">Evening Star Formation</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Bearish 3-Candle</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Forms at the crest of an extended bullish run. A strong green candle, a stalled hesitation star at resistance, followed by an aggressive red selloff candle that wipes out previous gains.
              </p>
              <div className="bg-[#0c1222] p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
                <strong className="text-white">Execution Rule:</strong> Short below Candle 3 low. Place stop-loss above the high of the middle star. Target nearest daily support.
              </div>
            </div>
          </div>
        </section>

        {/* 2. Institutional Liquidity Sweeps & Trap Candles */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">2. Trap Detection & Liquidity Wicks</h2>
              <p className="text-xs text-slate-400 font-mono">Recognizing Bull Traps and Bear Traps before entering</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
              <h4 className="font-bold text-white text-base">The Bull Trap (Pinbar at Resistance)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Price breaks above a well-known resistance level, enticing breakout retail traders to buy. Big institutions use this influx of buy orders to dump large short positions, leaving behind an elongated upper shadow (wick) and closing back inside the range.
              </p>
              <span className="inline-block text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                Action: Never buy breakout wicks without a clean retest and close.
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
              <h4 className="font-bold text-white text-base">The Bear Trap (Stop Hunt at Support)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Price slices below support to trigger stop-losses of early buyers. Institutional algorithms absorb all the panicked sell orders at discount prices and immediately ramp price back up, leaving an unmistakable long lower tail.
              </p>
              <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                Action: Enter long on the reversal candle closing back above support level.
              </span>
            </div>
          </div>
        </section>

        {/* 3. The 4-Pillar Confluence Trading Checklist */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">3. Professional Trade Confluence Checklist</h2>
              <p className="text-xs text-slate-400 font-mono">Only execute trades when at least 3 of these 4 conditions align</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <div className="text-blue-400 font-bold font-mono text-xs">Pillar 1</div>
              <h4 className="text-white font-bold text-sm">Key Price Level</h4>
              <p className="text-xs text-slate-400">Major Daily/4H Support, Resistance, Trendline, or 0.618 Golden Fibonacci Retracement.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <div className="text-emerald-400 font-bold font-mono text-xs">Pillar 2</div>
              <h4 className="text-white font-bold text-sm">Valid Candlestick Trigger</h4>
              <p className="text-xs text-slate-400">Clean Hammer, Engulfing, Morning Star, or Tweezer with full closed body confirmation.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <div className="text-amber-400 font-bold font-mono text-xs">Pillar 3</div>
              <h4 className="text-white font-bold text-sm">Volume Confirmation</h4>
              <p className="text-xs text-slate-400">Volume bar higher than 20-period moving average on the trigger candle.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <div className="text-indigo-400 font-bold font-mono text-xs">Pillar 4</div>
              <h4 className="text-white font-bold text-sm">Indicator Divergence</h4>
              <p className="text-xs text-slate-400">RSI oversold/overbought or Bullish/Bearish MACD Divergence confirming reversal.</p>
            </div>
          </div>
        </section>

        {/* CTA Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/30 via-slate-900/60 to-blue-900/30 border border-indigo-500/30">
          <div>
            <h4 className="text-base font-bold text-white">Apply these concepts in real-time</h4>
            <p className="text-xs text-slate-400">Inspect live bluechip candlestick charts or test your strategy risk-free.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/academy/live-charts"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              Open Live Charts →
            </Link>
            <Link
              href="/virtual-trading"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              Paper Trading Simulator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
