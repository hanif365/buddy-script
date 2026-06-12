import { z } from "zod";
import { createCommentSchema } from "./comment.validator";

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
