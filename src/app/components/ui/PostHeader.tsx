import { cn } from "@/app/utils";

interface PostHeaderProps {
  eyebrow?: string;
  title: string;
  desc?: string;
  font?: string;
  color?: string;
  align?: "left" | "center";
}

export default function PostHeader({
  eyebrow,
  title,
  desc,
  font = "lh",
  color = "--accent-primary",
  align = "center",
}: PostHeaderProps) {
  return (
    <header
      className={cn(
        "mb-10 space-y-3 sm:mb-16",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      {eyebrow ? (
        <p className="text-[10px] uppercase tracking-[0.34em] text-white/36">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "text-3xl! font-semibold tracking-tight sm:text-[2.6rem]!",
          `font-${font}`
        )}
      >
        {title}
      </h1>
      {desc ? (
        <p
          className={cn(
            "max-w-2xl text-sm leading-6 text-white/52",
            align === "center" ? "mx-auto" : "",
            `text-(${color})`
          )}
        >
          {desc}
        </p>
      ) : null}
    </header>
  );
}
