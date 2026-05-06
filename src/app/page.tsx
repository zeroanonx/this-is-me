import type { Metadata } from "next";

import HomePage from "@/app/components/layout/HomePage";

export const metadata: Metadata = {
  title: "ZeroAnon | 个人网站",
  description:
    "ZeroAnon 的个人网站，记录项目、文章、技能、灵感收藏与个人随笔。",
  alternates: {
    canonical: "/",
  },
};

export default function Index() {
  return <HomePage />;
}
