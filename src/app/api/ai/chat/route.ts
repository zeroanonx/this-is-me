import { NextRequest } from "next/server";
import { runChatPipeline } from "@/app/server/pipeline";
import { checkRateLimit } from "@/app/server/rate-limit";
import { ChatRequestSchema } from "@/app/server/schema";

export const runtime = "nodejs";
const MAX_CONTEXT_MESSAGES = 15;

export async function POST(req: NextRequest) {
  try {
    const body = ChatRequestSchema.parse(await req.json());

    // 限流（可选，防刷）
    const ip = getClientIp(req);
    checkRateLimit(ip);

    // 流式调用当前配置的 AI provider
    const stream = await runChatPipeline(
      body.messages.slice(-MAX_CONTEXT_MESSAGES)
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chat request failed";

    return Response.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * @function 从常见代理头里读取客户端 IP，用于轻量限流。
 */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "anonymous"
  );
}
