"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  PieChart,
  Users,
  FileText,
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  Activity,
  Award,
  Zap,
  Globe2,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  ChevronRight,
  Flame,
  Lightbulb,
} from "lucide-react";

interface GlossaryTerm {
  id: string;
  term: string;
  hindiTranslation: string;
  category: "Fundamentals" | "Trading" | "Market Types" | "Derivatives";
  definition: string;
  example: string;
  badge?: string;
}

const EXTENDED_GLOSSARY: GlossaryTerm[] = [
  {
    id: "stocks",
    term: "Stocks / Shares (शेयर)",
    hindiTranslation: "कंपनी का मालिकाना हिस्सा",
    category: "Fundamentals",
    definition: "Units of equity ownership in a corporation. Buying a share makes you a legal part-owner of the company with voting rights and dividend eligibility.",
    example: "If Reliance Industries has 100 shares and you own 1 share, you legally hold 1% ownership of the company.",
    badge: "Core",
  },
  {
    id: "bull-market",
    term: "Bull Market (तेज़ी का बाज़ार)",
    hindiTranslation: "बाज़ार में लगातार उछाल का दौर",
    category: "Market Types",
    definition: "A financial market condition where stock prices are rising or expected to rise consistently over a prolonged period. Characterized by high investor optimism and economic growth.",
    example: "The post-2020 Indian Nifty rally from 7,500 to 25,000+ is a classic multi-year bull market run.",
    badge: "Trend",
  },
  {
    id: "bear-market",
    term: "Bear Market (मंदी का बाज़ार)",
    hindiTranslation: "लगातार भारी गिरावट का दौर",
    category: "Market Types",
    definition: "A prolonged drop in asset prices, conventionally defined as a 20% or greater decline from recent all-time peaks accompanied by widespread market pessimism and panic.",
    example: "The 2008 global financial crash saw the BSE Sensex crash by over 50% in a classic bear market.",
    badge: "Trend",
  },
  {
    id: "ipo",
    term: "IPO (Initial Public Offering)",
    hindiTranslation: "प्राथमिक सार्वजनिक प्रस्ताव",
    category: "Fundamentals",
    definition: "The process through which a private company sells shares to the public for the first time on stock exchanges (NSE/BSE) to raise expansion capital.",
    example: "When Zomato, Tata Technologies, or LIC first sold shares to retail investors on the Indian stock exchanges.",
    badge: "Primary Market",
  },
  {
    id: "market-cap",
    term: "Market Capitalization (बाज़ार पूंजीकरण)",
    hindiTranslation: "कंपनी का कुल बाज़ार मूल्य",
    category: "Fundamentals",
    definition: "The total market value of a publicly traded company's outstanding shares. Calculated as: Total Outstanding Shares × Current Market Price.",
    example: "Large-cap (> ₹20,000 Cr), Mid-cap (₹5,000 Cr - ₹20,000 Cr), and Small-cap (< ₹5,000 Cr).",
    badge: "Valuation",
  },
  {
    id: "dividends",
    term: "Dividends (लाभांश)",
    hindiTranslation: "कंपनी के मुनाफे का नकद बंटवारा",
    category: "Fundamentals",
    definition: "Payments made by a corporation to its shareholders from net profits, usually distributed periodically as reward for holding shares.",
    example: "TCS announces a ₹28 dividend per share. If you own 100 shares, you receive ₹2,800 directly in your bank account.",
    badge: "Income",
  },
  {
    id: "broker",
    term: "Broker (दलाल / ब्रोकर)",
    hindiTranslation: "शेयर खरीदने-बेचने का मध्यस्थ",
    category: "Trading",
    definition: "A registered intermediary or fintech firm (e.g., Zerodha, Groww, AngelOne) that executes buy and sell orders on the stock exchange on behalf of investors.",
    example: "When you tap 'Buy' on your trading app, your broker routes your order through high-speed lines to the NSE/BSE matching engine.",
    badge: "Execution",
  },
  {
    id: "portfolio",
    term: "Portfolio (पोर्टफोलियो)",
    hindiTranslation: "निवेश संग्रह व संपत्तियां",
    category: "Fundamentals",
    definition: "A diverse collection of financial investments including equities, debt bonds, mutual funds, commodities, and cash held by an investor.",
    example: "A balanced portfolio containing 60% Bluechip Equity (HDFC Bank, TCS), 20% Gold ETFs, and 20% Government Treasury Bonds.",
    badge: "Strategy",
  },
  {
    id: "liquidity",
    term: "Liquidity (तरलता)",
    hindiTranslation: "कैश में तुरंत बदलने की सुगमता",
    category: "Trading",
    definition: "The degree of ease and speed with which a stock or asset can be quickly converted into cash without affecting its market price drastically.",
    example: "Nifty 50 giant stocks have ultra-high liquidity (orders execute in milliseconds with 0 slippage), whereas illiquid micro-caps may get stuck.",
    badge: "Risk Factor",
  },
  {
    id: "volatility",
    term: "Volatility (अस्थिरता)",
    hindiTranslation: "कीमतों का उतार-चढ़ाव",
    category: "Trading",
    definition: "A statistical metric measuring the frequency and magnitude of price swings in a security or market index over a given timeframe.",
    example: "India VIX spikes rapidly before Union Budget announcements or election results, signaling high expected volatility.",
    badge: "Risk Metric",
  },
  {
    id: "stop-loss",
    term: "Stop-Loss Order (स्टॉप-लॉस)",
    hindiTranslation: "नुकसान सीमित करने का सुरक्षा आदेश",
    category: "Trading",
    definition: "An automated risk order placed with a broker to sell an asset if its price falls to a specified trigger point, preventing catastrophic capital losses.",
    example: "You buy Tata Motors at ₹980 and set a stop-loss at ₹960. If the stock unexpectedly crashes, your trade closes automatically with minimum loss.",
    badge: "Risk Management",
  },
  {
    id: "pe-ratio",
    term: "P/E Ratio (Price-to-Earnings)",
    hindiTranslation: "मूल्य-कमाई अनुपात",
    category: "Fundamentals",
    definition: "A core valuation ratio that compares a company's current share price to its annual earnings per share (EPS). Indicates how much investors pay for ₹1 of profit.",
    example: "A P/E of 20 means investors are willing to pay ₹20 for every ₹1 of profit generated by the company each year.",
    badge: "Valuation",
  },
  {
    id: "intraday",
    term: "Intraday Trading (डे-ट्रेडिंग)",
    hindiTranslation: "एक ही कारोबारी दिन में खरीद-बिक्री",
    category: "Trading",
    definition: "Buying and selling securities within the same trading session before market closing (3:30 PM IST). No delivery or overnight risk is taken.",
    example: "Buying Nifty index contracts at 9:30 AM and squaring off the position with a profit at 2:00 PM.",
    badge: "Trading Style",
  },
  {
    id: "fno",
    term: "Futures & Options (F&O)",
    hindiTranslation: "वायदा एवं विकल्प अनुबंध",
    category: "Derivatives",
    definition: "Financial derivative contracts whose value is derived from an underlying asset (like Nifty 50 or Reliance). Options give the right, but not the obligation, to trade.",
    example: "Call options (CE) gain value when markets soar; Put options (PE) surge when market prices tumble.",
    badge: "Derivatives",
  },
];

