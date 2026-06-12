"use client";

import { REACTIONS } from "@/lib/reactions";
import { ReactionType } from "@/types";

export default function ReactionPicker({
  onPick,
  onMouseEnter,
  onMouseLeave,
}: {
  onPick: (reaction: ReactionType) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute bottom-full left-2 z-50 mb-2 flex animate-[reactionPop_.18s_ease-out] items-center gap-1 rounded-full bg-surface px-2 py-1.5 shadow-[rgb(149_157_165_/_35%)_0px_6px_24px]"
    >
      {REACTIONS.map((r, i) => (
        <button
          key={r.key}
          type="button"
          onClick={() => onPick(r.key)}
          aria-label={r.label}
          style={{ animation: `reactionRise .3s ease ${i * 0.04}s both` }}
          className="group relative flex cursor-pointer items-end transition-transform duration-150 hover:-translate-y-2 hover:scale-125"
        >
          <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#333333] px-2 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            {r.label}
          </span>
          <r.Emoji size={38} />
        </button>
      ))}
    </div>
  );
}
