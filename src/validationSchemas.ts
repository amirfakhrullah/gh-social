import { z } from "zod";

export const idSchema = z.object({
  id: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.number(),
  perPage: z.number(),
});

export const createPostSchema = z.object({
  content: z.string().min(1).max(100),
  repoShared: z.string().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(100),
  postId: z.string().min(1),
});

export const likeActionSchema = z.object({
  postId: z.string().min(1),
  action: z.enum(["like", "unlike"]),
});

export const githubRepoSchema = z.object({
  repoName: z.string().min(1),
});

// Types
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
