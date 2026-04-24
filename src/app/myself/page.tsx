import { getAllPosts } from "@/app/utils/modules/generateRoutes";
import { Post } from "../types";
import BlogContainer from "@/app/components/layout/BlogContainer";
import dayjs from "dayjs";
import Container from "@/app/components/layout/Container";
import PostHeader from "@/app/components/ui/PostHeader";
import { useGetBlogListByYear } from "../hooks/modules/useGetBlogListByYear";

//  强制在 build 时生成 HTML
export const dynamic = "force-static";

// 不允许运行时再生成新路径
export const dynamicParams = false;

const dirName = "myself";

export default function MyselfPage() {
  const { list } = useGetBlogListByYear({ dirName });

  return (
    <Container size="default">
      <main className="prose mx-auto">
        <PostHeader
          eyebrow="Notebook"
          title="Myself"
          desc="一些我自己的东西..."
          font="lh"
          color="--accent-primary"
        />
        <BlogContainer posts={list} />
      </main>
    </Container>
  );
}
