"use client";

import { useState } from "react";
import {
  Building2,
  Search,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react";

interface Company {
  name: string;
  symbol: string;
  sector: string;
  marketCap: string;
  peRatio: number;
  dividendYield: string;
  revenue: string;
  growth: string;
  description: string;
}

const COMPANIES: Company[] = [
  // IT Sector
  {
    name: "Tata Consultancy Services",
    symbol: "TCS",
    sector: "Information Technology",
    marketCap: "₹15.2 Lakh Cr",
    peRatio: 31.4,
    dividendYield: "1.4%",
    revenue: "₹240,893 Cr",
    growth: "+6.8%",
    description: "Largest Indian IT services provider leading digital transformation globally.",
  },
  {
    name: "Infosys Ltd.",
    symbol: "INFY",
    sector: "Information Technology",
    marketCap: "₹7.4 Lakh Cr",
    peRatio: 28.2,
    dividendYield: "2.1%",
    revenue: "₹153,670 Cr",
    growth: "+5.9%",
    description: "Pioneer in consulting, digital technologies, and cloud platform delivery.",
  },
  {
    name: "HCL Technologies",
    symbol: "HCLTECH",
    sector: "Information Technology",
    marketCap: "₹4.6 Lakh Cr",
    peRatio: 26.5,
    dividendYield: "3.2%",
    revenue: "₹109,913 Cr",
    growth: "+8.4%",
    description: "Leader in enterprise engineering and R&D tech software solutions.",
  },
  {
    name: "Wipro Ltd.",
    symbol: "WIPRO",
    sector: "Information Technology",
    marketCap: "₹2.8 Lakh Cr",
    peRatio: 23.8,
    dividendYield: "0.2%",
    revenue: "₹89,760 Cr",
    growth: "+3.1%",
    description: "Global IT powerhouse focusing on AI and hyperautomation integration.",
  },

  // Banking & Financials
  {
    name: "HDFC Bank Ltd.",
    symbol: "HDFCBANK",
    sector: "Banking & Finance",
    marketCap: "₹12.8 Lakh Cr",
    peRatio: 19.5,
    dividendYield: "1.2%",
    revenue: "₹285,000 Cr",
    growth: "+14.2%",
    description: "India's largest private sector bank with massive retail & corporate reach.",
  },
  {
    name: "ICICI Bank Ltd.",
    symbol: "ICICIBANK",
    sector: "Banking & Finance",
    marketCap: "₹8.5 Lakh Cr",
    peRatio: 18.2,
    dividendYield: "0.9%",
    revenue: "₹186,000 Cr",
    growth: "+17.6%",
    description: "Premier banking conglomerate delivering high return on equity and credit growth.",
  },
  {
    name: "State Bank of India",
    symbol: "SBIN",
    sector: "Banking & Finance",
    marketCap: "₹7.3 Lakh Cr",
    peRatio: 11.2,
    dividendYield: "1.7%",
    revenue: "₹473,000 Cr",
    growth: "+15.8%",
    description: "Dominant public sector lender with over 22,000 branches across India.",
  },
  {
    name: "Kotak Mahindra Bank",
    symbol: "KOTAKBANK",
    sector: "Banking & Finance",
    marketCap: "₹3.5 Lakh Cr",
    peRatio: 20.8,
    dividendYield: "0.1%",
    revenue: "₹65,000 Cr",
    growth: "+12.1%",
    description: "Agile private financial services group with diversified wealth & retail wings.",
  },

  // Energy & Oil
  {
    name: "Reliance Industries",
    symbol: "RELIANCE",
    sector: "Energy & Conglomerate",
    marketCap: "₹20.1 Lakh Cr",
    peRatio: 29.8,
    dividendYield: "0.3%",
    revenue: "₹910,000 Cr",
    growth: "+11.4%",
    description: "India's highest market-cap titan covering Oil-to-Chemicals, Jio Telecom, and Retail.",
  },
  {
    name: "Oil and Natural Gas Corp",
    symbol: "ONGC",
    sector: "Energy & Conglomerate",
    marketCap: "₹3.8 Lakh Cr",
    peRatio: 7.8,
    dividendYield: "4.5%",
    revenue: "₹640,000 Cr",
    growth: "+8.9%",
    description: "India's premier crude oil & natural gas exploration champion.",
  },
  {
    name: "Power Grid Corp of India",
    symbol: "POWERGRID",
    sector: "Energy & Conglomerate",
    marketCap: "₹3.1 Lakh Cr",
    peRatio: 18.9,
    dividendYield: "3.5%",
    revenue: "₹45,000 Cr",
    growth: "+9.2%",
    description: "National power transmission provider handling over 85% of interstate electricity.",
  },
  {
    name: "NTPC Limited",
    symbol: "NTPC",
    sector: "Energy & Conglomerate",
    marketCap: "₹3.9 Lakh Cr",
    peRatio: 16.4,
    dividendYield: "2.1%",
    revenue: "₹176,000 Cr",
    growth: "+13.1%",
    description: "India's largest power generator pivoting towards rapid green hydrogen & solar.",
  },

  // Automobile
  {
    name: "Tata Motors Ltd.",
    symbol: "TATAMOTORS",
    sector: "Automotive",
    marketCap: "₹3.4 Lakh Cr",
    peRatio: 16.2,
    dividendYield: "0.6%",
    revenue: "₹437,000 Cr",
    growth: "+24.5%",
    description: "Leader in commercial vehicles and Indian EV passenger car transition along with JLR.",
  },
  {
    name: "Mahindra & Mahindra",
    symbol: "M&M",
    sector: "Automotive",
    marketCap: "₹3.6 Lakh Cr",
    peRatio: 30.1,
    dividendYield: "0.7%",
    revenue: "₹139,000 Cr",
    growth: "+19.8%",
    description: "Dominant SUV and agricultural tractor manufacturer with worldwide footprint.",
  },
  {
    name: "Maruti Suzuki India",
    symbol: "MARUTI",
    sector: "Automotive",
    marketCap: "₹3.8 Lakh Cr",
    peRatio: 28.5,
    dividendYield: "1.1%",
    revenue: "₹141,000 Cr",
    growth: "+16.2%",
    description: "Pacesetter in Indian passenger vehicles holding over 40% retail market share.",
  },

  // FMCG & Healthcare
  {
    name: "Hindustan Unilever Ltd.",
    symbol: "HINDUNILVR",
    sector: "FMCG",
    marketCap: "₹5.9 Lakh Cr",
    peRatio: 56.4,
    dividendYield: "1.7%",
    revenue: "₹61,000 Cr",
    growth: "+4.2%",
    description: "Consumer goods powerhouse touching 9 out of 10 Indian households daily.",
  },
  {
    name: "ITC Limited",
    symbol: "ITC",
    sector: "FMCG",
    marketCap: "₹5.4 Lakh Cr",
    peRatio: 26.8,
    dividendYield: "3.1%",
    revenue: "₹76,000 Cr",
    growth: "+7.5%",
    description: "Diversified FMCG, agri-business, paperboards, and premier luxury hotels.",
  },
  {
    name: "Sun Pharmaceutical Ind.",
    symbol: "SUNPHARMA",
    sector: "Healthcare & Pharma",
    marketCap: "₹4.1 Lakh Cr",
    peRatio: 38.6,
    dividendYield: "0.8%",
    revenue: "₹48,000 Cr",
    growth: "+11.7%",
    description: "India's largest specialty pharmaceutical enterprise with top global generic sales.",
  },
];

const SECTORS = [
  "All Sectors",
  "Information Technology",
  "Banking & Finance",
  "Energy & Conglomerate",
  "Automotive",
  "FMCG",
  "Healthcare & Pharma",
];

export default function IndianCompaniesPage() {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");

  const filtered = COMPANIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesSector =
      selectedSector === "All Sectors" || c.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          NSE / BSE Corporate Giants
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          India&apos;s Top 50+ Bluechip Companies
        </h1>
        <p className="text-sm text-slate-400">
          Analyze balance sheet fundamentals, market capitalizations, P/E ratios, and growth
          trajectories across prime Indian industries.
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
            placeholder="Search by company name or ticker (e.g. Reliance, TCS)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
          {SECTORS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSector === sec
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <div
            key={c.symbol}
            className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base text-white">{c.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      NSE: {c.symbol}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {c.sector}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.description}</p>

              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-800/80 mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 block">Market Cap</span>
                  <span className="font-mono font-semibold text-white">{c.marketCap}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">P/E Ratio</span>
                  <span className="font-mono font-semibold text-cyan-400">{c.peRatio}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Annual Revenue</span>
                  <span className="font-mono font-semibold text-slate-300">{c.revenue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">YoY Growth</span>
                  <span className="font-mono font-semibold text-emerald-400">{c.growth}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 text-[11px]">
                Div. Yield: <strong className="text-white">{c.dividendYield}</strong>
              </span>
              <a
                href={`https://www.screener.in/company/${c.symbol}/consolidated/`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold text-[11px]"
              >
                Full Financials <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
