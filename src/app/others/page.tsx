import type { Metadata } from "next";

import BlogContainer from "@/app/components/layout/BlogContainer";
import Container from "@/app/components/layout/Container";
import { useGetBlogListByYear } from "../hooks/modules/useGetBlogListByYear";

export const metadata: Metadata = {
  title: "Others | ZeroAnon",
  description:
    "ZeroAnon 的补充页面集合，包含工具说明、隐私政策、联系方式与其他杂项内容。",
  alternates: {
    canonical: "/others",
  },
};

//  强制在 build 时生成 HTML
export const dynamic = "force-static";

// 不允许运行时再生成新路径
export const dynamicParams = false;

const dirName = "others";

export default function OthersPage() {
  const { list } = useGetBlogListByYear({ dirName });

  return (
    <Container size="default">
      <main className="prose mx-auto">
        <BlogContainer posts={list} />
      </main>
    </Container>
  );
}
