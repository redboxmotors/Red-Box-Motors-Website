'use client';

import type { ConditionNote, ListingFaqItem } from '@/lib/db/types';
import { inputCls } from './ui';

// Owner-authored listing content editors (2026-07-08): ordered string lists
// (highlights, documentation), label+text pairs (condition & inspection) and
// Q&A pairs (listing FAQ). Add / remove / reorder via up-down controls.

function RowControls({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  const btn =
    'flex h-8 w-8 flex-none items-center justify-center border border-rb-line text-rb-tx-faint transition-colors hover:border-rb-border-2 hover:text-rb-tx disabled:opacity-30 disabled:hover:border-rb-line disabled:hover:text-rb-tx-faint';
  return (
    <div className="flex gap-1">
      <button type="button" aria-label="Move up" className={btn} disabled={index === 0}
        onClick={() => onMove(index, index - 1)}>
        ↑
      </button>
      <button type="button" aria-label="Move down" className={btn} disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}>
        ↓
      </button>
      <button type="button" aria-label="Remove" className={btn} onClick={() => onRemove(index)}>
        ×
      </button>
    </div>
  );
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function StringListEditor({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            className={inputCls}
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
          />
          <RowControls
            index={i}
            count={items.length}
            onMove={(from, to) => onChange(move(items, from, to))}
            onRemove={(idx) => onChange(items.filter((_, j) => j !== idx))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="self-start border border-rb-line px-4 py-2.5 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:border-rb-border-2 hover:text-rb-tx"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export function ConditionListEditor({
  items,
  onChange,
  suggestions,
}: {
  items: ConditionNote[];
  onChange: (items: ConditionNote[]) => void;
  suggestions: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <div className="grid flex-1 gap-1.5 md:grid-cols-[220px_1fr]">
            <input
              className={inputCls}
              value={item.label}
              placeholder="Topic (e.g. PPF status)"
              list="rb-condition-topics"
              onChange={(e) =>
                onChange(items.map((it, j) => (j === i ? { ...it, label: e.target.value } : it)))
              }
            />
            <textarea
              className={`${inputCls} min-h-[42px] resize-y`}
              rows={1}
              value={item.value}
              placeholder="Owner-verified detail — published exactly as written"
              onChange={(e) =>
                onChange(items.map((it, j) => (j === i ? { ...it, value: e.target.value } : it)))
              }
            />
          </div>
          <RowControls
            index={i}
            count={items.length}
            onMove={(from, to) => onChange(move(items, from, to))}
            onRemove={(idx) => onChange(items.filter((_, j) => j !== idx))}
          />
        </div>
      ))}
      <datalist id="rb-condition-topics">
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <button
        type="button"
        onClick={() => onChange([...items, { label: '', value: '' }])}
        className="self-start border border-rb-line px-4 py-2.5 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:border-rb-border-2 hover:text-rb-tx"
      >
        + Add condition item
      </button>
    </div>
  );
}

export function FaqListEditor({
  items,
  onChange,
}: {
  items: ListingFaqItem[];
  onChange: (items: ListingFaqItem[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5 border border-rb-line bg-rb-surface-3 p-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <input
              className={inputCls}
              value={item.q}
              placeholder="Question"
              onChange={(e) =>
                onChange(items.map((it, j) => (j === i ? { ...it, q: e.target.value } : it)))
              }
            />
            <textarea
              className={`${inputCls} min-h-[56px] resize-y`}
              rows={2}
              value={item.a}
              placeholder="Answer"
              onChange={(e) =>
                onChange(items.map((it, j) => (j === i ? { ...it, a: e.target.value } : it)))
              }
            />
          </div>
          <RowControls
            index={i}
            count={items.length}
            onMove={(from, to) => onChange(move(items, from, to))}
            onRemove={(idx) => onChange(items.filter((_, j) => j !== idx))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { q: '', a: '' }])}
        className="self-start border border-rb-line px-4 py-2.5 text-[10px] font-bold uppercase tracking-label text-rb-tx-faint transition-colors hover:border-rb-border-2 hover:text-rb-tx"
      >
        + Add question
      </button>
    </div>
  );
}
