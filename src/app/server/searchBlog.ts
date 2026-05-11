import { ChatMessage } from "./schema";

export type SearchEntry = {
  id: string;
  title: string;
  content: string;
  url: string;
};

let index: SearchEntry[] | null = null;
const CJK_STOP_CHARS = new Set(
  "的了呢吗吧啊呀么和与及或在是有我你他她它们这那哪什么怎么为何时候多少一个一些关于如果需要可以"
);

// 初始化加载 JSON（Edge-safe，用 fetch）
export async function loadSearchIndex(): Promise<SearchEntry[]> {
  if (index) return index;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!baseUrl) {
    index = [];
    return index;
  }

  const res = await fetch(`${baseUrl}/search-index.json`);

  if (!res.ok) {
    throw new Error("无法加载搜索索引");
  }
  index = await res.json();
  return index!;
}

/**
 * @function 将用户问题拆成适合站内检索的关键词，中文额外生成双字片段。
 */
function tokenizeQuery(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const latinTokens = normalizedQuery.match(/[a-z0-9_-]{2,}/g) ?? [];
  const cjkRuns = normalizedQuery.match(/[\u4e00-\u9fff]+/g) ?? [];
  const cjkTokens = cjkRuns.flatMap((run) => {
    const chars = Array.from(run).filter((char) => !CJK_STOP_CHARS.has(char));
    const bigrams = chars
      .slice(0, -1)
      .map((char, index) => `${char}${chars[index + 1]}`);

    return [...bigrams, ...chars.filter((char) => char.trim())];
  });

  return Array.from(new Set([...latinTokens, ...cjkTokens])).filter(
    (token) => token.length > 0
  );
}

/**
 * @function 计算单篇文章与用户问题的相关度。
 */
function scoreEntry(entry: SearchEntry, tokens: readonly string[]): number {
  const title = entry.title.toLowerCase();
  const content = entry.content.toLowerCase();

  return tokens.reduce((score, token) => {
    const titleScore = title.includes(token) ? 4 : 0;
    const contentScore = content.includes(token) ? 1 : 0;

    return score + titleScore + contentScore;
  }, 0);
}

// 简单检索函数，返回匹配内容
export async function searchIndex(
  query: string,
  topN = 5
): Promise<SearchEntry[]> {
  const idx = await loadSearchIndex();
  const tokens = tokenizeQuery(query);

  if (!tokens.length) {
    return [];
  }

  const results = idx
    .map((entry) => {
      const score = scoreEntry(entry, tokens);
      return { entry, score };
    })
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((r) => r.entry);

  return results;
}

export const getSearchResults = async (messages: ChatMessage[]) => {
  const userLastMessage = messages[messages.length - 1]?.content ?? "";

  if (!userLastMessage.trim()) {
    return "";
  }

  const searchResults = await searchIndex(userLastMessage).catch(() => []);

  let contextText = "";
  if (searchResults.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const links = searchResults
      .map((r, idx) => `${idx + 1}. [${r.title}](${baseUrl}${r.url})`)
      .join("\n");
    contextText =
      [
        "【站内检索结果】",
        "用户的问题命中了站内文章。",
        "回答开头必须先告诉用户：我在站内找到了相关内容。",
        "随后优先给出 1-3 个最相关的 Markdown 链接。",
        "必须原样保留下面的 Markdown 链接格式，方便用户点击跳转：",
        links,
      ].join("\n") + "\n";
  }
  return contextText;
};
