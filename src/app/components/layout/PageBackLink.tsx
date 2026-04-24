"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

/**
 * @function 根据当前路径生成返回兜底地址，避免没有浏览器历史时无法回退。
 */
function buildFallbackHref(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return "/";
  }

  return `/${segments.slice(0, -1).join("/")}`;
}

export default function PageBackLink() {
  const router = useRouter();
  const pathname = usePathname();
  const fallbackHref = buildFallbackHref(pathname);
  const parentLabel = pathname
    .split("/")
    .filter(Boolean)
    .slice(0, -1)
    .join(" / ");

  /**
   * @function 优先返回上一页，没有历史记录时退回父级路由。
   */
  const onBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const hasReferrer = document.referrer.length > 0;
    const isSameOriginReferrer = hasReferrer
      ? new URL(document.referrer).origin === window.location.origin
      : false;

    if (isSameOriginReferrer) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={fallbackHref}
      onClick={onBack}
      aria-label="返回上一页"
      title="返回上一页"
      className="
        relative
        group
        inline-flex
        w-fit
        items-center
        gap-1.5
        rounded-full
        border
        border-transparent
        cursor-pointer
        pointer-events-auto
        px-1.5
        py-1
        text-current
        opacity-55
        transition
        duration-300
        hover:-translate-x-0.5
        hover:border-black/8
        hover:opacity-100
        active:translate-x-0
        dark:hover:border-white/10
      "
    >
      <ArrowLeft className="h-3.5 w-3.5 shrink-0 transition duration-300 group-hover:-translate-x-0.5" />
      <span className="text-[11px] uppercase tracking-[0.24em]">
        {parentLabel ? `Back to ${parentLabel}` : "Back"}
      </span>
    </Link>
  );
}
