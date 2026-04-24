import type { Metadata } from "next";

import BlogContainer from "@/app/components/layout/BlogContainer";
import Container from "@/app/components/layout/Container";
import PostHeader from "@/app/components/ui/PostHeader";
import { useGetBlogListByYear } from "../hooks/modules/useGetBlogListByYear";

export const metadata: Metadata = {
  title: "Inspiration | ZeroAnon",
  description:
    "ZeroAnon 收集和制作的一些有趣内容，包含动画、CSS 实验与零散灵感。",
  alternates: {
    canonical: "/interesting",
  },
};

//  强制在 build 时生成 HTML
export const dynamic = "force-static";

// 不允许运行时再生成新路径
export const dynamicParams = false;

const dirName = "interesting";

export default function BlogPage() {
  const { list } = useGetBlogListByYear({ dirName });
  return (
    <Container size="default">
      <main className="prose mx-auto">
        <PostHeader
          eyebrow="Collection"
          title="Inspiration"
          desc="下面是陆陆续续收藏的或者开发的有趣的东西，不一定有用，但挺有趣的。"
          font="lh"
          color="--accent-primary"
        />
        <BlogContainer posts={list} />
      </main>
    </Container>
  );
}
