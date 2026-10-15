"use client";

import Link from "next/link";
import {
  TrendingUp,
  BrainCircuit,
  Building2,
  BookOpen,
  LineChart,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const stats = [
    { label: "Active Simulator Traders", value: "25,000+" },
    { label: "Tracked NSE/BSE Stocks", value: "50+ Giants" },
    { label: "Virtual Capital Granted", value: "₹1,00,000" },
    { label: "AI Forecast Accuracy", value: "88.4%" },
  ];

  const features = [
    {
      title: "Real-Time Virtual Trading",
      desc: "Practice with ₹1,00,000 virtual balance on real Indian market feeds without risking your actual capital.",
      icon: TrendingUp,
      href: "/virtual-trading",
      color: "from-blue-500 to-cyan-500",
      badge: "Zero Risk",
    },
    {
      title: "AI Price Prediction Terminal",
      desc: "Machine learning LSTM & Technical momentum algorithms predicting Nifty / Reliance / TCS trajectories.",
      icon: BrainCircuit,
      href: "/prediction",
      color: "from-indigo-500 to-purple-500",
      badge: "AI Powered",
    },
    {
      title: "Top 50+ Indian Giants",
      desc: "In-depth sector breakdown across IT, Banking, Energy, FMCG & Auto with key financial metrics.",
      icon: Building2,
      href: "/indian-companies",
      color: "from-amber-500 to-orange-500",
      badge: "Fundamentals",
    },
    {
      title: "Technical Analysis Hub",
      desc: "Interactive visual guides for Head & Shoulders, Double Tops, RSI, MACD, and breakout patterns.",
      icon: LineChart,
      href: "/technical",
      color: "from-emerald-500 to-teal-500",
      badge: "Chartist Pro",
    },
    {
      title: "Stock Market Basics",
      desc: "Step-by-step masterclass covering IPOs, Dividends, Bear/Bull psychology, and risk mitigation.",
      icon: BookOpen,
      href: "/terminology",
      color: "from-pink-500 to-rose-500",
      badge: "Beginner Friendly",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {user && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6 animate-pulse">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Welcome back, {user.username}! Your ₹1,00,000 paper trading desk is ready.
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Learn, Predict & Trade <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              The Indian Stock Market
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            All-in-one platform for Indian traders: Real-time paper trading simulator,
            deep technical analysis, fundamental sector breakdowns, and AI price forecasting.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/virtual-trading"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Start Virtual Trading
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/prediction"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              AI Predictor
            </Link>
          </div>

          {/* Live Quick Stats Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl glass-panel bg-slate-900/50 border border-slate-800/80 flex flex-col items-center justify-center text-center"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {s.value}
                </span>
                <span className="text-xs text-slate-400 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Everything You Need To Master Trading
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Switch effortlessly between education, practice, and AI intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <Link
                key={idx}
                href={f.href}
                className="group relative p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  Explore module <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Call to action banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-cyan-950/60 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">
              Ready to test your market strategies?
            </h3>
            <p className="text-slate-400 text-sm max-w-xl">
              Open your paper trading account, place virtual BUY / SELL orders with live NSE prices,
              and test AI predictions without risking your real bank balance.
            </p>
          </div>
          <Link
            href="/virtual-trading"
            className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-400/20 transition-all hover:scale-105 shrink-0"
          >
            Launch Trading Terminal
          </Link>
        </div>
      </section>
    </div>
  );
}