export default function TerminologyPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"cards" | "glossary" | "all">("all");

  const categories = ["All", "Fundamentals", "Trading", "Market Types", "Derivatives"];

  const filteredGlossary = useMemo(() => {
    return EXTENDED_GLOSSARY.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.hindiTranslation.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]"></div>
      </div>

      {/* Hero Header Section */}
      <section className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-transparent backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          {/* Top Breadcrumb & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-sm shadow-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
              Stock Market Academy · Level 1 Foundation
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Indian Markets: 09:15 - 15:30 IST
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                NSE / BSE
              </span>
            </div>
          </div>

          {/* Hero Titles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Stock Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Basics & Mechanics</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Master the fundamental concepts of Indian stock trading. Understand how share exchanges operate, how market participants interact, and learn core vocabulary with practical Indian market examples.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#fundamentals"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Core Modules
                </a>
                <a
                  href="#glossary"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all hover:border-slate-500 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-cyan-400" />
                  Search Dictionary ({EXTENDED_GLOSSARY.length} Terms)
                </a>
                <Link
                  href="/academy"
                  className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm border border-slate-800 transition flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Candlestick Academy
                </Link>
              </div>
            </div>

            {/* Quick KPI Stat Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-xl backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-white">NSE & BSE</div>
                <div className="text-xs text-slate-400">National Exchanges</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-xl backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-white">6 hrs 15m</div>
                <div className="text-xs text-slate-400">Trading Window</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-xl backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-white">100% Free</div>
                <div className="text-xs text-slate-400">Next.js Native Guide</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-xl backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-white">Bilingual</div>
                <div className="text-xs text-slate-400">Hindi + English</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12" id="fundamentals">
        
        {/* ======================================================== */}
        {/* MODULE 1: Understanding the Stock Market (Original Card 1) */}
        {/* ======================================================== */}
        <section className="relative group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-slate-700/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl shrink-0 shadow-inner">
                1
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">Module One</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Understanding the Stock Market</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 font-medium border border-slate-700">
                Primary & Secondary Markets
              </span>
            </div>
          </div>

          {/* Paragraphs with enhanced typography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm sm:text-base leading-relaxed text-slate-300">
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Globe2 className="w-4 h-4" />
                Capital Raising & Ownership Platform
              </div>
              <p>
                The stock market is a collection of markets where stocks (shares of ownership in businesses) are bought and sold. It serves as a platform for companies to raise capital and for investors to gain ownership in those companies.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                <Building2 className="w-4 h-4" />
                Network of Exchanges in India
              </div>
              <p>
                The stock market operates through a network of exchanges, where buyers and sellers come together to trade shares. The most well-known exchanges include the Bombay Stock Exchange (BSE) and the National Stock Exchange (NSE) in India.
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-400 mb-4">
            Understanding the stock market is crucial for making informed investment decisions. Here are some fundamental concepts:
          </p>

          {/* 5 Concepts Interactive Visual Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Stocks */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/item">
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <PieChart className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">Equity</span>
              </div>
              <h3 className="font-bold text-white text-base group-hover/item:text-cyan-400 transition-colors">Stocks</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Shares that represent a claim on a company&apos;s assets and earnings.
              </p>
            </div>

            {/* Dividends */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 group/item">
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Payout</span>
              </div>
              <h3 className="font-bold text-white text-base group-hover/item:text-emerald-400 transition-colors">Dividends</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Payments made by a corporation to its shareholders, usually as a distribution of profits.
              </p>
            </div>

            {/* Market Capitalization */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 group/item">
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Valuation</span>
              </div>
              <h3 className="font-bold text-white text-base group-hover/item:text-blue-400 transition-colors">Market Capitalization</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                The total market value of a company&apos;s outstanding shares, calculated as share price multiplied by the number of shares.
              </p>
            </div>

            {/* Bear Market */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1 group/item">
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <TrendingDown className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">Downtrend</span>
              </div>
              <h3 className="font-bold text-white text-base group-hover/item:text-rose-400 transition-colors">Bear Market</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                A market condition where prices are falling or are expected to fall.
              </p>
            </div>

            {/* Bull Market */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 group/item sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Uptrend</span>
              </div>
              <h3 className="font-bold text-white text-base group-hover/item:text-emerald-400 transition-colors">Bull Market</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                A market condition where prices are rising or are expected to rise.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <Link
              href="/academy/learn-basics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5"
            >
              Learn More About Stock Market
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-slate-500">Internal Chapter 1 · No external redirect</span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MODULE 2: Key Terminology (Original Card 2) */}
        {/* ======================================================== */}
        <section className="relative group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-slate-700/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl shrink-0 shadow-inner">
                2
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Module Two</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Key Terminology</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 font-medium border border-slate-700">
                Core Trading Terms
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 my-6 leading-relaxed">
            Familiarizing yourself with stock market terminology is essential for understanding how the market operates. Here are some key terms:
          </p>

          {/* 5 Key Terms Detailed Cards */}
          <div className="space-y-3.5 mb-8">
            {/* Broker */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-base font-bold">Broker:</strong>
                    <span className="text-[11px] text-indigo-400 font-medium">दलाल / ब्रोकर</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    An individual or firm that acts as an intermediary between buyers and sellers.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                NSE/BSE Intermediary
              </span>
            </div>

            {/* Portfolio */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0 mt-0.5">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-base font-bold">Portfolio:</strong>
                    <span className="text-[11px] text-purple-400 font-medium">पोर्टफोलियो</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    A collection of financial investments like stocks, bonds, commodities, etc.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                Asset Allocation
              </span>
            </div>

            {/* IPO */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0 mt-0.5">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-base font-bold">IPO (Initial Public Offering):</strong>
                    <span className="text-[11px] text-cyan-400 font-medium">प्राथमिक सार्वजनिक पेशकश</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    The process through which a private company offers shares to the public for the first time.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                Primary Issue
              </span>
            </div>

            {/* Liquidity */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0 mt-0.5">
                  <Activity className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-base font-bold">Liquidity:</strong>
                    <span className="text-[11px] text-emerald-400 font-medium">तरलता</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    The ease with which an asset can be converted into cash without affecting its market price.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                Cash Conversion
              </span>
            </div>

            {/* Volatility */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition">
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0 mt-0.5">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-base font-bold">Volatility:</strong>
                    <span className="text-[11px] text-amber-400 font-medium">उतार-चढ़ाव</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    A statistical measure of the dispersion of returns for a given security or market index.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                Price Fluctuation
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <a
              href="#glossary"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              Explore More Terminology
              <ArrowRight className="w-4 h-4" />
            </a>
            <span className="text-xs text-slate-500">Jump directly to searchable dictionary</span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MODULE 3: How the Market Works (Original Card 3) */}
        {/* ======================================================== */}
        <section className="relative group rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-slate-700/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl shrink-0 shadow-inner">
                3
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Module Three</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">How the Market Works</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 font-medium border border-slate-700">
                5-Step Lifecycle
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 my-6 leading-relaxed">
            The stock market operates through a system of exchanges, where stocks are bought and sold. Here’s a simplified overview of how it works:
          </p>

          {/* 5-Step Visual Timeline Process */}
          <div className="relative mb-8">
            <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-blue-500 opacity-20"></div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/30 shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-base flex items-center gap-2">
                    Investors
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">Market Participants</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Individuals or institutions that buy and sell stocks.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-bold border border-cyan-500/30 shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-base flex items-center gap-2">
                    Orders
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">Execution Instructions</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Investors place orders to buy or sell stocks through brokers.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-500/30 shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-base flex items-center gap-2">
                    Market Makers
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">Liquidity Providers</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Firms that ensure liquidity by being ready to buy or sell stocks at any time.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/30 shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-base flex items-center gap-2">
                    Price Determination
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">Order Matching Engine</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Stock prices are determined by supply and demand dynamics in the market.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/40 shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-base flex items-center gap-2">
                    Trading Hours
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">Indian Standard Time</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    The stock market operates during specific hours, typically from 9:15 AM to 3:30 PM in India.
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    09:15 - 15:30 IST
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <Link
              href="/academy/advanced-guide"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-950 text-sm bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              Learn How the Market Works
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-slate-500">Internal Chapter 3 · Advanced Market Mechanics</span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* COMPREHENSIVE BILINGUAL SEARCHABLE GLOSSARY (No Content Missed) */}
        {/* ======================================================== */}
        <section id="glossary" className="pt-4 space-y-6">
          {/* Header & Filter Controls */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  Searchable Indian Market Encyclopedia
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Comprehensive Stock Dictionary
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Complete definitions in English & Hindi with practical examples from NSE/BSE.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Search Bar */}
            <div className="relative mt-6">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search any term (e.g., Bull Market, IPO, Dividend, Stop-Loss, Liquidity, P/E Ratio)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGlossary.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-extrabold text-lg text-white group-hover:text-cyan-400 transition-colors">
                        {item.term}
                      </h3>
                      {item.hindiTranslation && (
                        <span className="text-xs text-cyan-400/90 font-medium block mt-0.5">
                          {item.hindiTranslation}
                        </span>
                      )}
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2.5">
                    {item.definition}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Indian Market Example:
                  </div>
                  <p className="text-slate-300 leading-normal">{item.example}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <div className="text-center py-12 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p className="font-semibold text-white">No matching term found for &quot;{search}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for &quot;IPO&quot;, &quot;Dividend&quot;, or &quot;Bull Market&quot;</p>
            </div>
          )}
        </section>

        {/* Quick Cross-Navigation Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <Link
            href="/academy"
            className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-white font-bold group-hover:text-cyan-400 transition-colors flex items-center justify-between">
              Candlestick Academy
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Master 25+ bullish and bearish candlestick patterns with visual representations.
            </p>
          </Link>

          <Link
            href="/technical"
            className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 border border-blue-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors flex items-center justify-between">
              Technical Indicators
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Analyze RSI, MACD, Bollinger Bands, and moving averages on live NSE stocks.
            </p>
          </Link>

          <Link
            href="/virtual-trading"
            className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-white font-bold group-hover:text-emerald-400 transition-colors flex items-center justify-between">
              Paper Trading Simulator
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Practice trading with ₹10,00,000 virtual capital with zero financial risk.
            </p>
          </Link>
        </section>
      </main>

      {/* Footer matching original copyright */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-800 text-slate-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p className="text-sm font-medium text-slate-300">&copy; 2024 Stock Market Basics. All rights reserved.</p>
          <p className="text-xs text-slate-500">
            Stock Guru Academy · Bombay Stock Exchange (BSE) & National Stock Exchange (NSE) Educational Resource
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>•</span>
            <Link href="/academy" className="hover:text-white transition">Academy</Link>
            <span>•</span>
            <Link href="/terminology" className="hover:text-white transition">Market Basics</Link>
            <span>•</span>
            <Link href="/prediction" className="hover:text-white transition">AI Prediction</Link>
            <span>•</span>
            <Link href="/virtual-trading" className="hover:text-white transition">Virtual Trading</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
