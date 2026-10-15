"use client";

import { useState } from "react";
import { BookOpen, Search, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";

interface Term {
  term: string;
  hindiTranslation?: string;
  category: "Fundamentals" | "Trading" | "Market Types" | "Derivatives";
  definition: string;
  example: string;
}

const GLOSSARY: Term[] = [
  {
    term: "Stocks / Shares (शेयर)",
    hindiTranslation: "कंपनी का मालिकाना हिस्सा",
    category: "Fundamentals",
    definition: "Units of equity ownership in a corporation. Buying a share makes you a part-owner of the company with voting rights and dividend eligibility.",
    example: "If Reliance Industries has 100 shares and you own 1 share, you hold 1% ownership of the company.",
  },
  {
    term: "Bull Market (तेज़ी का बाज़ार)",
    hindiTranslation: "बाज़ार में लगातार उछाल",
    category: "Market Types",
    definition: "A financial market condition where prices are rising or expected to rise consistently. Characterized by high investor confidence and economic growth.",
    example: "Post-2020 Indian Nifty rally from 7,500 to 25,000 is a classic multi-year bull market run.",
  },
  {
    term: "Bear Market (मंदी का बाज़ार)",
    hindiTranslation: "लगातार गिरावट का दौर",
    category: "Market Types",
    definition: "A prolonged drop in asset prices, conventionally defined as a 20% or greater decline from recent peaks accompanied by widespread market pessimism.",
    example: "The 2008 global financial crash saw the Sensex drop by over 50% in a classic bear market.",
  },
  {
    term: "IPO (Initial Public Offering)",
    hindiTranslation: "प्राथमिक सार्वजनिक प्रस्ताव",
    category: "Fundamentals",
    definition: "The process by which a private corporation can offer shares to the public in a new stock issuance to raise capital for expansion.",
    example: "When Zomato or LIC first sold shares to retail investors on the NSE/BSE stock exchanges.",
  },
  {
    term: "Market Capitalization (बाज़ार पूंजीकरण)",
    hindiTranslation: "कंपनी का कुल बाज़ार मूल्य",
    category: "Fundamentals",
    definition: "The total market value of a publicly traded company's outstanding shares. Formula: Total Shares × Current Share Price.",
    example: "Large-cap (> ₹20,000 Cr), Mid-cap (₹5,000 Cr - ₹20,000 Cr), and Small-cap (< ₹5,000 Cr).",
  },
  {
    term: "Stop-Loss Order (स्टॉप-लॉस)",
    hindiTranslation: "नुकसान सीमित करने का सुरक्षा आदेश",
    category: "Trading",
    definition: "An automated risk order placed with a broker to sell a security when it reaches a certain price to prevent severe capital erosion.",
    example: "You buy Tata Motors at ₹980 and set a stop-loss at ₹960. If the price crashes, your order triggers to save you from deep losses.",
  },
  {
    term: "P/E Ratio (Price-to-Earnings)",
    hindiTranslation: "मूल्य-कमाई अनुपात",
    category: "Fundamentals",
    definition: "A valuation metric comparing a company's current share price to its per-share earnings (EPS). Shows how much investors are paying for ₹1 of earnings.",
    example: "A P/E of 20 means investors are paying ₹20 for every ₹1 of profit the company makes.",
  },
  {
    term: "Dividend (लाभांश)",
    hindiTranslation: "कंपनी के मुनाफे का बंटवारा",
    category: "Fundamentals",
    definition: "A distribution of profits by a corporation to its shareholders as decided by the board of directors.",
    example: "TCS announces a ₹28 dividend per share. If you own 100 shares, you receive ₹2,800 directly in your bank account.",
  },
  {
    term: "Intraday Trading (डे-ट्रेडिंग)",
    hindiTranslation: "एक ही दिन में खरीद और बिक्री",
    category: "Trading",
    definition: "Buying and selling securities within the same trading session before 3:30 PM. No delivery is taken overnight.",
    example: "Buying Nifty calls at 9:30 AM and squaring off the trade for profit by 2:00 PM.",
  },
  {
    term: "Options & Futures (F&O)",
    hindiTranslation: "वायदा एवं विकल्प अनुबंध",
    category: "Derivatives",
    definition: "Derivative financial contracts where values are derived from underlying assets (like Nifty or Reliance). Options give the right, but not the obligation, to buy/sell at a set price.",
    example: "Call options (CE) profit when markets rise; Put options (PE) profit when markets plunge.",
  },
];

export default function TerminologyPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Fundamentals", "Trading", "Market Types", "Derivatives"];

  const filtered = GLOSSARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase()) ||
      (item.hindiTranslation && item.hindiTranslation.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Stock Market Terminology & Basics
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Financial Glossary & Core Concepts
        </h1>
        <p className="text-sm text-slate-400">
          Essential stock market terms explained simply in English and Hindi with real-world Indian examples.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search term (e.g. Bull Market, Dividend, P/E, IPO)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-lg text-white">{item.term}</h3>
                  {item.hindiTranslation && (
                    <span className="text-xs text-cyan-400 font-medium">
                      {item.hindiTranslation}
                    </span>
                  )}
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold shrink-0">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.definition}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
              <strong className="text-emerald-400 font-semibold block mb-0.5">
                Indian Market Example:
              </strong>
              {item.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
