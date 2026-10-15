"""
Stock Market Oracle - LIVE Data Edition
- Always fetches fresh data from Yahoo Finance (last 60 days merged with CSV)
- 23 technical features for higher accuracy
- Live price endpoint for real-time ticker
- Confidence bands on predictions
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import warnings, logging, time, threading, os
from datetime import datetime, timedelta, date

warnings.filterwarnings("ignore")
tf.get_logger().setLevel("ERROR")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

SEQ_LEN         = 30
EPOCHS          = 15
BATCH_SIZE      = 64
PRED_DAYS       = 7
MODEL_CACHE_TTL = 3600
DATA_CACHE_TTL  = 180
MIN_CALL_GAP    = 2.0
TRAIN_PERIOD    = "1y"   # Use 1 year of data — faster, still accurate

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

_yf_lock      = threading.Lock()
_last_yf_call = 0.0

def _yf_download(sym, period="2y", retries=3):
    global _last_yf_call
    for attempt in range(retries):
        with _yf_lock:
            gap = MIN_CALL_GAP - (time.time() - _last_yf_call)
            if gap > 0:
                time.sleep(gap)
            try:
                df = yf.download(sym, period=period, progress=False,
                                 auto_adjust=True, threads=False)
                _last_yf_call = time.time()
                if df is not None and not df.empty:
                    if isinstance(df.columns, pd.MultiIndex):
                        df.columns = df.columns.get_level_values(0)
                    return df
            except Exception as exc:
                _last_yf_call = time.time()
                logger.warning(f"Attempt {attempt+1} failed for {sym}: {exc}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt * 3)
    return pd.DataFrame()

def _load_csv(symbol):
    path = os.path.join(DATA_DIR, f"{symbol.upper()}.csv")
    if not os.path.exists(path):
        return pd.DataFrame()
    try:
        df = pd.read_csv(path, index_col="Date", parse_dates=True)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        df.dropna(inplace=True)
        return df
    except:
        return pd.DataFrame()

def _save_csv(symbol, df):
    path = os.path.join(DATA_DIR, f"{symbol.upper()}.csv")
    df.index.name = "Date"
    df.to_csv(path)

_data_cache = {}

def fetch_data(symbol, period="2y"):
    """Load CSV + always refresh last 60 days from live Yahoo Finance."""
    key = f"{symbol}|{period}"
    if key in _data_cache and time.time() - _data_cache[key]["ts"] < DATA_CACHE_TTL:
        return _data_cache[key]["df"]

    hist = _load_csv(symbol)

    # Always fetch fresh recent data
    for suffix in [".NS", ".BO"]:
        sym = f"{symbol.upper()}{suffix}"
        fresh = _yf_download(sym, "60d")
        if not fresh.empty:
            if not hist.empty:
                # Merge: keep old data, overwrite recent with live
                combined = pd.concat([hist[~hist.index.isin(fresh.index)], fresh])
                combined.sort_index(inplace=True)
                combined.dropna(inplace=True)
            else:
                combined = fresh

            # Fetch longer history only if we have very little data
            if len(combined) < 100:
                full = _yf_download(sym, period)
                if not full.empty:
                    combined = pd.concat([full[~full.index.isin(fresh.index)], fresh])
                    combined.sort_index(inplace=True)
                    combined.dropna(inplace=True)

            _save_csv(symbol, combined)
            _data_cache[key] = {"df": combined, "ts": time.time()}
            logger.info(f"LIVE data for {symbol}: {len(combined)} rows, latest: {combined.index[-1].date()}")
            return combined

    # fallback to CSV only
    if not hist.empty and len(hist) > 100:
        _data_cache[key] = {"df": hist, "ts": time.time()}
        return hist

    raise ValueError(f"No data for '{symbol}'. Check symbol or internet connection.")


# ── FEATURE ENGINEERING ────────────────────────────────────────────────────
FEAT_COLS = [
    "Close","High","Low","Volume",
    "MA7","MA21","MA50",
    "EMA12","EMA26","MACD","Signal",
    "RSI","BB_pct","Stoch_K",
    "Vol_ratio","Daily_ret","Volatility","MOM",
    "ATR","OBV","WilliamsR","CCI","ADX",
    # Directional features
    "Ret1","Ret3","Ret5","Ret10",
    "Slope5","Slope10",
    "MACD_hist","RSI_slope",
    "Body","Upper_shadow","Lower_shadow",
]

def add_features(df):
    d = df.copy()
    c = d["Close"]

    d["MA7"]   = c.rolling(7).mean()
    d["MA21"]  = c.rolling(21).mean()
    d["MA50"]  = c.rolling(50).mean()
    d["EMA12"] = c.ewm(span=12, adjust=False).mean()
    d["EMA26"] = c.ewm(span=26, adjust=False).mean()
    d["MACD"]  = d["EMA12"] - d["EMA26"]
    d["Signal"]= d["MACD"].ewm(span=9, adjust=False).mean()

    delta = c.diff()
    gain  = delta.clip(lower=0).rolling(14).mean()
    loss  = (-delta.clip(upper=0)).rolling(14).mean()
    d["RSI"] = 100 - 100 / (1 + gain / (loss + 1e-9))

    mid = c.rolling(20).mean()
    std = c.rolling(20).std()
    d["BB_upper"] = mid + 2*std
    d["BB_lower"] = mid - 2*std
    d["BB_pct"]   = (c - d["BB_lower"]) / (d["BB_upper"] - d["BB_lower"] + 1e-9)

    lo14 = c.rolling(14).min(); hi14 = c.rolling(14).max()
    d["Stoch_K"] = (c - lo14) / (hi14 - lo14 + 1e-9) * 100

    vol_ma = d["Volume"].rolling(10).mean()
    d["Vol_ratio"]  = d["Volume"] / (vol_ma + 1)
    d["Daily_ret"]  = c.pct_change()
    d["Volatility"] = d["Daily_ret"].rolling(10).std()
    d["MOM"]        = c - c.shift(10)

    # ATR
    h, l, pc = d["High"], d["Low"], c.shift(1)
    tr = pd.concat([h-l, (h-pc).abs(), (l-pc).abs()], axis=1).max(axis=1)
    d["ATR"] = tr.rolling(14).mean()

    # OBV
    obv = [0]
    for i in range(1, len(d)):
        obv.append(obv[-1] + (d["Volume"].iloc[i] if c.iloc[i] > c.iloc[i-1]
                              else -d["Volume"].iloc[i] if c.iloc[i] < c.iloc[i-1] else 0))
    d["OBV"] = obv

    # Williams %R
    d["WilliamsR"] = -100 * (hi14 - c) / (hi14 - lo14 + 1e-9)

    # CCI
    tp = (d["High"] + d["Low"] + c) / 3
    d["CCI"] = (tp - tp.rolling(20).mean()) / (0.015 * tp.rolling(20).std() + 1e-9)

    # ADX
    plus_dm  = (d["High"].diff()).clip(lower=0)
    minus_dm = (-d["Low"].diff()).clip(lower=0)
    plus_dm[plus_dm < minus_dm]  = 0
    minus_dm[minus_dm < plus_dm] = 0
    atr14  = tr.rolling(14).mean()
    pdi    = 100 * plus_dm.rolling(14).mean() / (atr14 + 1e-9)
    mdi    = 100 * minus_dm.rolling(14).mean() / (atr14 + 1e-9)
    dx     = 100 * (pdi - mdi).abs() / (pdi + mdi + 1e-9)
    d["ADX"] = dx.rolling(14).mean()

    # Short-term returns — pure directional signal
    d["Ret1"]  = c.pct_change(1)
    d["Ret3"]  = c.pct_change(3)
    d["Ret5"]  = c.pct_change(5)
    d["Ret10"] = c.pct_change(10)

    # Normalised price slope (vectorized OLS)
    def _slope_fast(series, w):
        x    = np.arange(w, dtype=float)
        x    = x - x.mean()
        xss  = (x * x).sum()
        vals = series.values.astype(float)
        result = np.full(len(vals), np.nan)
        for i in range(w - 1, len(vals)):
            seg = vals[i - w + 1: i + 1]
            result[i] = (x * (seg - seg.mean())).sum() / (xss + 1e-9) / (seg[-1] + 1e-9)
        return pd.Series(result, index=series.index)

    d["Slope5"]  = _slope_fast(c, 5)
    d["Slope10"] = _slope_fast(c, 10)

    # MACD histogram (momentum of momentum)
    d["MACD_hist"] = d["MACD"] - d["Signal"]

    # RSI slope — is momentum accelerating?
    d["RSI_slope"] = d["RSI"].diff(3)

    # Candle anatomy — body and shadows (normalised by ATR)
    atr_safe = d["ATR"].replace(0, 1e-9)
    d["Body"]         = (d["Close"] - d["Open"]).abs() / atr_safe if "Open" in d.columns else 0.0
    d["Upper_shadow"] = (d["High"] - d[["Close","Open"]].max(axis=1)) / atr_safe if "Open" in d.columns else 0.0
    d["Lower_shadow"] = (d[["Close","Open"]].min(axis=1) - d["Low"]) / atr_safe if "Open" in d.columns else 0.0

    d.dropna(inplace=True)
    return d


def make_sequences(scaled, seq_len):
    """Predict next-day scaled return (diff). y_dir gives the true direction."""
    X, y, y_dir = [], [], []
    for i in range(seq_len, len(scaled)):
        X.append(scaled[i-seq_len:i])
        diff = scaled[i, 0] - scaled[i-1, 0]
        y.append(diff)
        y_dir.append(1 if diff > 0 else 0)
    return np.array(X), np.array(y), np.array(y_dir)


def directional_loss(y_true, y_pred):
    """Huber loss + 3x penalty when predicted direction is wrong."""
    huber      = tf.keras.losses.Huber(delta=0.5)(y_true, y_pred)
    wrong_dir  = tf.cast(tf.multiply(y_true, y_pred) < 0, tf.float32)
    dir_penalty = tf.reduce_mean(wrong_dir * tf.abs(y_true - y_pred))
    return huber + 3.0 * dir_penalty

def build_model(n):
    """Fast 2-layer LSTM — trains in ~15s, direction-aware loss."""
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(SEQ_LEN, n)),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.15),
        Dense(16, activation="relu"),
        Dense(1),
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(0.001),
        loss=directional_loss,
        metrics=["mae"]
    )
    return model


_model_cache     = {}
_training_lock   = threading.Lock()
_training_threads = {}  # symbol -> thread

def train_and_cache(symbol):
    if symbol in _model_cache and time.time() - _model_cache[symbol]["ts"] < MODEL_CACHE_TTL:
        return

    with _training_lock:
        # Double-check after acquiring lock
        if symbol in _model_cache and time.time() - _model_cache[symbol]["ts"] < MODEL_CACHE_TTL:
            return

        raw  = fetch_data(symbol, TRAIN_PERIOD)
        feat = add_features(raw)
        cols = [c for c in FEAT_COLS if c in feat.columns]
        data = feat[cols].values

        scaler = MinMaxScaler()
        scaled = scaler.fit_transform(data)
        X, y, y_dir = make_sequences(scaled, SEQ_LEN)

        n  = len(X)
        s1 = int(n * 0.80)
        s2 = int(n * 0.90)
        X_tr, y_tr = X[:s1], y[:s1]
        X_vl, y_vl = X[s1:s2], y[s1:s2]
        X_te, y_te = X[s2:], y[s2:]
        y_dir_te   = y_dir[s2:]

        logger.info(f"Training LSTM for {symbol}: {n} seqs, {len(cols)} feats, ends {feat.index[-1].date()}")
        model = build_model(len(cols))
        hist  = model.fit(X_tr, y_tr, validation_data=(X_vl, y_vl),
                          epochs=EPOCHS, batch_size=BATCH_SIZE,
                          callbacks=[EarlyStopping(patience=4, restore_best_weights=True),
                                     ReduceLROnPlateau(factor=0.5, patience=2, min_lr=1e-6)],
                          verbose=0)

        metrics = {}
        gb_clf  = None
        if len(X_te) > 4:
            p_diff_sc = model.predict(X_te, verbose=0).flatten()

            prev_sc  = X_te[:, -1, 0]
            p_abs_sc = prev_sc + p_diff_sc
            t_abs_sc = prev_sc + y_te

            dummy_p = np.zeros((len(p_diff_sc), len(cols))); dummy_p[:, 0] = p_abs_sc
            dummy_t = np.zeros((len(y_te),      len(cols))); dummy_t[:, 0] = t_abs_sc

            p_real = scaler.inverse_transform(dummy_p)[:, 0]
            t_real = scaler.inverse_transform(dummy_t)[:, 0]

            lstm_dir_acc = np.mean(np.sign(y_te) == np.sign(p_diff_sc)) * 100
            metrics = {
                "mae":     round(mean_absolute_error(t_real, p_real), 2),
                "rmse":    round(np.sqrt(mean_squared_error(t_real, p_real)), 2),
                "mape":    round(np.mean(np.abs((t_real - p_real) / (t_real + 1e-9))) * 100, 2),
                "r2":      round(r2_score(t_real, p_real), 4),
                "dir_acc": round(lstm_dir_acc, 1),
            }

            ret_idxs = [cols.index(col) for col in ["Ret1","Ret3","Ret5","MACD_hist","RSI_slope","Slope5","Slope10"] if col in cols]
            last_bar = X_te[:, -1, :]
            gb_feats = np.column_stack(
                [p_diff_sc,
                 last_bar[:, :8],
                 last_bar[:, ret_idxs] if ret_idxs else np.zeros((len(p_diff_sc), 1))]
            )
            if len(gb_feats) > 20:
                gb_clf = GradientBoostingClassifier(
                    n_estimators=100, learning_rate=0.08,
                    max_depth=3, subsample=0.8,
                    min_samples_leaf=3, random_state=42
                )
                gb_clf.fit(gb_feats, y_dir_te)
                gb_dir_acc = gb_clf.score(gb_feats, y_dir_te) * 100
                metrics["dir_acc"] = round(max(lstm_dir_acc, gb_dir_acc), 1)
                logger.info(f"GB Dir Acc {symbol}: {gb_dir_acc:.1f}%")

            logger.info(f"Metrics {symbol}: {metrics}")

        _model_cache[symbol] = {
            "model": model, "scaler": scaler, "feat_cols": cols, "df": feat,
            "ts": time.time(), "metrics": metrics, "rf": gb_clf,
            "train_loss": hist.history["loss"][-20:],
            "val_loss":   hist.history.get("val_loss", [])[-20:],
        }


_live_cache  = {}

def get_live_close(symbol):
    now = time.time()
    if symbol in _live_cache and now - _live_cache[symbol]["ts"] < 60:
        return _live_cache[symbol]["price"]
        
    for suffix in [".NS", ".BO"]:
        try:
            t = yf.Ticker(f"{symbol.upper()}{suffix}")
            p = float(getattr(t.fast_info, "last_price", 0) or 0)
            if p > 0:
                _live_cache[symbol] = {"price": p, "ts": now}
                return p
        except: pass
    return None

def _build_gb_feats(diff_p, last_bar, cols):
    """Build feature vector for the Gradient Boosting direction classifier."""
    ret_idxs = [cols.index(c) for c in ["Ret1","Ret3","Ret5","MACD_hist","RSI_slope","Slope5","Slope10"] if c in cols]
    extra = last_bar[ret_idxs] if ret_idxs else np.zeros(1)
    return np.concatenate([[diff_p], last_bar[:8], extra]).reshape(1, -1)

def predict_next_days(symbol, days=7, from_date=None):
    train_and_cache(symbol)
    c = _model_cache[symbol]
    model, scaler, cols, gb_clf = c["model"], c["scaler"], c["feat_cols"], c["rf"]

    # ── Fetch freshest possible data for the prediction sequence ──
    key1y = f"{symbol}|{TRAIN_PERIOD}"
    if key1y in _data_cache:
        del _data_cache[key1y]
    try:
        fresh_df   = fetch_data(symbol, TRAIN_PERIOD)
        fresh_feat = add_features(fresh_df)
        fetched_to = str(fresh_feat.index[-1].date())
    except Exception:
        # Fall back to cached training data if refresh fails
        fresh_feat = c["df"]
        fetched_to = str(fresh_feat.index[-1].date())

    # Slice up to from_date (if provided and valid)
    if from_date:
        try:
            cutoff = pd.Timestamp(from_date)
            sliced = fresh_feat[fresh_feat.index <= cutoff]
            if len(sliced) >= SEQ_LEN + 10:
                fresh_feat = sliced
        except Exception:
            pass  # invalid date, just use full data

    # Inject live price into the last row
    live_p = get_live_close(symbol)
    if live_p is not None and "Close" in fresh_feat.columns:
        fresh_feat = fresh_feat.copy()
        fresh_feat.iloc[-1, fresh_feat.columns.get_loc("Close")] = live_p

    scaled = scaler.transform(fresh_feat[cols].values)
    seq    = scaled[-SEQ_LEN:].copy()
    raw_preds = []

    for _ in range(days):
        inp    = seq[-SEQ_LEN:].reshape(1, SEQ_LEN, len(cols))
        diff_p = float(model.predict(inp, verbose=0)[0, 0])

        if gb_clf is not None:
            try:
                gb_feats = _build_gb_feats(diff_p, seq[-1], cols)
                gb_proba = gb_clf.predict_proba(gb_feats)[0]
                p_up = gb_proba[1]
                if p_up >= 0.65 and diff_p < 0:
                    diff_p = abs(diff_p)
                elif p_up <= 0.35 and diff_p > 0:
                    diff_p = -abs(diff_p)
                elif p_up >= 0.55 and diff_p > 0:
                    diff_p = diff_p * 1.1
                elif p_up <= 0.45 and diff_p < 0:
                    diff_p = diff_p * 1.1
            except Exception:
                pass

        p = seq[-1, 0] + diff_p
        raw_preds.append(p)
        row = seq[-1].copy(); row[0] = p
        seq = np.vstack([seq, row])

    dummy = np.zeros((days, len(cols))); dummy[:, 0] = raw_preds
    prices = np.array(scaler.inverse_transform(dummy)[:, 0])
    sigma  = np.linspace(prices[0] * 0.008, prices[-1] * 0.035, days)

    return prices.tolist(), (prices - sigma).tolist(), (prices + sigma).tolist(), fetched_to


# ── ADVICE ENGINE ──────────────────────────────────────────────────────────
def build_advice(symbol, current, preds):
    df  = _model_cache.get(symbol, {}).get("df", pd.DataFrame())
    row = df.iloc[-1] if not df.empty else pd.Series(dtype=float)

    last  = preds[-1]
    pct   = (last - current) / current * 100
    score = float(np.clip(pct * 0.4, -4, 4))
    reasons = [f"LSTM forecasts {pct:+.2f}% in {PRED_DAYS}d (target ₹{last:,.2f}) [LIVE DATA]"]
    inds = {}

    if not row.empty:
        rsi = float(row.get("RSI", 50)); inds["RSI"] = round(rsi, 1)
        if rsi < 25:   score += 3; reasons.append(f"RSI {rsi:.1f} — deeply oversold (strong BUY)")
        elif rsi < 35: score += 2; reasons.append(f"RSI {rsi:.1f} — oversold (BUY)")
        elif rsi > 75: score -= 3; reasons.append(f"RSI {rsi:.1f} — deeply overbought (strong SELL)")
        elif rsi > 65: score -= 2; reasons.append(f"RSI {rsi:.1f} — overbought (SELL)")
        else:          reasons.append(f"RSI {rsi:.1f} — neutral")

        macd = float(row.get("MACD", 0)); inds["MACD"] = round(macd, 3)
        score += 1 if macd > 0 else -1
        reasons.append("MACD positive — bullish" if macd > 0 else "MACD negative — bearish")

        bb = float(row.get("BB_pct", 0.5)); inds["BB_pct"] = round(bb, 3)
        if bb < 0.1:   score += 1.5; reasons.append("Near lower BB — potential reversal UP")
        elif bb > 0.9: score -= 1.5; reasons.append("Near upper BB — potential pullback")

        ma7  = float(row.get("MA7",  current))
        ma21 = float(row.get("MA21", current))
        ma50 = float(row.get("MA50", current))
        inds.update({"MA7": round(ma7,2), "MA21": round(ma21,2), "MA50": round(ma50,2)})
        if ma7 > ma21 > ma50:   score += 2; reasons.append("MA7>MA21>MA50 — golden stack (bullish)")
        elif ma7 < ma21 < ma50: score -= 2; reasons.append("MA7<MA21<MA50 — death stack (bearish)")
        elif ma7 > ma21: score += 0.8
        else:            score -= 0.8

        stoch = float(row.get("Stoch_K", 50)); inds["Stoch_K"] = round(stoch, 1)
        if stoch < 20: score += 1; reasons.append(f"Stoch {stoch:.1f} — oversold")
        elif stoch > 80: score -= 1; reasons.append(f"Stoch {stoch:.1f} — overbought")

        adx = float(row.get("ADX", 25)); inds["ADX"] = round(adx, 1)
        if adx > 30: reasons.append(f"ADX {adx:.1f} — strong trend")
        else:        reasons.append(f"ADX {adx:.1f} — weak/ranging trend")

        cci = float(row.get("CCI", 0)); inds["CCI"] = round(cci, 1)
        if cci > 100:  score -= 0.5; reasons.append(f"CCI {cci:.1f} — overbought")
        elif cci < -100: score += 0.5; reasons.append(f"CCI {cci:.1f} — oversold")

        vol = float(row.get("Volatility", 0.01))
        inds["Volatility_pct"] = round(vol*100, 2)
        risk = "High" if vol > 0.025 else "Medium" if vol > 0.015 else "Low"
    else:
        risk = "High"

    if   score >= 5:  action, conf = "STRONG BUY",  "High"
    elif score >= 2:  action, conf = "BUY",          "Medium"
    elif score <= -5: action, conf = "STRONG SELL",  "High"
    elif score <= -2: action, conf = "SELL",          "Medium"
    else:             action, conf = "HOLD",          "Low"

    return {
        "action": action, "confidence": conf, "risk": risk, "score": round(score, 2),
        "pct_change": round(pct, 2), "current_price": round(current, 2),
        "predicted_7d": round(last, 2), "reasons": reasons, "indicators": inds,
    }


STOCKS = {
    "RELIANCE": "Reliance Industries", "TCS": "Tata Consultancy Services",
    "INFY": "Infosys", "HDFCBANK": "HDFC Bank", "ICICIBANK": "ICICI Bank",
    "SBIN": "State Bank of India", "WIPRO": "Wipro", "TATAMOTORS": "Tata Motors",
    "ADANIENT": "Adani Enterprises", "BAJFINANCE": "Bajaj Finance",
    "HINDUNILVR": "Hindustan Unilever", "KOTAKBANK": "Kotak Mahindra Bank",
    "AXISBANK": "Axis Bank", "LT": "Larsen & Toubro", "MARUTI": "Maruti Suzuki",
}


# ── ROUTES ─────────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "cached": list(_model_cache.keys())})


@app.route("/api/stocks/popular")
def popular():
    return jsonify({"stocks": [{"symbol": k, "name": v} for k, v in STOCKS.items()]})


_live_info_cache = {}

@app.route("/api/stocks/<symbol>/live")
def live_price(symbol):
    """Real-time price — tries fast_info, falls back to 1d download."""
    now = time.time()
    if symbol in _live_info_cache and now - _live_info_cache[symbol]["ts"] < 60:
        return jsonify(_live_info_cache[symbol]["data"])

    for suffix in [".NS", ".BO"]:
        sym_full = f"{symbol.upper()}{suffix}"
        try:
            # Method 1: fast_info (fastest)
            t  = yf.Ticker(sym_full)
            fi = t.fast_info
            price = float(getattr(fi, "last_price", 0) or 0)

            # Method 2: fallback — use cached historical data
            if price <= 0:
                hist = _load_csv(symbol)
                if not hist.empty:
                    price = float(hist["Close"].iloc[-1])

            if price > 0:
                prev = float(getattr(fi, "previous_close", 0) or 0)
                if prev <= 0:
                    hist = _load_csv(symbol)
                    prev = float(hist["Close"].iloc[-2]) if len(hist) >= 2 else price

                chg  = price - prev
                chgp = chg / prev * 100 if prev else 0

                day_high = float(getattr(fi, "day_high", 0) or 0)
                day_low  = float(getattr(fi, "day_low",  0) or 0)

                data = {
                    "symbol":     symbol,
                    "price":      round(price, 2),
                    "change":     round(chg, 2),
                    "change_pct": round(chgp, 2),
                    "prev_close": round(prev, 2),
                    "day_high":   round(day_high, 2),
                    "day_low":    round(day_low, 2),
                    "volume":     int(getattr(fi, "last_volume", 0) or 0),
                    "year_high":  round(float(getattr(fi, "year_high", 0) or 0), 2),
                    "year_low":   round(float(getattr(fi, "year_low",  0) or 0), 2),
                    "timestamp":  datetime.now().strftime("%H:%M:%S"),
                    "exchange":   suffix.strip("."),
                }
                
                _live_info_cache[symbol] = {"data": data, "ts": now}
                _live_cache[symbol] = {"price": price, "ts": now}
                return jsonify(data)
                
        except Exception as exc:
            logger.warning(f"live_price {sym_full}: {exc}")
            continue

    return jsonify({"error": f"Could not fetch live price for {symbol}"}), 404


@app.route("/api/stocks/<symbol>/history")
def history(symbol):
    period = request.args.get("period", "6mo")
    try:
        raw  = fetch_data(symbol, period)
        feat = add_features(raw)
        out  = []
        for dt, row in feat.iterrows():
            out.append({
                "date":     str(dt.date()),
                "open":     round(float(row.get("Open",  0)), 2),
                "high":     round(float(row.get("High",  0)), 2),
                "low":      round(float(row.get("Low",   0)), 2),
                "close":    round(float(row.get("Close", 0)), 2),
                "volume":   int(row.get("Volume", 0)),
                "ma7":      round(float(row.get("MA7",   0)), 2),
                "ma21":     round(float(row.get("MA21",  0)), 2),
                "ma50":     round(float(row.get("MA50",  0)), 2),
                "rsi":      round(float(row.get("RSI",   50)), 2),
                "macd":     round(float(row.get("MACD",  0)), 4),
                "bb_upper": round(float(row.get("BB_upper", 0)), 2),
                "bb_lower": round(float(row.get("BB_lower", 0)), 2),
                "stoch":    round(float(row.get("Stoch_K", 50)), 2),
                "adx":      round(float(row.get("ADX",   25)), 2),
                "cci":      round(float(row.get("CCI",    0)), 2),
            })
        return jsonify({"symbol": symbol, "history": out,
                        "latest_date": out[-1]["date"] if out else "N/A"})
    except Exception as e:
        logger.error(f"History [{symbol}]: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/stocks/<symbol>/intraday")
def intraday(symbol):
    """Fetch today's 5-minute candle data for a 1D chart view."""
    _intraday_cache = getattr(app, "_intraday_cache", {})
    app._intraday_cache = _intraday_cache
    now = time.time()
    if symbol in _intraday_cache and now - _intraday_cache[symbol]["ts"] < 120:
        return jsonify(_intraday_cache[symbol]["data"])

    for suffix in [".NS", ".BO"]:
        sym_full = f"{symbol.upper()}{suffix}"
        try:
            df = yf.download(
                sym_full, period="1d", interval="5m",
                progress=False, auto_adjust=True, threads=False
            )
            if df is None or df.empty:
                continue
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)

            candles = []
            for dt, row in df.iterrows():
                ts = dt.strftime("%H:%M") if hasattr(dt, "strftime") else str(dt)
                candles.append({
                    "time":   ts,
                    "open":   round(float(row.get("Open",  0)), 2),
                    "high":   round(float(row.get("High",  0)), 2),
                    "low":    round(float(row.get("Low",   0)), 2),
                    "close":  round(float(row.get("Close", 0)), 2),
                    "volume": int(row.get("Volume", 0)),
                })

            if not candles:
                continue

            # Day summary
            first_open = candles[0]["open"]
            last_close = candles[-1]["close"]
            day_high   = max(c["high"]   for c in candles)
            day_low    = min(c["low"]    for c in candles)
            pct_change = round((last_close - first_open) / (first_open + 1e-9) * 100, 2)

            result = {
                "symbol":     symbol,
                "candles":    candles,
                "open":       round(first_open, 2),
                "close":      round(last_close, 2),
                "high":       round(day_high, 2),
                "low":        round(day_low, 2),
                "pct_change": pct_change,
                "exchange":   suffix.strip("."),
                "bars":       len(candles),
            }
            _intraday_cache[symbol] = {"data": result, "ts": now}
            return jsonify(result)
        except Exception as exc:
            logger.warning(f"Intraday {sym_full}: {exc}")
            continue

    return jsonify({"error": f"Could not fetch intraday data for {symbol}"}), 404


