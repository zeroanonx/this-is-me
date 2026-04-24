import type { Metadata } from "next";

import BlogContainer from "@/app/components/layout/BlogContainer";
import Container from "@/app/components/layout/Container";
import PostHeader from "@/app/components/ui/PostHeader";
import { useGetBlogListByYear } from "../hooks/modules/useGetBlogListByYear";

export const metadata: Metadata = {
  title: "Blog | ZeroAnon",
  description:
    "ZeroAnon 的博客文章归档，记录开发实践、设计想法和持续生长中的经验。",
  alternates: {
    canonical: "/blog",
  },
};

//  强制在 build 时生成 HTML
export const dynamic = "force-static";

// 不允许运行时再生成新路径
export const dynamicParams = false;

const dirName = "blog";

export default function BlogPage() {
  const { list } = useGetBlogListByYear({ dirName });

  return (
    <Container size="default">
      <main className="prose mx-auto">
        <PostHeader
          eyebrow="Archive"
          title="Blog"
          desc="记录一些开发、设计和正在持续生长的想法。"
          font="lh"
          color="--accent-primary"
        />
        <BlogContainer posts={list} />
      </main>
    </Container>
  );
}
