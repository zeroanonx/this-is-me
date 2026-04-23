import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify-icon/react";
import dayjs from "dayjs";
import AIEntry from "@/app/components/ai/AIEntry";
import HomeHero from "@/app/components/layout/HomeHero";
import { FEATURED_SKILLS } from "@/app/constants/modules/home";
import { getAllPosts } from "@/app/utils/modules/generateRoutes";

export const metadata: Metadata = {
  title: "Blog - ZeroAnon",
  description: "ZeroAnon 的个人网站。",
};

interface StatItem {
  label: string;
  value: string;
}

const SURFACE_CARD_CLASS =
  "rounded-3xl border border-white/8 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:p-[18px]";
const SURFACE_SUBCARD_CLASS =
  "mt-5 rounded-[20px] border border-white/8 p-3.5 shadow-[0_18px_70px_rgba(0,0,0,0.16)]";
const SURFACE_BUTTON_CLASS =
  "mt-4 inline-flex items-center gap-2 rounded-full border border-white/8 px-3.5 py-1.5 text-[11px] shadow-[0_18px_70px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/6";

/**
 * @function 格式化首页统计数字，超过一万时用更适合中文阅读的缩写展示。
 */
const formatCount = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}w`;
  }

  return `${value}`;
};

/**
 * @function 从本地文章内容中计算首页统计数据。
 */
const buildStats = (): StatItem[] => {
  const posts = getAllPosts().filter(
    (post) => post.slug !== "index" && !post.slug.endsWith("/index")
  );

  const totalWords = posts.reduce((sum, post) => {
    const cleaned = post.content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/[#>*_~\-]/g, " ")
      .replace(/\s+/g, " ");
    const englishWords = cleaned.match(/[A-Za-z0-9_']+/g) ?? [];
    const chineseChars = cleaned.match(/[\u4e00-\u9fff]/g) ?? [];

    return sum + englishWords.length + chineseChars.length;
  }, 0);

  const firstPost = posts.reduce((earliest, post) => {
    if (!earliest) return post;
    return dayjs(post.date).isBefore(dayjs(earliest.date)) ? post : earliest;
  }, posts[0]);

  const runningDays = firstPost
    ? dayjs().diff(dayjs(firstPost.date), "day")
    : 0;

  return [
    { label: "篇文章", value: `${posts.length}` },
    { label: "字", value: formatCount(totalWords) },
    { label: "天", value: `${runningDays}` },
  ];
};

export default function Index() {
  const stats = buildStats();

  return (
    <>
      <main className="min-h-screen">
        <section className="mx-auto flex w-full max-w-4xl flex-col px-6 pb-16 pt-8 sm:px-8">
          <HomeHero stats={stats} />

          <section className="mt-14 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <article className={SURFACE_CARD_CLASS}>
              <p className="text-xs uppercase tracking-[0.36em]">About</p>
              <div className="mt-3 space-y-2.5 text-[12.5px] leading-6">
                <p>
                  你好，我是{" "}
                  <span className="text-(--accent-mint)">ZeroAnon</span>
                  ，一个狂热的开源爱好者。
                </p>
                <p>
                  我很喜欢把脑海里的想法一点点做出来，这也是我持续写代码的动力来源。
                </p>
                <p>我很喜欢音乐，音乐是我永恒的伴侣。</p>
                <p>我像一条缝里挤出的野草，弯弯曲曲地向上生长。</p>
                <p>
                  这里是我开发和维护的一些
                  <a
                    href="/projects"
                    rel="noopener noreferrer"
                    className="underline decoration-white/20 underline-offset-4 transition"
                  >
                    <span className="text-(--accent-primary)"> 项目 </span>
                  </a>
                  ，如果你愿意，也欢迎来提建议或者一起参与。
                </p>
                <p>
                  目前我在
                  <span className="text-(--accent-primary)"> 杭州 </span>
                  参与一些有意思的项目，也一直在持续打磨自己的能力边界。
                </p>
                <p>
                  我也很喜欢分享知识和经验。这是我的{" "}
                  <a
                    href="/others/use-setting"
                    rel="noopener noreferrer"
                    className="underline decoration-white/20 underline-offset-4 transition"
                  >
                    <span className="text-(--accent-primary)">
                      工作环境清单
                    </span>
                  </a>
                </p>
                <p>
                  如果你也对这些方向感兴趣，我们可以一起喝杯咖啡，或者顺手做点有趣的东西。
                </p>
              </div>

              <div className={SURFACE_SUBCARD_CLASS}>
                <p className="text-xs uppercase tracking-[0.3em]">致</p>
                <p className="mt-2.5 text-[12.5px] leading-6">
                  朋友，不必理会他人过的怎么样，你始终要有一颗属于自己的心和精神世界不受影响。
                </p>
              </div>
            </article>

            <article className={SURFACE_CARD_CLASS}>
              <p className="text-xs uppercase tracking-[0.36em]">Skills</p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {FEATURED_SKILLS.map((skill) => (
                  <a
                    key={skill.label}
                    href={skill.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-[18px] border border-white/8 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-white/14 hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
                  >
                    <div className="overflow-hidden rounded-[14px] border border-white/6">
                      <img
                        alt={skill.label}
                        src={skill.image}
                        className="aspect-[1.08] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <Icon icon={skill.icon} className="text-sm" />
                      <span className="truncate transition">{skill.label}</span>
                    </div>
                  </a>
                ))}
              </div>

              <Link href="/skills" className={SURFACE_BUTTON_CLASS}>
                <span>查看更多技能</span>
                <Icon icon="solar:arrow-right-linear" className="text-sm" />
              </Link>

              <div className={SURFACE_SUBCARD_CLASS}>
                <p className="text-xs uppercase tracking-[0.3em]">当前关注</p>
                <p className="mt-2.5 text-[12.5px] leading-6">
                  我更关注知识分享、开源工具打磨，以及那些看起来克制、用起来顺手的界面体验。
                </p>
              </div>
            </article>
          </section>
        </section>
      </main>
      <AIEntry />
    </>
  );
}
