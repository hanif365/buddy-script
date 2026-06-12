import { z } from "zod";

export const createPostSchema = z.object({
  text: z.string().trim().optional(),
  visibility: z.enum(["public", "private"]).optional(),
});
