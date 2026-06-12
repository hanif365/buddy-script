import { z } from "zod";

export const REACTIONS = [
  "like",
  "love",
  "care",
  "haha",
  "wow",
  "sad",
  "angry",
] as const;

export type ReactionType = (typeof REACTIONS)[number];

export const reactionSchema = z.object({
  reaction: z.enum(REACTIONS).optional().default("like"),
});
