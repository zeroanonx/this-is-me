import { getAllPosts, getPostBySlug } from "@/app/utils/modules/generateRoutes";
import { join } from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MATE_TITLE, MATE_TITLE_IMG, SITE_URL } from "@/app/constants";
import { GeneratePageOption } from "@/app/types";

/**
 * @type 路由参数类型定义，约定 `[...slug]` 为多段路径（支持子目录）
 */
export type Params = {
  params: Promise<{
    slug?: string[] | string;
  }>;
};

/**
 * @function 构建每个页面的元数据
 */
export const useGeneratePage = (option: GeneratePageOption) => {
  const { dirName } = option;

  /**
   * @function 提取适合写入 metadata 的简短摘要，避免把整篇正文塞进 description。
   */
  const buildDescription = (content: string) => {
    const normalized = content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^>\s?/gm, "")
      .replace(/\s+/g, " ")
      .trim();

    if (normalized.length <= 140) {
      return normalized;
    }

    return `${normalized.slice(0, 140).trim()}...`;
  };

  /**
   * @function 获取文章路径
   */
  const getSlug = async (props: Params) => {
    // 通过 `generateStaticParams` 传入的动态路由参数
    const params = await props.params;
    const slug = Array.isArray(params.slug)
      ? params.slug.join("/")
      : params.slug;

    // 根据 slug 从本地 Markdown/MDX 文件中读取文章
    const post = getPostBySlug(join(`${dirName}/`, slug!));

    // 如果找不到对应文章，则返回 404 页面
    if (!post) {
      return notFound();
    }

    return post;
  };

  /**
   * @function 为每篇文章动态生成 `<head>` 中的 SEO 信息
   */
  const generateMetadata = async (props: Params): Promise<Metadata> => {
    const post = await getSlug(props);
    const postPath = `/${post.slug.replace(/\/index$/, "")}`;
    const title = `${post.title} | ${MATE_TITLE}`;
    const description = buildDescription(post.content);
    const url = `${SITE_URL}${postPath}`;

    return {
      title,
      description,
      alternates: {
        canonical: postPath,
      },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        publishedTime: new Date(post.date).toISOString(),
        authors: ["ZeroAnon"],
        images: [MATE_TITLE_IMG],
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: [MATE_TITLE_IMG],
      },
    };
  };

  /**
   * @function  预定义所有可静态生成的 `[...slug]` 路径
   */
  const generateStaticParams = async () => {
    const posts = getAllPosts(dirName);

    return posts.map((post) => ({
      slug: post.slug.replace(new RegExp(`^${dirName}/`), "").split("/"),
    }));
  };

  return {
    getSlug,
    generateMetadata,
    generateStaticParams,
  };
};