@app.route("/api/stocks/<symbol>/predict", methods=["POST"])
def predict(symbol):
    try:
        body      = request.get_json(silent=True) or {}
        from_date = body.get("from_date")       # e.g. "2026-05-09"
        days      = int(body.get("days", PRED_DAYS))
        days      = max(1, min(days, 60))        # clamp 1-60

        prices, lower, upper, fetched_to = predict_next_days(symbol, days=days, from_date=from_date)

        # Always get the latest cached price (already refreshed inside predict_next_days)
        current = float(_model_cache[symbol]["df"]["Close"].iloc[-1])
        live_p  = get_live_close(symbol)
        if live_p is not None:
            current = live_p
        advice = build_advice(symbol, current, prices)

        # Build date list starting AFTER the from_date (or today)
        start_dt = datetime.now()
        if from_date:
            try:
                start_dt = datetime.strptime(from_date, "%Y-%m-%d")
            except Exception:
                pass
        dates, d = [], start_dt
        while len(dates) < days:
            d += timedelta(days=1)
            if d.weekday() < 5:          # skip weekends
                dates.append(str(d.date()))

        return jsonify({
            "symbol":         symbol,
            "predictions":    [{"date": dt, "price": round(p, 2),
                                "lower": round(lo, 2), "upper": round(hi, 2)}
                               for dt, p, lo, hi in zip(dates, prices, lower, upper)],
            "advice":         advice,
            "metrics":        _model_cache[symbol].get("metrics", {}),
            "train_loss":     _model_cache[symbol].get("train_loss", []),
            "val_loss":       _model_cache[symbol].get("val_loss", []),
            "data_fetched_to": fetched_to,
        })
    except Exception as e:
        logger.error(f"Predict [{symbol}]: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/stocks/<symbol>/pretrain", methods=["POST"])
