import type { Metadata } from "next";

import Container from "@/app/components/layout/Container";
import ZeroLink from "@/app/components/ui/ZeroLink";
import PageBackLink from "@/app/components/layout/PageBackLink";

export const metadata: Metadata = {
  title: "Uses | ZeroAnon",
  description: "ZeroAnon 当前正在使用的设备、软件与工作环境。",
  alternates: {
    canonical: "/myself/use-setting",
  },
};

type LinkItem = {
  readonly label: string;
  readonly href: string;
};

type SpecItem = {
  readonly label: string;
  readonly variant: "spec";
};

type TextPart = string | LinkItem | SpecItem;

type UsesItem = {
  readonly content: readonly TextPart[];
  readonly children?: readonly UsesItem[];
};

type UsesSection = {
  readonly title: string;
  readonly accent: string;
  readonly items: readonly UsesItem[];
};

const link = (label: string, href: string): LinkItem => ({ label, href });
const spec = (label: string): SpecItem => ({ label, variant: "spec" });

const USES_SECTIONS: readonly UsesSection[] = [
  {
    title: "Editor",
    accent: "--accent-primary",
    items: [
      {
        content: [
          "我的主力编辑器是 ",
          link("VS Code", "https://code.visualstudio.com/"),
          "，偏简约一点，用来完成大部分日常开发。",
        ],
      },
      {
        content: [
          link("Cursor", "https://cursor.com/"),
          " 现在更多是辅助使用，主要是不太喜欢它更新太快带来的不确定感。",
        ],
      },
      {
        content: [
          "编辑器插件里比较常用的是 ",
          link(
            "z-code-tools",
            "https://marketplace.visualstudio.com/items?itemName=ZeroAnon.z-code-tools"
          ),
          " -> ",
          link("配置", "https://github.com/zeroanonx/z-vscode-setting"),
        ],
      },
    ],
  },
  {
    title: "Terminal",
    accent: "--accent-pink",
    items: [
      {
        content: ["常用终端环境是 ", spec("zsh"), "。"],
      },
      {
        content: [
          "终端美化使用 ",
          link("Oh My Posh", "https://ohmyposh.dev/"),
          "，让提示信息更清楚，但整体还是保持简洁。",
        ],
      },
    ],
  },
  {
    title: "Desktop Apps",
    accent: "--accent-sky",
    items: [
      {
        content: [
          link("Chrome", "https://www.google.com/chrome/"),
          " 是我的主力浏览器，用于开发、调试和日常浏览。",
        ],
      },
      {
        content: [
          "浏览器插件里常用的是 ",
          link(
            "HorizonHop",
            "https://chromewebstore.google.com/detail/horizon-hop/hhflcijdccomhfgeipdbghjbenbbljaa?hl=zh-CN&utm_source=ext_sidebar"
          ),
          "。",
        ],
      },
      {
        content: [
          "听歌软件是 ",
          link("网易云音乐", "https://music.163.com/"),
          "，账号是 ",
          spec("LinHan_Song"),
          "。",
        ],
      },
      {
        content: ["音乐是我永恒的伴侣"],
      },
    ],
  },
  {
    title: "Development",
    accent: "--accent-warm",
    items: [
      {
        content: [
          "包管理目前偏向 ",
          link("pnpm", "https://pnpm.io/"),
          "，速度、磁盘占用和 workspace 体验都更舒服。",
        ],
      },
      {
        content: [
          "现在常用的 AI 工具是 ",
          link("Codex", "https://openai.com/codex/"),
          " 和 CLI 类型的 ",
          link("opencode", "https://opencode.ai/"),
          "。",
        ],
      },
      {
        content: [
          "版本管理使用 ",
          link("Git", "https://git-scm.com/"),
          "，远端以 ",
          link("GitHub", "https://github.com/"),
          " 为主。",
        ],
      },
    ],
  },
  {
    title: "Desk Setup",
    accent: "--accent-coral",
    items: [
      {
        content: ["Workstation"],
        children: [
          {
            content: ["名称：", spec("MacBook Air")],
          },
          {
            content: ["规格："],
            children: [
              {
                content: ["型号标识：", spec("Mac15,12")],
              },
              {
                content: [
                  "芯片：",
                  spec("Apple M3"),
                  "，",
                  spec("8 核 CPU"),
                  "（",
                  spec("4 个性能核心"),
                  " + ",
                  spec("4 个能效核心"),
                  "）。",
                ],
              },
              {
                content: [
                  "GPU：",
                  spec("Apple M3 内建 10 核图形处理器"),
                  "，支持 ",
                  spec("Metal"),
                  "。",
                ],
              },
              {
                content: ["内存：", spec("16GB")],
              },
              {
                content: ["系统版本：", spec("macOS 26.3.1")],
              },
              {
                content: ["根卷容量：", spec("约 460Gi")],
              },
              {
                content: ["可用空间：", spec("约 150Gi")],
              },
            ],
          },
          {
            content: ["使用偏好：", "稳定、安静、耐用，不要频繁打断专注。"],
          },
        ],
      },
      {
        content: ["Monitor"],
        children: [
          {
            content: ["名称：", spec("小米显示器")],
          },
        ],
      },
      {
        content: ["Sound"],
        children: [
          {
            content: ["名称：", spec("暂无固定耳机设备")],
          },
        ],
      },
    ],
  },
  {
    title: "Keyboards",
    accent: "--accent-lilac",
    items: [
      {
        content: ["Keyboard"],
        children: [
          {
            content: ["名称：", spec("前行者 X87 侧刻机械键盘")],
          },
          {
            content: ["规格："],
            children: [
              {
                content: ["配色：", spec("黑莓")],
              },
              {
                content: ["轴体：", spec("北极拿铁轴")],
              },
            ],
          },
          {
            content: [
              "使用偏好：",
              "相比复杂灯效，我更在意输入手感、稳定性和长时间敲字的舒适度。",
            ],
          },
        ],
      },
    ],
  },
] as const;

