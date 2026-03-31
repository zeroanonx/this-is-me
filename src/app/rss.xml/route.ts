import { getAllPosts } from "@/app/utils/modules/generateRoutes";
import { MATE_TITLE } from "@/app/constants";
import fs from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://zeroanon.com";
const postsDirectory = join(process.cwd(), "/src/page");
const EXCLUDE_DIRS = ["friends"];

const escapeXml = (str: string) =>
  str.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c]!
  );

export async function GET() {
  const dirs = fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter(
      (dirent) => dirent.isDirectory() && !EXCLUDE_DIRS.includes(dirent.name)
    )
    .map((dirent) => dirent.name);

  const allPosts = dirs.flatMap((dir) => getAllPosts(dir));

  allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));

  const rssItems = allPosts
    .slice(0, 20)
    .map((post) => {
      const postUrl = `${SITE_URL}/${post.slug.replace(/\/index$/, "")}`;
      const pubDate = new Date(post.date).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.content?.slice(0, 500) || ""}]]></description>
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${MATE_TITLE}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>博客订阅</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