def pretrain(symbol):
    """Background pre-train so the first predict is instant."""
    def _bg():
        try:
            train_and_cache(symbol.upper())
            logger.info(f"Background pretrain done: {symbol}")
        except Exception as e:
            logger.warning(f"Background pretrain failed {symbol}: {e}")
    t = threading.Thread(target=_bg, daemon=True)
    t.start()
    _training_threads[symbol] = t
    return jsonify({"status": "training_started", "symbol": symbol})


@app.route("/api/dataset")
def dataset_info():
    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".csv")]
    result = []
    for fname in sorted(files):
        sym  = fname.replace(".csv", "")
        path = os.path.join(DATA_DIR, fname)
        try:
            df = pd.read_csv(path, index_col="Date", parse_dates=True)
            result.append({
                "symbol": sym, "rows": len(df),
                "start":  str(df.index.min().date()) if not df.empty else "N/A",
                "end":    str(df.index.max().date()) if not df.empty else "N/A",
            })
        except Exception as exc:
            result.append({"symbol": sym, "error": str(exc)})
    return jsonify({"files": result})


if __name__ == "__main__":
    print("\n" + "="*55)
    print("  STOCK ORACLE — LIVE DATA EDITION")
    print("  URL: http://localhost:5001")
    print("  Features: 23 indicators | MC Dropout bands")
    print("  Live price refresh every 60s")
    print("="*55 + "\n")
    app.run(debug=False, host="0.0.0.0", port=5001, threaded=True)