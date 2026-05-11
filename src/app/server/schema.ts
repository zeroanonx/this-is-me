import { z } from "zod";

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
});

export const ChatRequestSchema = z.object({
  sessionId: z.string().min(1).optional(),
  messages: z.array(ChatMessageSchema).min(1),
  stream: z.boolean().optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
