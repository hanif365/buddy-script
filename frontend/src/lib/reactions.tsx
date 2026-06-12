import { ReactionType } from "@/types";

export type ReactionDef = {
  key: ReactionType;
  label: string;
  color: string;
  Emoji: (props: { size?: number; className?: string }) => React.JSX.Element;
};

const Like = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
    <circle cx="18" cy="18" r="18" fill="#1890FF" />
    <g transform="translate(6 6)">
      <path
        fill="#fff"
        d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
      />
    </g>
  </svg>
);

const Love = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
    <circle cx="18" cy="18" r="18" fill="#F3425F" />
    <g transform="translate(6 6)">
      <path
        fill="#fff"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </g>
  </svg>
);

const Care = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
    <circle cx="18" cy="18" r="18" fill="#FFCC4D" />
    <ellipse cx="11.5" cy="13.5" rx="2" ry="2.6" fill="#664500" />
    <ellipse cx="24.5" cy="13.5" rx="2" ry="2.6" fill="#664500" />
    <path
      d="M10 19c2.4 3 11.6 3 16 0"
      stroke="#664500"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      fill="#F3425F"
      transform="translate(12 19.5) scale(0.5)"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </svg>
);

const Haha = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 19 19" className={className}>
    <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
    <path
      fill="#664500"
      d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
    />
    <path
      fill="#fff"
      d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
    />
    <path
      fill="#664500"
      d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
    />
  </svg>
);

const Wow = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
    <circle cx="18" cy="18" r="18" fill="#FFCC4D" />
    <path
      d="M8 11.5c1.4-1.8 3.6-2 5-1"
      stroke="#664500"
      strokeWidth="1.3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M28 11.5c-1.4-1.8-3.6-2-5-1"
      stroke="#664500"
      strokeWidth="1.3"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="12" cy="16.5" rx="2.4" ry="3.2" fill="#664500" />
    <ellipse cx="24" cy="16.5" rx="2.4" ry="3.2" fill="#664500" />
    <ellipse cx="18" cy="25" rx="3.6" ry="4.8" fill="#664500" />
  </svg>
);

const Sad = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
    <circle cx="18" cy="18" r="18" fill="#FFCC4D" />
    <path
      d="M10.5 11c1.6.4 3.1 1.3 3.8 2.7"
      stroke="#664500"
      strokeWidth="1.3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M25.5 11c-1.6.4-3.1 1.3-3.8 2.7"
      stroke="#664500"
      strokeWidth="1.3"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="12.5" cy="17.5" rx="2" ry="2.5" fill="#664500" />
    <ellipse cx="23.5" cy="17.5" rx="2" ry="2.5" fill="#664500" />
    <path
      d="M12 28c1.6-3.4 10.4-3.4 12 0"
      stroke="#664500"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      fill="#5DADEC"
      d="M11 19.5c0 1.8-1.6 3.2-1.6 5 0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6c0-1.8-1.6-3.2-1.6-5z"
    />
  </svg>
);

const Angry = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" className={className}>
    <circle cx="18" cy="18" r="18" fill="#E9612C" />
    <path
      d="M8 14.5l7 2.6"
      stroke="#3B0D05"
      strokeWidth="1.7"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M28 14.5l-7 2.6"
      stroke="#3B0D05"
      strokeWidth="1.7"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="12.5" cy="20" rx="2.1" ry="2.4" fill="#3B0D05" />
    <ellipse cx="23.5" cy="20" rx="2.1" ry="2.4" fill="#3B0D05" />
    <path
      d="M11.5 28c2-3 11-3 13 0"
      stroke="#3B0D05"
      strokeWidth="1.7"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const REACTIONS: ReactionDef[] = [
  { key: "like", label: "Like", color: "#1890FF", Emoji: Like },
  { key: "love", label: "Love", color: "#F3425F", Emoji: Love },
  { key: "care", label: "Care", color: "#F7B125", Emoji: Care },
  { key: "haha", label: "Haha", color: "#F7B125", Emoji: Haha },
  { key: "wow", label: "Wow", color: "#F7B125", Emoji: Wow },
  { key: "sad", label: "Sad", color: "#F7B125", Emoji: Sad },
  { key: "angry", label: "Angry", color: "#E9612C", Emoji: Angry },
];

export const reactionMap: Record<ReactionType, ReactionDef> = REACTIONS.reduce(
  (acc, r) => ({ ...acc, [r.key]: r }),
  {} as Record<ReactionType, ReactionDef>
);
