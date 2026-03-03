'use client';
import { useState } from 'react';
import type { DualGenerations, DualAIState } from '@/lib/types';

interface Props { generations: DualGenerations; ai: DualAIState; }

export default function GenerationHistory({ generations, ai }: Props) {
    const [mode, setMode] = useState<'live' | 'snap'>('live');

    const currentAI = ai[mode];
    const currentGenerations = generations[mode];

    const current = {
        id: currentAI.generation, status: 'ACTIVE' as const,
        startTimeIST: '', endTimeIST: null,
        totalPredictions: currentAI.totalPredictions,
        wins: currentAI.wins, losses: currentAI.losses, accuracy: currentAI.accuracy,
        longestWinStreak: currentAI.longestWinStreak, longestLossStreak: currentAI.longestLossStreak,
        survivalMinutes: 0,
    };
    const all = [...currentGenerations, current].reverse(); // newest first

    return (
        <div className="glass rounded-xl border border-arena-border overflow-hidden flex flex-col">
            {/* Mode Toggle Header */}
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

            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-arena-border">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
                <span className="text-xs font-mono font-bold tracking-widest text-slate-400">GENERATION HISTORY · {mode.toUpperCase()}</span>
                <span className="text-xs font-mono text-slate-600 ml-auto">{all.length} total</span>
            </div>
            <div className="overflow-y-auto flex-1" style={{ maxHeight: '260px' }}>
                {all.map((gen, idx) => {
                    const active = gen.status === 'ACTIVE';
                    const accColor = gen.accuracy >= 70 ? '#10b981' : gen.accuracy >= 65 ? '#f59e0b' : '#ef4444';
                    return (
                        <div key={gen.id}
                            className="px-4 py-3 border-b border-arena-border/50 transition-colors"
                            style={{ background: active ? 'rgba(139,92,246,0.06)' : 'transparent' }}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black font-mono"
                                        style={{ color: active ? '#a78bfa' : '#64748b' }}>
                                        GEN {gen.id}
                                    </span>
                                    {active ? (
                                        <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30 animate-pulse">
                                            ACTIVE
                                        </span>
                                    ) : (
                                        <span className="text-xs px-1.5 py-0.5 rounded font-mono text-slate-600 bg-slate-800/40">
                                            DEAD
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-black font-mono" style={{ color: accColor }}>
                                    {gen.accuracy}%
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                                <div className="text-center">
                                    <div className="text-slate-600 text-xs">PREDS</div>
                                    <div className="text-slate-300 font-bold">{gen.totalPredictions}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-600 text-xs">WIN</div>
                                    <div className="text-emerald-400 font-bold">{gen.wins}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-600 text-xs">LOSS</div>
                                    <div className="text-red-400 font-bold">{gen.losses}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-600 text-xs">STREAK</div>
                                    <div className="text-amber-400 font-bold">{gen.longestWinStreak}W</div>
                                </div>
                            </div>
                            {!active && gen.survivalMinutes > 0 && (
                                <div className="text-xs font-mono text-slate-700 mt-1">
                                    Survived {gen.survivalMinutes}m · ended {gen.endTimeIST?.split(' ')[1]?.slice(0, 5) || '—'}
                                </div>
                            )}
                        </div>
                    );
                })}
                {all.length === 0 && (
                    <div className="text-center py-6 text-slate-600 font-mono text-xs">No generation data yet</div>
                )}
            </div>
        </div>
    );
}
