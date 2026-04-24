"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { AnimatePresence, motion } from "motion/react";
import {
  HOME_PROFILE_TAGS,
  HOME_QUOTES,
  SOCIAL_LINKS,
} from "@/app/constants/modules/home";

interface StatItem {
  label: string;
  value: string;
}

interface AccentStyles {
  background: string;
  border: string;
  text: string;
}

interface HomeHeroProps {
  stats: StatItem[];
}

/**
 * @function 根据强调色生成标签和语录共用的样式值。
 */
const getAccentStyles = (accent: string): AccentStyles => {
  return {
    background: `color-mix(in srgb, ${accent} 14%, transparent)`,
    border: `color-mix(in srgb, ${accent} 36%, transparent)`,
    text: `color-mix(in srgb, ${accent} 72%, white)`,
  };
};

/**
 * @function 生成一个随机语录索引，并尽量避免和上一条重复。
 */
const getRandomQuoteIndex = (currentIndex?: number): number => {
  if (HOME_QUOTES.length <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * HOME_QUOTES.length);

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * HOME_QUOTES.length);
  }

  return nextIndex;
};

/**
 * @function 渲染首页首屏信息，并管理语录轮播与交互动效。
 */
const HomeHero: React.FC<HomeHeroProps> = ({ stats }) => {
  const [quoteIndex, setQuoteIndex] = useState<number>(() =>
    getRandomQuoteIndex()
  );

  /**
   * @function 定时切换首页语录，并在组件卸载时清理定时器。
   */
  useEffect(() => {
    if (HOME_QUOTES.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setQuoteIndex((currentIndex) => getRandomQuoteIndex(currentIndex));
    }, 6800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const quote = useMemo(() => HOME_QUOTES[quoteIndex], [quoteIndex]);
  const quoteAccentStyles = getAccentStyles(quote.accent);

  return (
    <>
      <div className="group relative mx-auto h-16 w-16">
        <div
          className="absolute -inset-2.5 rounded-full opacity-0 blur-xl transition duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 18%, transparent) 0%, transparent 72%)",
          }}
        />
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(0,0,0,0.35)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-white/20 group-hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-primary)_12%,rgba(255,255,255,0.04)),0_24px_80px_rgba(0,0,0,0.4)]">
          <img
            alt="LinHan avatar"
            src="/assets/images/me/avatar.jpeg"
            className="h-full w-full rounded-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-2xl flex-col items-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-[clamp(1.05rem,2.65vw,1.8rem)] leading-[1.06] tracking-[-0.05em]">
          <span className="font-light">Hi there, I&apos;m</span>
          <motion.span
            className="rounded-[14px] border px-3 py-1 font-semibold tracking-[-0.03em] backdrop-blur-md"
            style={{
              color: "var(--accent-primary)",
              borderColor:
                "color-mix(in srgb, var(--accent-primary) 28%, rgba(255,255,255,0.08))",
              background:
                "linear-gradient(115deg, color-mix(in srgb, var(--accent-primary) 12%, transparent), rgba(255,255,255,0.03), color-mix(in srgb, var(--accent-primary) 16%, transparent))",
              backgroundSize: "190% 190%",
              boxShadow:
                "0 10px 30px color-mix(in srgb, var(--accent-primary) 10%, transparent), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(255,255,255,0.02)",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ZeroAnon
          </motion.span>
          <span className="text-xl">👋</span>
        </div>

        <p className="mt-3 text-[clamp(0.76rem,1.15vw,0.9rem)] font-light tracking-[-0.03em]">
          前端开发者
          <span className="mx-3 inline-block">→</span>
          认真生活的人
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {HOME_PROFILE_TAGS.map((tag) => {
            const accentStyles = getAccentStyles(tag.accent);

            return (
              <span
                key={tag.label}
                className="inline-flex cursor-default select-none items-center rounded-lg border px-2 py-0.5 text-[9px] tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 active:translate-y-0.5 sm:text-[10px]"
                style={{
                  backgroundColor: accentStyles.background,
                  borderColor: accentStyles.border,
                  boxShadow: `0 8px 20px color-mix(in srgb, ${tag.accent} 7%, transparent), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  color: accentStyles.text,
                }}
              >
                {tag.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-xl flex-col items-center text-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${quote.source}-${quoteIndex}`}
            initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -2, filter: "blur(3px)" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center"
          >
            <blockquote
              className="text-[clamp(0.8rem,1.1vw,0.92rem)] font-light leading-[1.85] tracking-[0.02em]"
              style={{
                color: quoteAccentStyles.text,
              }}
            >
              “{quote.content[0]}
              <br className="hidden sm:block" />
              {quote.content[1]}”
            </blockquote>
            <p
              className="mt-2.5 text-[11px]"
              style={{
                color: quoteAccentStyles.text,
              }}
            >
              {quote.source}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-[11px] sm:text-xs"
            >
              <span>
                <span className="text-[0.9rem] font-light">{item.value}</span>{" "}
                {item.label}
              </span>
              {index < stats.length - 1 ? <span>·</span> : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-5 text-[1rem]">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              aria-label={item.label}
              className="transition duration-300 hover:-translate-y-0.5"
            >
              <Icon icon={item.icon} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeHero;
