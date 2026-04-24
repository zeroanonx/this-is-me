import { GeneratePageOption, Post } from "@/app/types";
import { getAllPosts } from "@/app/utils/modules/generateRoutes";
import dayjs from "dayjs";

/**
 * @function 将文章按年份分组
 */
export const useGetBlogListByYear = (option: GeneratePageOption) => {
  const { dirName } = option;

  // 获取所有文章
  const posts = getAllPosts(dirName);

  /**
   * @function 按 type 分组
   */
  const groupedPosts = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const type = post.type;
    (acc[type] ??= []).push(post);
    return acc;
  }, {});

  /**
   * @function 按【年份】分组
   */
  const list = Object.entries(groupedPosts).map(([type, posts]) => {
    // 年份字典
    const byYear = posts.reduce<Record<string, Post[]>>((acc, post) => {
      const year = dayjs(post.date).format("YYYY");
      (acc[year] ??= []).push({
        ...post,
      });
      return acc;
    }, {});

    // 按年份倒序排列
    const yearList = Object.entries(byYear)
      .sort(([a], [b]) => b.localeCompare(a)) // 2023 > 2022
      .map(([year, yearPosts]) => ({ year, posts: yearPosts }));

    return { type, list: yearList };
  });

  return {
    list,
  };
};
