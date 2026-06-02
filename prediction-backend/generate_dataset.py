"""
Synthetic Stock Dataset Generator
===================================
Generates 5 years of realistic OHLCV data for 15 NSE stocks
based on real approximate price levels and historical volatility.

Run once:   python generate_dataset.py
"""

import os
import sys
import numpy as np
import pandas as pd
from datetime import date, timedelta

np.random.seed(42)

# Real approximate stats for each stock (as of 2024):
# (start_price, end_price, annual_volatility, avg_daily_volume)
STOCK_PARAMS = {
    "RELIANCE":   dict(name="Reliance Industries",      start=2100, end=2950, vol=0.22, vol_m=1_500_000),
    "TCS":        dict(name="Tata Consultancy Services", start=3100, end=3850, vol=0.20, vol_m=400_000),
    "INFY":       dict(name="Infosys",                  start=1400, end=1750, vol=0.24, vol_m=900_000),
    "HDFCBANK":   dict(name="HDFC Bank",                start=1350, end=1720, vol=0.21, vol_m=1_200_000),
    "ICICIBANK":  dict(name="ICICI Bank",               start=650,  end=1250, vol=0.26, vol_m=1_800_000),
    "SBIN":       dict(name="State Bank of India",       start=280,  end=810,  vol=0.30, vol_m=5_000_000),
    "WIPRO":      dict(name="Wipro",                    start=380,  end=530,  vol=0.25, vol_m=700_000),
    "TATAMOTORS": dict(name="Tata Motors",              start=180,  end=960,  vol=0.38, vol_m=3_500_000),
    "ADANIENT":   dict(name="Adani Enterprises",        start=900,  end=2600, vol=0.45, vol_m=600_000),
    "BAJFINANCE": dict(name="Bajaj Finance",            start=5200, end=7100, vol=0.28, vol_m=350_000),
    "HINDUNILVR": dict(name="Hindustan Unilever",       start=2100, end=2700, vol=0.16, vol_m=300_000),
    "KOTAKBANK":  dict(name="Kotak Mahindra Bank",      start=1600, end=1950, vol=0.22, vol_m=500_000),
    "AXISBANK":   dict(name="Axis Bank",                start=680,  end=1180, vol=0.28, vol_m=1_400_000),
    "LT":         dict(name="Larsen & Toubro",          start=1400, end=3650, vol=0.25, vol_m=700_000),
    "MARUTI":     dict(name="Maruti Suzuki",            start=6800, end=12500, vol=0.23, vol_m=150_000),
}

OUT_DIR = os.path.join(os.path.dirname(__file__), "data")


def business_days(start: date, end: date):
    """Return list of business days (Mon-Fri) between start and end inclusive."""
    days = []
    cur  = start
    while cur <= end:
        if cur.weekday() < 5:  # Mon=0 … Fri=4
            days.append(cur)
        cur += timedelta(days=1)
    return days


def simulate_ohlcv(symbol: str, params: dict) -> pd.DataFrame:
    """Simulate realistic OHLCV using geometric Brownian motion with mean reversion."""
    end_date   = date(2026, 4, 25)
    start_date = date(2021, 4, 26)
    dates      = business_days(start_date, end_date)
    n          = len(dates)

    s0   = params["start"]
    sT   = params["end"]
    σ    = params["vol"]
    vol_m = params["vol_m"]

    # Daily drift to reach target price in 5 years
    dt   = 1 / 252
    μ    = (np.log(sT / s0)) / (n * dt)          # annualised drift
    σ_d  = σ * np.sqrt(dt)                        # daily vol

    # GBM with a weak mean-reversion nudge for realism
    prices = [s0]
    for i in range(1, n):
        z       = np.random.normal()
        # Add occasional market shocks (fat tails)
        if np.random.rand() < 0.02:
            z  *= np.random.choice([2.5, -2.5])
        ret     = μ * dt + σ_d * z
        # Weak mean-reversion toward long-run trend
        trend   = s0 * np.exp(μ * i * dt)
        gap     = (trend - prices[-1]) / prices[-1]
        ret    += 0.01 * gap
        prices.append(prices[-1] * np.exp(ret))

    prices = np.array(prices)

    # Construct OHLC from close prices
    daily_range = prices * σ_d * np.random.uniform(0.8, 1.8, n)
    high  = prices + daily_range * np.random.uniform(0.3, 0.7, n)
    low   = prices - daily_range * np.random.uniform(0.3, 0.7, n)
    open_ = low + (high - low) * np.random.uniform(0.1, 0.9, n)

    # Ensure OHLC logic: Low <= Open,Close <= High
    high  = np.maximum(high, np.maximum(open_, prices))
    low   = np.minimum(low,  np.minimum(open_, prices))

    # Realistic volume with uptrend and noise
    base_vol = vol_m * np.linspace(0.8, 1.2, n)
    volume   = (base_vol * np.random.lognormal(0, 0.4, n)).astype(int)

    df = pd.DataFrame({
        "Date":   [str(d) for d in dates],
        "Open":   np.round(open_, 2),
        "High":   np.round(high,  2),
        "Low":    np.round(low,   2),
        "Close":  np.round(prices, 2),
        "Volume": volume,
    })
    df.set_index("Date", inplace=True)
    return df


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"\n{'='*60}")
    print(f"  Synthetic Stock Dataset Generator")
    print(f"  Output: {OUT_DIR}")
    print(f"{'='*60}\n")

    rows_info = []
    for sym, params in STOCK_PARAMS.items():
        df       = simulate_ohlcv(sym, params)
        out_path = os.path.join(OUT_DIR, f"{sym}.csv")
        df.to_csv(out_path)
        rows_info.append((sym, params["name"], len(df), df.index[0], df.index[-1]))
        print(f"  [{sym:12s}]  {len(df)} rows  ({df.index[0]} to {df.index[-1]})  -> {sym}.csv")

    print(f"\n{'='*60}")
    print(f"  Done!  {len(STOCK_PARAMS)} stocks  |  ~{rows_info[0][2]} trading days each")
    print(f"{'='*60}\n")

    # Write README
    readme = os.path.join(OUT_DIR, "README.md")
    with open(readme, "w", encoding="utf-8") as f:
        f.write("# Stock Price Dataset\n\n")
        f.write("Synthetic OHLCV data generated with Geometric Brownian Motion\n")
        f.write("calibrated to real NSE price levels and historical volatility.\n\n")
        f.write("**Period:** 2021-04-26 to 2026-04-25 (~5 years, ~1250 trading days)\n\n")
        f.write("**Columns:** `Date, Open, High, Low, Close, Volume`\n\n")
        f.write("## Files\n\n")
        f.write("| Symbol | Company | Rows | Start | End |\n")
        f.write("|--------|---------|------|-------|-----|\n")
        for sym, name, rows, start, end in rows_info:
            f.write(f"| {sym} | {name} | {rows} | {start} | {end} |\n")
    print(f"  README written to {readme}\n")


if __name__ == "__main__":
    main()
