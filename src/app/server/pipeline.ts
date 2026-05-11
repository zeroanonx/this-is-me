import { buildGirlSystemPrompt } from "./prompt";
import { ChatMessage } from "./schema";
import { streamFromCloudflare } from "./providers/cloudflare";
import {
  formatSearchResultsAnswer,
  getSearchResults,
  searchIndex,
} from "./searchBlog";

function streamText(text: string) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ response: text })}\n\n`)
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

export async function runChatPipeline(
  messages: ChatMessage[],
  options?: { baseUrl?: string }
) {
  const userLastMessage = messages[messages.length - 1]?.content ?? "";
  const searchResults = await searchIndex(userLastMessage, 3, options?.baseUrl);

  if (searchResults.length > 0) {
    return streamText(formatSearchResultsAnswer(searchResults, options?.baseUrl));
  }

  const contextText = await getSearchResults(messages, options?.baseUrl);
  const finalMessages = [
    { role: "system", content: buildGirlSystemPrompt(contextText) },
    ...messages,
  ] as ChatMessage[];

  return streamFromCloudflare(finalMessages);
}
