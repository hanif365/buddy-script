import { z } from "zod";
import { createPostSchema } from "./post.validator";

export type CreatePostInput = z.infer<typeof createPostSchema>;
