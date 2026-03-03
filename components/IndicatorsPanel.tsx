'use client';
import type { Indicators, MACDData } from '@/lib/types';
import { Activity, Zap, BarChart2, TrendingUp, Compass, Target, Database, Trello, Hash } from 'lucide-react';

interface Props { indicators: Partial<Indicators>; }

export default function IndicatorsPanel({ indicators }: Props) {
    const { rsi, rsiHistory, macd, ema50, ema200, volSpike, volHistory, momentum, momentumHistory, atr, S } = indicators as any;

    if (!S) {
        return (
            <div className="glass rounded-xl border border-arena-border min-h-[400px] flex items-center justify-center text-slate-500 font-mono text-sm">
                <div className="animate-pulse">Loading Quant V5 Vectors...</div>
            </div>
        );
    }

    // Normalizations to Bias
    const getBias = (val: number, isVol = false) => {
        if (isVol) return val > 0.2 ? { l: 'EXPANDING', c: '#f59e0b', bg: 'rgba(245,158,11,0.1)' } : val < -0.2 ? { l: 'CHOP / COMPRESSION', c: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' } : { l: 'NORMAL', c: '#64748b', bg: 'transparent' };
        return val > 0.15 ? { l: 'BULLISH', c: '#10b981', bg: 'rgba(16,185,129,0.1)' } :
            val < -0.15 ? { l: 'BEARISH', c: '#ef4444', bg: 'rgba(239,68,68,0.1)' } :
                { l: 'NEUTRAL', c: '#64748b', bg: 'transparent' };
    };

    const getHurstBias = (val: number) => {
        return val > 0.2 ? { l: 'TRENDING', c: '#3b82f6', bg: 'rgba(59,130,246,0.1)' } :
            val < -0.2 ? { l: 'MEAN REVERTING', c: '#f59e0b', bg: 'rgba(245,158,11,0.1)' } :
                { l: 'RANDOM WALK', c: '#64748b', bg: 'transparent' };
    }

    const cards = [
        {
            title: 'ORDER BOOK IMBALANCE',
            icon: <Database size={14} />,
            raw: S.s_OB ? `${(S.s_OB * 100).toFixed(1)}% Δ` : '0%',
            score: S.s_OB,
            bias: getBias(S.s_OB),
            sparkData: momentumHistory || [], color: '#3b82f6', barMode: true
        },
        {
            title: 'STRUCTURAL VWAP DEV',
            icon: <Target size={14} />,
            raw: S.s_VWAP ? `${(S.s_VWAP * atr).toFixed(1)}` : '0.0',
            score: S.s_VWAP,
            bias: getBias(S.s_VWAP),
            sparkData: [], color: '#f59e0b'
        },
        {
            title: 'VOLUME PROFILE POC',
            icon: <BarChart2 size={14} />,
            raw: S.s_VP ? `Δ ${(S.s_VP * atr).toFixed(1)}` : '0.0',
            score: S.s_VP,
            bias: getBias(S.s_VP),
            sparkData: volHistory || [], color: '#8b5cf6', barMode: true
        },
        {
            title: 'MACD MOMENTUM (12,26)',
            icon: <TrendingUp size={14} />,
            raw: macd ? (macd.histogram >= 0 ? `+${macd.histogram.toFixed(1)}` : macd.histogram.toFixed(1)) : '0.0',
            score: S.s_MACD,
            bias: getBias(S.s_MACD),
            sparkData: macd?.histogramHistory || [], color: S.s_MACD >= 0 ? '#10b981' : '#ef4444', barMode: true
        },
        {
            title: 'RSI DIVERGENCE (14)',
            icon: <Activity size={14} />,
            raw: rsi ? rsi.toFixed(1) : '50.0',
            score: S.s_RSI,
            bias: getBias(S.s_RSI),
            sparkData: rsiHistory || [], color: S.s_RSI >= 0 ? '#10b981' : '#ef4444'
        },
        {
            title: 'EMA TREND BIAS',
            icon: <TrendingUp size={14} />,
            raw: ema50 && ema200 ? `${(ema50 - ema200).toFixed(0)} diff` : '0.0',
            score: S.s_EMA,
            bias: getBias(S.s_EMA),
            sparkData: [], color: S.s_EMA >= 0 ? '#10b981' : '#ef4444'
        },
        {
            title: 'MARKET STRUCTURE (BOS)',
            icon: <Trello size={14} />,
            raw: S.s_MS ? `${(S.s_MS * 100).toFixed(0)}% ret` : '0%',
            score: S.s_MS,
            bias: getBias(S.s_MS),
            sparkData: [], color: '#8b5cf6'
        },
        {
            title: 'HURST EXPONENT',
            icon: <Compass size={14} />,
            raw: S.s_H ? `${((S.s_H / 2) + 0.5).toFixed(2)} H` : '0.50 H',
            score: S.s_H,
            bias: getHurstBias(S.s_H),
            sparkData: [], color: '#3b82f6'
        },
        {
            title: 'VOLATILITY (ATR VR)',
            icon: <Zap size={14} />,
            raw: atr ? `$${atr.toFixed(0)} raw` : '0.0',
            score: S.s_VOL,
            bias: getBias(S.s_VOL, true),
            sparkData: [], color: '#f59e0b', barMode: true
        },
        {
            title: 'PRICE MOMENTUM SLOPE',
            icon: <TrendingUp size={14} />,
            raw: momentum ? `${momentum.toFixed(2)}%` : '0%',
            score: momentum ? Math.tanh(momentum) : 0,
            bias: getBias(momentum ? Math.tanh(momentum) : 0),
            sparkData: momentumHistory || [], color: momentum >= 0 ? '#10b981' : '#ef4444', barMode: true
        },
        {
            title: 'ORDER BLOCK PROXIMITY',
            icon: <Hash size={14} />,
            raw: S.s_MS ? `Active` : 'None',
            score: S.s_MS || 0,
            bias: getBias(S.s_MS || 0),
            sparkData: [], color: '#8b5cf6'
        },
        {
            title: 'FUNDING & OI Δ',
            icon: <Database size={14} />,
            raw: '0.010%',
            score: S.s_FR,
            bias: getBias(S.s_FR),
            sparkData: [], color: '#64748b'
        }
    ];

    return (
        <div className="glass rounded-xl border border-arena-border overflow-hidden flex flex-col h-full">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-arena-border bg-[#0a1628]">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-slate-400">
                    QUANTITATIVE EDGE INDICATORS (V5)
                </span>
                <span className="text-xs font-mono text-emerald-400 ml-auto bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/30">Live 1s</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-arena-border/50 p-px flex-1">
                {cards.map((card, i) => (
                    <div key={i} className="bg-arena-card p-3 flex flex-col justify-between group transition-colors hover:bg-slate-800/80">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-400 transition-colors">
                                {card.icon}
                                <span className="text-[10px] font-bold font-mono tracking-wider">{card.title}</span>
                            </div>
                        </div>

                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-sm font-black font-mono" style={{ color: card.bias.c }}>
                                    {card.raw}
                                </div>
                                <div className="text-[10px] font-mono mt-1 text-slate-500 flex flex-col gap-1">
                                    <div className="flex items-center gap-1">
                                        <span className="opacity-70">Z:</span>
                                        <span className={(card.score || 0) > 0 ? 'text-emerald-400/80' : (card.score || 0) < 0 ? 'text-red-400/80' : 'text-slate-500'}>
                                            {(card.score || 0) > 0 ? '+' : ''}{(card.score || 0).toFixed(3)}
                                        </span>
                                    </div>
                                    <span className="px-1.5 py-0.5 rounded border border-white/5 w-fit" style={{ color: card.bias.c, background: card.bias.bg }}>
                                        {card.bias.l}
                                    </span>
                                </div>
                            </div>

                            {/* Mini UI Sparkline fallback */}
                            <div className="w-12 h-8 opacity-60">
                                {card.sparkData.length > 2 ? (
                                    <MiniSparkline data={card.sparkData} color={card.color} barMode={card.barMode} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-full h-px bg-slate-700/50" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MiniSparkline({ data, color, barMode }: { data: number[], color: string, barMode?: boolean }) {
    const valid = data.filter(d => !isNaN(d) && d !== null);
    if (!valid.length) return null;
    const min = Math.min(...valid); const max = Math.max(...valid);
    const range = max - min || 1;
    const w = 48, h = 32;
    const toY = (v: number) => h - ((v - min) / range) * h;

    if (barMode) {
        return (
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                {valid.map((v, i) => {
                    const x = (i / Math.max(1, valid.length)) * w;
                    const bw = Math.max(1, (w / valid.length) * 0.8);
                    const y = toY(v), mid = h / 2;
                    const bh = Math.abs(y - mid);
                    const col = v >= 0 ? '#10b981' : '#ef4444';
                    return <rect key={i} x={x} y={v >= 0 ? mid - bh : mid} width={bw} height={Math.max(1, bh)} fill={color || col} opacity={0.6} />
                })}
            </svg>
        );
    }

    const pts = valid.map((v, i) => `${(i / Math.max(1, valid.length - 1)) * w},${toY(v)}`).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={w} cy={toY(valid[valid.length - 1])} r={2} fill={color} />
        </svg>
    );
}
