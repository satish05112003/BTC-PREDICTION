import { useState } from 'react';
import type { DualAIState } from '@/lib/types';

interface Props {
    ai: DualAIState;
    lifeAnimation: boolean;
    deathAnimation: boolean;
    reviveAnimation: boolean;
}

const STATUS_COLORS: Record<string, { text: string; bg: string; border: string; label: string }> = {
    ALIVE: { text: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', label: 'ALIVE' },
    DANGER: { text: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', label: 'DANGER' },
    CRITICAL: { text: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', label: 'CRITICAL' },
    DEAD: { text: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.3)', label: 'DEAD' },
};

function AccBar({ value, color }: { value: number; color: string }) {
    return (
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
        </div>
    );
}

export default function AIStatusPanel({ ai, lifeAnimation, deathAnimation, reviveAnimation }: Props) {
    const [mode, setMode] = useState<'live' | 'snap'>('live');
    const currentAI = ai[mode];

    const sc = STATUS_COLORS[currentAI.status] || STATUS_COLORS.ALIVE;
    const accColor = currentAI.rolling50Accuracy >= 70 ? '#10b981' : currentAI.rolling50Accuracy >= 65 ? '#f59e0b' : '#ef4444';
    const health = Math.round((currentAI.lives / 3) * 100);
    const healthColor = health >= 67 ? '#10b981' : health >= 34 ? '#f59e0b' : '#ef4444';

    return (
        <div className={`glass rounded-xl border overflow-hidden shrink-0 transition-all ${deathAnimation && mode === 'live' ? 'animate-shake border-red-500/50' : reviveAnimation && mode === 'live' ? 'animate-revive border-emerald-500/50' : 'border-arena-border'}`}
            style={{ borderColor: currentAI.status !== 'ALIVE' ? sc.border : undefined }}>

            {/* Toggle Header */}
            <div className="flex border-b border-arena-border bg-[#0a1628]">
                {(['live', 'snap'] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)}
                        className="flex-1 py-2 text-[10px] font-mono font-bold tracking-widest transition-colors"
                        style={{
                            color: mode === m ? (m === 'live' ? '#8b5cf6' : '#f59e0b') : '#64748b',
                            background: mode === m ? (m === 'live' ? 'rgba(139,92,246,0.1)' : 'rgba(245,158,11,0.1)') : 'transparent',
                            borderBottom: mode === m ? `2px solid ${m === 'live' ? '#8b5cf6' : '#f59e0b'}` : '2px solid transparent',
                        }}>
                        {m === 'live' ? `LIVE PRED (GEN ${ai.live.generation})` : `SNAPSHOT (GEN ${ai.snap.generation})`}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-arena-border">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: sc.text }} />
                    <span className="text-xs font-mono font-bold tracking-widest text-slate-400">AI ENGINE</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">GEN {currentAI.generation}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold"
                        style={{ color: sc.text, background: sc.bg, border: `1px solid ${sc.border}` }}>
                        {sc.label}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Lives */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">LIVES</span>
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3].map(i => (
                            <div key={i}
                                className={`w-5 h-5 rounded-full border transition-all duration-300 ${lifeAnimation && i === currentAI.lives + 1 && mode === 'live' ? 'animate-life-lost' : ''}`}
                                style={{
                                    background: i <= currentAI.lives ? '#ef4444' : 'rgba(100,116,139,0.15)',
                                    border: `1px solid ${i <= currentAI.lives ? 'rgba(239,68,68,0.6)' : 'rgba(100,116,139,0.25)'}`,
                                    boxShadow: i <= currentAI.lives ? '0 0 8px rgba(239,68,68,0.5)' : 'none',
                                }}
                            />
                        ))}
                        <span className="text-xs font-mono text-slate-500 ml-1">{currentAI.lives}/3</span>
                    </div>
                </div>

                {/* Health bar */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-slate-500">HEALTH</span>
                        <span className="text-xs font-mono font-bold" style={{ color: healthColor }}>{health}%</span>
                    </div>
                    <AccBar value={health} color={healthColor} />
                </div>

                {/* Rolling 50 Accuracy */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-slate-500">ROLLING 50 ACC</span>
                        <span className="text-xs font-mono font-bold" style={{ color: accColor }}>{currentAI.rolling50Accuracy}%</span>
                    </div>
                    <AccBar value={currentAI.rolling50Accuracy} color={accColor} />
                    <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs font-mono text-slate-700">danger &lt;65%</span>
                        <span className="text-xs font-mono text-slate-700">death &lt;60%</span>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'WINS', val: currentAI.wins, color: '#10b981' },
                        { label: 'LOSSES', val: currentAI.losses, color: '#ef4444' },
                        { label: 'TOTAL', val: currentAI.totalPredictions, color: '#e2e8f0' },
                    ].map(({ label, val, color }) => (
                        <div key={label} className="text-center p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <div className="text-xs font-mono text-slate-500">{label}</div>
                            <div className="text-lg font-black font-mono" style={{ color }}>{val}</div>
                        </div>
                    ))}
                </div>

                {/* Streak */}
                {currentAI.streak !== 0 && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{ background: currentAI.streak > 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${currentAI.streak > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                        <span className="text-xs font-mono text-slate-500">STREAK</span>
                        <span className={`text-sm font-black font-mono ${currentAI.streak > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {currentAI.streak > 0 ? `🔥 ${currentAI.streak}W` : `❄️ ${Math.abs(currentAI.streak)}L`}
                        </span>
                    </div>
                )}

                {/* Avg Confidence + Mode */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                        <div className="text-xs font-mono text-slate-500">AVG CONF</div>
                        <div className="text-base font-black font-mono text-blue-400">{currentAI.avgConfidence || 0}%</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                        <div className="text-xs font-mono text-slate-500">MODE</div>
                        <div className={`text-xs font-black font-mono ${currentAI.volatilityMode === 'AGGRESSIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {currentAI.volatilityMode || 'AGGR'}
                        </div>
                    </div>
                </div>

                {/* UP/DOWN Bias */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-emerald-500">▲ UP {currentAI.upBias}%</span>
                        <span className="text-xs font-mono text-red-500">{currentAI.downBias}% DOWN ▼</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${currentAI.upBias}%` }} />
                        <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${currentAI.downBias}%` }} />
                    </div>
                </div>

                {/* Confidence threshold note */}
                <div className="text-center text-xs font-mono text-slate-600">
                    Min confidence: <span className="text-amber-400">{currentAI.confidenceThreshold}%</span>
                    {currentAI.confidenceThreshold > 55 && <span className="text-amber-400"> · STRICT MODE</span>}
                </div>
            </div>
        </div>
    );
}
