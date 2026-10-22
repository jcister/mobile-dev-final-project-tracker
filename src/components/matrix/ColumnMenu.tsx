import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Columns3 } from 'lucide-react';

export interface ColumnDef {
  key: string;
  label: string;
  group?: string;
}

interface Props {
  columns: ColumnDef[];
  hidden: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
}

export const ColumnMenu: React.FC<Props> = ({ columns, hidden, onChange }) => {
  const toggle = (key: string) => onChange({ ...hidden, [key]: !hidden[key] });
  const setGroup = (group: string, hide: boolean) => {
    const next = { ...hidden };
    columns.filter((c) => c.group === group).forEach((c) => (next[c.key] = hide));
    onChange(next);
  };
  const hiddenCount = columns.filter((c) => hidden[c.key]).length;

  const Row = ({ c }: { c: ColumnDef }) => (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-200">
      <Checkbox.Root
        checked={!hidden[c.key]}
        onCheckedChange={() => toggle(c.key)}
        className="w-4 h-4 rounded border border-slate-600 bg-slate-900 flex items-center justify-center data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
      >
        <Checkbox.Indicator>
          <Check className="w-3 h-3 text-white" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {c.label}
    </label>
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          <Columns3 className="w-3.5 h-3.5 text-indigo-400" />
          Columns
          {hiddenCount > 0 && (
            <span className="ml-0.5 px-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
              {hiddenCount} hidden
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[60] w-64 rounded-xl border border-slate-700 bg-slate-950 p-3 shadow-2xl"
        >
          <div className="space-y-2">
            {columns.filter((c) => !c.group).map((c) => (
              <Row key={c.key} c={c} />
            ))}
            {['Weeks 1–4', 'Weeks 5–8'].map((g) => (
              <div key={g} className="border-t border-slate-800 pt-2">
                <div className="flex items-center justify-between px-2 pb-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    {g}
                  </span>
                  <span className="text-[10px] text-indigo-400 space-x-2">
                    <button type="button" onClick={() => setGroup(g, false)} className="hover:underline">
                      show
                    </button>
                    <button type="button" onClick={() => setGroup(g, true)} className="hover:underline">
                      hide
                    </button>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-1">
                  {columns.filter((c) => c.group === g).map((c) => (
                    <Row key={c.key} c={c} />
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({})}
              className="w-full mt-1 text-[11px] text-slate-400 hover:text-white py-1"
            >
              Reset to show all
            </button>
          </div>
          <Popover.Arrow className="fill-slate-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
