import { ChatMessage } from "@/app/server/schema";

const CLOUDFLARE_AI_MODEL = "@cf/meta/llama-3-8b-instruct";

/**
 * @function 读取必须存在的环境变量，并在缺失时给出明确错误。
 */
function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function streamFromCloudflare(messages: ChatMessage[]) {
  const accountId = getRequiredEnv("CF_ACCOUNT_ID");
  const apiToken = getRequiredEnv("CF_API_TOKEN");

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_AI_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        stream: true,
      }),
    }
  );

  if (!res.ok || !res.body) {
    const text = await res.text();
    throw new Error(`Cloudflare AI error (${res.status}): ${text}`);
  }

  return res.body;
}
