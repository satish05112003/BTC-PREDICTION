# BTC Prediction Arena 🚀

**BTC Prediction Arena** is a real-time, live cryptocurrency prediction engine and visualization dashboard. It watches live Bitcoin prices from Coinbase, runs a mathematical scoring model over multiple indicators, and predicts price movement using a built-in AI Survival Game mechanic across multiple timeframes.

## 🌟 Core Features

- **Live Data Stream:** Built on top of Coinbase Advanced Trade WebSockets.
- **Weighted Multi-Timeframe Predictions:** Analyzes the market across 1m, 5m, 15m, 30m, and 1h intervals.
- **AI Survival Game:** The prediction model has "lives" and a minimum accuracy threshold. If the prediction engine performs poorly, it "dies", archives its history, and creates a new Generation.
- **Time-Locked Snapshot Engine:** Strictly evaluates predictions at exact IST clock boundaries against the live price.
- **Permanent Stats Tracking:** Tracks Daily Performance (resetting at midnight IST) and Lifetime Stats.
- **Glassmorphism UI:** Stunning dark mode interface with real-time reactive charting using TradingView's Lightweight Charts.

---

## 🧠 The Predictive Model (Mathematical Scoring)

The engine relies on a strictly balanced **Weighted Probability Scoring system (Range: -100 to +100)** instead of simple reactive signals. A score greater than `+25` generates an `UP` prediction, while `< -25` generates `DOWN`. Anything in between is considered a "No-trade zone" to protect the engine's accuracy.

### Signal Weighting Matrix:
1. **Trend Alignment (EMA 50 vs EMA 200)** 
   - `+20` if aligned with the trend.
   - `-20` if opposing the major trend.
2. **MACD Momentum (12, 26, 9)**
   - `+15` for strong crossover, `+10` for weak crossover.
   - `±10` based on Histogram expansion/shrinkage. 
3. **RSI Zones (14)**
   - `+15` in the Bullish zone (55–70), `-15` in the Bearish zone (30–45).
   - `-20` for Overbought/Oversold reversal extremes (>70 or <30) to prevent buying at local tops.
4. **Order Block Reaction**
   - `±20` if the price is actively bouncing from a detected valid volume Order Block.
5. **Volume Spikes**
   - `±10` if trading volume significantly supports the current momentum direction.
6. **ATR Volatility Filter (14)**
   - If market volatility drops to extreme lows, the total prediction score is slashed by `15%` to prevent entering chop.

**Confidence Thresholds:**
Base threshold to issue a prediction is **`55%` confidence**. If the AI's "Rolling 50 Prediction Accuracy" drops below `68%`, the engine enters **Strict Mode** and raises the entry bar to **`65%`**.

---

## 🏁 The AI Survival System

The engine doesn't just predict; it plays a survival game designed to enforce quality over quantity.

- **Lives:** Starts with 3 lives. Every loss burns 1 life.
- **Accuracy Death:** If the Rolling 50 Accuracy drops below **`60%`**, the AI dies instantly.
- **Critical Danger:** Drops below `65%` put the AI in the "Yellow" Danger Zone, activating Strict Mode.
- **Generations:** Upon death, the current generation is archived with its highest streaks and survival duration. A fresh Generation begins with 3 lives.

## ⏱️ IST Time-Locked Snapshot Engine

A specialized server-side execution loop built for rigid accountability:
- Triggers at exact **Indian Standard Time (IST)** clock boundaries (e.g., 5m snaps fire precisely at `:00, :05, :10`).
- The current price is locked as **Snapshot Price**.
- The prediction engine generates a locked forecast.
- At the close of the timeframe, the incoming tick price is compared against the Snapshot price to definitively log a `WIN`, `LOSS`, or `DRAW`. No repainting, no cheating. 

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, `lightweight-charts`, `lucide-react`.
- **Backend:** Node.js, `ws` (Custom WebSocket Server).
- **Data Source:** Coinbase Advanced Trade WebSocket API & REST endpoints.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
Because this project uses a custom Node WebSocket server to process the math and aggregate the tickers, you need to run **both** the backend and the frontend.

**Fastest Method:**
```bash
npm run dev:all
```
*(This uses `concurrently` to start the Node server on `:8080` and the Next.js dev server on `:3000` safely.)*

**Manual Method (in separate terminals):**
```bash
# Terminal 1 - The Backend
npm run server:safe

# Terminal 2 - The Frontend
npm run dev
```

### 3. Open your Browser
Navigate to `http://localhost:3000`
