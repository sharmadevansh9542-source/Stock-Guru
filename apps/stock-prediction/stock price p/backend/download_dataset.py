"""
Dataset Downloader for Stock Market Oracle (v2)
================================================
Uses yfinance Ticker.history() which is more rate-limit resilient
than yf.download() for Indian stocks.

Run once:   python download_dataset.py
"""

import os
import sys
import time
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

# Force UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

STOCKS = {
    "RELIANCE":   "Reliance Industries",
    "TCS":        "Tata Consultancy Services",
    "INFY":       "Infosys",
    "HDFCBANK":   "HDFC Bank",
    "ICICIBANK":  "ICICI Bank",
    "SBIN":       "State Bank of India",
    "WIPRO":      "Wipro",
    "TATAMOTORS": "Tata Motors",
    "ADANIENT":   "Adani Enterprises",
    "BAJFINANCE": "Bajaj Finance",
    "HINDUNILVR": "Hindustan Unilever",
    "KOTAKBANK":  "Kotak Mahindra Bank",
    "AXISBANK":   "Axis Bank",
    "LT":         "Larsen & Toubro",
    "MARUTI":     "Maruti Suzuki",
}

PERIOD  = "5y"
OUT_DIR = os.path.join(os.path.dirname(__file__), "data")
END     = datetime.today()
START   = END - timedelta(days=5 * 365)


def download_stock(symbol: str, name: str) -> bool:
    """Try Ticker.history() first (more resilient), then fall back to yf.download()."""
    for suffix in [".NS", ".BO"]:
        ticker_sym = f"{symbol}{suffix}"
        for attempt in range(4):
            wait_on_fail = [0, 15, 40, 80][attempt]
            if wait_on_fail:
                print(f"  [{symbol}] Waiting {wait_on_fail}s before retry {attempt+1}...", flush=True)
                time.sleep(wait_on_fail)
            try:
                print(f"  [{symbol}] Ticker.history({ticker_sym})...", flush=True)
                t  = yf.Ticker(ticker_sym)
                df = t.history(start=START.strftime("%Y-%m-%d"),
                               end=END.strftime("%Y-%m-%d"),
                               auto_adjust=True)

                if df is None or df.empty or len(df) < 100:
                    print(f"  [{symbol}] Insufficient data ({len(df) if df is not None else 0} rows)", flush=True)
                    break  # try next suffix

                # Normalise columns
                if isinstance(df.columns, pd.MultiIndex):
                    df.columns = df.columns.get_level_values(0)

                # Keep standard OHLCV columns only
                keep = [c for c in ["Open", "High", "Low", "Close", "Volume"] if c in df.columns]
                df = df[keep].copy()
                df.dropna(inplace=True)
                df.index = df.index.tz_localize(None)  # remove timezone
                df.index.name = "Date"

                out_path = os.path.join(OUT_DIR, f"{symbol}.csv")
                df.to_csv(out_path)
                print(f"  [{symbol}] OK  {len(df)} rows  ({df.index[0].date()} to {df.index[-1].date()}) -> {symbol}.csv", flush=True)
                return True

            except Exception as exc:
                msg = str(exc)
                if "429" in msg or "Rate" in msg or "Too Many" in msg:
                    extra = 30 + attempt * 20
                    print(f"  [{symbol}] Rate limited on attempt {attempt+1}. Extra wait {extra}s...", flush=True)
                    time.sleep(extra)
                else:
                    print(f"  [{symbol}] Error ({ticker_sym}): {msg}", flush=True)
                    break

    print(f"  [{symbol}] FAILED", flush=True)
    return False


def write_readme(ok: list, fail: list):
    meta_path = os.path.join(OUT_DIR, "README.md")
    with open(meta_path, "w", encoding="utf-8") as f:
        f.write("# Stock Price Dataset\n\n")
        f.write(f"Downloaded: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"Period: {PERIOD} | Source: Yahoo Finance (NSE / BSE)\n\n")
        f.write("## Columns\n\n")
        f.write("`Date, Open, High, Low, Close, Volume`\n\n")
        f.write("## Files\n\n")
        f.write("| Symbol | Company | Rows | Start Date | End Date |\n")
        f.write("|--------|---------|------|------------|----------|\n")
        for sym in sorted(ok):
            p = os.path.join(OUT_DIR, f"{sym}.csv")
            try:
                d     = pd.read_csv(p, index_col="Date", parse_dates=True)
                rows  = len(d)
                start = str(d.index.min().date())
                end   = str(d.index.max().date())
            except Exception:
                rows, start, end = "?", "?", "?"
            f.write(f"| {sym} | {STOCKS.get(sym, sym)} | {rows} | {start} | {end} |\n")
        if fail:
            f.write(f"\n## Failed Downloads\n\n{', '.join(fail)}\n")
    print(f"  README written to {meta_path}", flush=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"\n{'='*60}", flush=True)
    print(f"  Stock Dataset Downloader  (period={PERIOD})", flush=True)
    print(f"  Output: {OUT_DIR}", flush=True)
    print(f"  Date range: {START.date()} to {END.date()}", flush=True)
    print(f"{'='*60}\n", flush=True)

    ok, fail = [], []
    symbols  = list(STOCKS.items())
    for i, (sym, name) in enumerate(symbols, 1):
        # Skip if already downloaded
        csv_path = os.path.join(OUT_DIR, f"{sym}.csv")
        if os.path.exists(csv_path):
            try:
                existing = pd.read_csv(csv_path)
                if len(existing) > 200:
                    print(f"[{i}/{len(symbols)}] {sym} already cached ({len(existing)} rows), skipping.", flush=True)
                    ok.append(sym)
                    continue
            except Exception:
                pass

        print(f"\n[{i}/{len(symbols)}] {sym} - {name}", flush=True)
        success = download_stock(sym, name)
        (ok if success else fail).append(sym)

        if i < len(symbols):
            gap = 8  # polite gap
            print(f"  Waiting {gap}s...", flush=True)
            time.sleep(gap)

    print(f"\n{'='*60}", flush=True)
    print(f"  Results: {len(ok)} OK / {len(fail)} failed", flush=True)
    if fail:
        print(f"  Failed: {', '.join(fail)}", flush=True)
    print(f"{'='*60}\n", flush=True)

    write_readme(ok, fail)


if __name__ == "__main__":
    main()
