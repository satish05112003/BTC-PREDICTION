'use client';
import type { PredictionLog, AIState } from '@/lib/types';
import { CheckCircle, XCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props { history: PredictionLog[]; ai: AIState; }

export default function PredictionHistory({ history, ai }: Props) {
    const totalW = history.filter(h => h.correct).length;
    const totalL = history.filter(h => !h.correct).length;
    const overallAcc = history.length > 0 ? Math.round((totalW / history.length) * 100) : null;

    // Only show last 15
    const visibleHistory = history.slice(0, 15);

    return (
        <div className="glass rounded-xl border border-arena-border overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-arena-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-xs font-mono font-bold tracking-widest text-slate-400">LOG</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[10px] font-bold"
                    style={{
                        borderColor: overallAcc !== null ? (overallAcc >= 55 ? 'rgba(16,185,129,0.4)' : overallAcc >= 45 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)') : '#1a3050',
                        color: overallAcc !== null ? (overallAcc >= 55 ? '#10b981' : overallAcc >= 45 ? '#f59e0b' : '#ef4444') : '#64748b',
                    }}>
                    TOTAL: {overallAcc !== null ? `${overallAcc}%` : '—'}
                </div>
            </div>

            {history.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-500 font-mono text-xs">
                    <div className="text-xl mb-1">⏳</div>
                    <div>Awaiting predictions...</div>
                </div>
            ) : (
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 70px)' }}>
                    <div className="flex flex-col">
                        {visibleHistory.map(entry => (
                            <div key={entry.id} className={`flex items-center justify-between px-3 py-2 border-b border-arena-border/50 transition-colors animate-float-in ${entry.correct ? 'bg-emerald-900/10' : 'bg-red-900/10'}`}>

                                {/* Left: TF + Time */}
                                <div className="flex flex-col gap-0.5 w-16">
                                    <span className="px-1 py-0.5 rounded text-[10px] font-bold text-center w-fit"
                                        style={{
                                            background: entry.tf === '5m' ? 'rgba(139,92,246,0.2)' : entry.tf === '15m' ? 'rgba(59,130,246,0.2)' : entry.tf === '30m' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                                            color: entry.tf === '5m' ? '#8b5cf6' : entry.tf === '15m' ? '#3b82f6' : entry.tf === '30m' ? '#f59e0b' : '#10b981',
                                        }}>
                                        {entry.tf}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Mid: Direction */}
                                <div className="flex flex-col items-center justify-center w-16">
                                    <div className={`flex items-center text-xs font-black ${entry.prediction === 'UP' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {entry.prediction === 'UP' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {entry.prediction}
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">{entry.confidence}%</span>
                                </div>

                                {/* Right: Result */}
                                <div className="flex items-center justify-end gap-2 w-20">
                                    <div className={`text-right text-[11px] font-mono ${entry.priceDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {entry.priceDiff > 0 ? '+' : ''}{entry.priceDiff.toFixed(0)}
                                    </div>
                                    <div className="shrink-0">
                                        {entry.correct ? <CheckCircle size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-3 py-2 border-t border-arena-border bg-slate-900/40 mt-auto flex justify-between items-center">
                <div className="text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">{totalW}W</span>
                    <span className="text-slate-600 px-1">/</span>
                    <span className="text-red-400 font-bold">{totalL}L</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Gen {ai.generation}</div>
            </div>
        </div>
    );
}
