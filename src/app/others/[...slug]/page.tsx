import PostBody from "@/app/components/layout/PostBody";
import MoveTop from "@/app/components/ui/MoveTop";
import Container from "@/app/components/layout/Container";
import { Params, useGeneratePage } from "@/app/hooks/modules/useGeneratePage";
import PageBackLink from "@/app/components/layout/PageBackLink";

// 强制在 build 时生成 HTML
export const dynamic = "force-static";

// 不允许运行时再生成新路径
export const dynamicParams = false;

const dirName = "others";

const { getSlug, generateMetadata, generateStaticParams } = useGeneratePage({
  dirName,
});

// 文章详情页服务端组件
export default async function Post(props: Params) {
  const post = await getSlug(props);

  return (
    <Container size="default">
      <section className="prose mx-auto">
        <PageBackLink />
        <h1 className="sm:text-3xl! text-2xl!">{post.title}</h1>
        <p>
          <span>{post.date}</span>
          <span> • </span>
          <span>{post.duration}</span>
        </p>
        <PostBody post={post} />
        <MoveTop />
      </section>
    </Container>
  );
}

export { generateMetadata, generateStaticParams };
