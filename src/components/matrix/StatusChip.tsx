import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { AuditRecord } from '../../types';

export type StatusTone = 'ok' | 'wip' | 'warn' | 'none';

/** Single source of truth: ticket status -> one of 3 semantic tones. */
export function toneOf(a: AuditRecord): StatusTone {
  const hasBlocker = !!a.blockers && !/none|n\/a|^\s*-?\s*$/i.test(a.blockers);
  if (a.ticketStatus === 'Done') return 'ok';
  if (hasBlocker) return 'warn';
  if (a.ticketStatus === 'In Progress' || a.ticketStatus === 'Review') return 'wip';
  return 'warn';
}

export const TONE_DOT: Record<StatusTone, string> = {
  ok: 'bg-emerald-400',
  wip: 'bg-indigo-400',
  warn: 'bg-amber-400',
  none: 'bg-slate-700',
};

export const TONE_LABEL: Record<StatusTone, string> = {
  ok: 'Done',
  wip: 'In progress',
  warn: 'Blocked / pending',
  none: 'No submission',
};

export function initials(name: string): string {
  const parts = name.replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface Props {
  audits: AuditRecord[];
  compact?: boolean;
  onSelect: (audits: AuditRecord[], current: AuditRecord) => void;
}

/** One compact chip per cell: status dot + overlapping author avatars. */
export const StatusChip: React.FC<Props> = ({ audits, compact, onSelect }) => {
  const tones = audits.map(toneOf);
  // worst-case wins for the cell dot: warn > wip > ok
  const cellTone: StatusTone = tones.includes('warn')
    ? 'warn'
    : tones.includes('wip')
    ? 'wip'
    : 'ok';
  const first = audits[0];

  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={() => onSelect(audits, first)}
          className="w-full min-w-0 overflow-hidden flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/70 hover:border-slate-700 px-2 py-1.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${TONE_DOT[cellTone]}`} />
          <span className="flex -space-x-1.5 shrink-0">
            {audits.slice(0, 3).map((a, i) => (
              <span
                key={a.id || i}
                className="w-5 h-5 rounded-full bg-slate-700 border border-slate-900 text-[9px] font-semibold text-slate-100 flex items-center justify-center"
              >
                {initials(a.studentName)}
              </span>
            ))}
            {audits.length > 3 && (
              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-900 text-[9px] text-slate-300 flex items-center justify-center">
                +{audits.length - 3}
              </span>
            )}
          </span>
          {!compact && (
            <span className="min-w-0 flex-1 text-[11px] text-slate-300 truncate">
              {first.assignedFeature || first.summary || 'Report'}
            </span>
          )}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="z-[60] max-w-xs rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 shadow-xl"
        >
          <div className="space-y-2">
            {audits.map((a, i) => {
              const t = toneOf(a);
              return (
                <div key={a.id || i} className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <span className={`w-1.5 h-1.5 rounded-full ${TONE_DOT[t]}`} />
                    {a.studentName}
                    <span className="font-normal text-slate-400">· {a.ticketStatus}</span>
                  </div>
                  <div className="text-slate-300 line-clamp-2">
                    {a.assignedFeature || a.summary}
                  </div>
                </div>
              );
            })}
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              Click to open full report
            </div>
          </div>
          <Tooltip.Arrow className="fill-slate-700" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
