import { getAllPosts, getPostBySlug } from "@/app/utils/modules/generateRoutes";
import { join } from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MATE_TITLE } from "@/app/constants";

/**
 * @type 路由参数类型定义，约定 `[...slug]` 为多段路径（支持子目录）
 */
export type Params = {
  params: Promise<{
    slug?: string[] | string;
  }>;
};

/**
 * @type 生成页面元数据类型定义
 */
type GeneratePageOption = {
  dirName: string; // 文章目录名称，如 "blog"、"others"、"myself"
};

/**
 * @function 构建每个页面的元数据
 */
export const useGeneratePage = (option: GeneratePageOption) => {
  const { dirName } = option;

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

    const title = `${post.title} | ${MATE_TITLE}`;

    return {
      title,
      openGraph: {
        title,
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
