import { PlayerColor } from '@shared/types/blokus';

export const THEME = {
  layout: {
    bg: 'bg-[#030712] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]',
    panel: 'bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-indigo-950/20',
    panelInner: 'bg-slate-950/60 border border-slate-800/60',
  },
  players: {
    BLUE: {
      label: 'Azul',
      bg: 'bg-blue-600',
      border: 'border-blue-400',
      glow: 'shadow-[0_0_12px_rgba(37,99,235,0.6)]',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      cell: 'bg-blue-600 border-blue-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]',
    },
    YELLOW: {
      label: 'Amarillo',
      bg: 'bg-amber-400',
      border: 'border-amber-200',
      glow: 'shadow-[0_0_12px_rgba(251,191,36,0.6)]',
      badge: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
      cell: 'bg-amber-400 border-amber-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]',
    },
    RED: {
      label: 'Rojo',
      bg: 'bg-red-600',
      border: 'border-red-400',
      glow: 'shadow-[0_0_12px_rgba(220,38,38,0.6)]',
      badge: 'bg-red-500/10 text-red-400 border-red-500/30',
      cell: 'bg-red-600 border-red-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]',
    },
    GREEN: {
      label: 'Verde',
      bg: 'bg-emerald-500',
      border: 'border-emerald-300',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      cell: 'bg-emerald-500 border-emerald-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]',
    },
  },
};