const InlineContent = ({
  parts,
  accent,
}: {
  parts: readonly TextPart[];
  accent: string;
}) => {
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        if ("variant" in part) {
          return (
            <ZeroLink key={`${part.label}-${index}`} theme={accent}>
              {part.label}
            </ZeroLink>
          );
        }

        return (
          <ZeroLink
            key={`${part.href}-${index}`}
            href={part.href}
            blank
            theme={accent}
          >
            {part.label}
          </ZeroLink>
        );
      })}
    </>
  );
};

const UsesList = ({
  items,
  nested = false,
  accent,
}: {
  items: readonly UsesItem[];
  nested?: boolean;
  accent: string;
}) => {
  return (
    <ul
      className={
        nested
          ? "mt-2 space-y-1.5 pl-5 text-[14px] leading-7"
          : "mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-7"
      }
    >
      {items.map((item, index) => (
        <li key={index} className={nested ? "list-none" : ""}>
          <InlineContent parts={item.content} accent={accent} />
          {item.children ? (
            <UsesList items={item.children} nested accent={accent} />
          ) : null}
        </li>
      ))}
    </ul>
  );
};

const UsesSectionBlock = ({ section }: { section: UsesSection }) => {
  const sectionNumber = String(
    USES_SECTIONS.findIndex((item) => item.title === section.title) + 1
  ).padStart(2, "0");

  return (
    <section className="relative border-t border-black/8 pt-8 dark:border-white/10">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-[0.22em] opacity-45">
          {sectionNumber}
        </span>
        <h2 className="font-serif text-[20px] font-medium italic tracking-[-0.04em] sm:text-[28px]">
          {section.title}
        </h2>
      </div>
      <UsesList items={section.items} accent={section.accent} />
    </section>
  );
};

const UseSettingPage = () => {
  return (
    <Container size="default">
      <main className="relative z-10 py-10 sm:py-14">
        <article className="mx-auto max-w-[68ch] px-1 py-2 sm:px-0">
          <header className="mb-12">
            <PageBackLink />
            <h1 className=" sm:text-3xl! text-2xl!  font-semibold leading-tight tracking-[-0.04em]">
              Here are the tools I use to build things
            </h1>
            <p className="mt-5 text-[15px] leading-8 font-[lh]">
              这是一份我当前正在使用的设备、软件与工作环境清单，记录那些真正会长期陪伴我写代码和生活的东西。
            </p>
          </header>

          <div className="space-y-10">
            {USES_SECTIONS.map((section) => (
              <UsesSectionBlock key={section.title} section={section} />
            ))}
          </div>

          <footer className="mt-12 border-t border-black/8 pt-8 text-[14px] leading-7 dark:border-white/10">
            <p>
              好的工具应该像空气一样，不需要时时意识到它的存在。它只是在你想表达、想创作、想完成某件事的时候，安静地站在旁边。
            </p>
          </footer>
        </article>
      </main>
    </Container>
  );
};

export default UseSettingPage;
