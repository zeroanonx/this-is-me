import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";

interface ZeroLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;

  /**
   * CSS 变量名，例如：
   * --accent-primary
   * --green-primary
   * --red-primary
   */
  theme?: string;

  /**
   * 是否新窗口打开。
   * 不传时，外链默认新窗口打开，内链默认当前窗口打开。
   */
  blank?: boolean;
}

const isExternalHref = (href?: string) => {
  if (!href) return false;

  return /^(https?:)?\/\//.test(href);
};

const ZeroLink = ({
  children,
  theme = "--accent-primary",
  href,
  blank,
  target,
  rel,
  className,
  style,
  ...rest
}: ZeroLinkProps) => {
  const isExternal = isExternalHref(href);
  const shouldBlank = blank ?? isExternal;

  const commonStyle = {
    color: `var(${theme})`,
    "--spec-badge-line": `color-mix(in srgb, var(${theme}) 42%, transparent)`,
    "--spec-badge-line-hover": `var(${theme})`,
    ...style,
  } as CSSProperties;

  const commonClassName = [
    "relative mx-0.5 inline-block font-medium transition duration-300",
    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px",
    "after:origin-center after:scale-x-40",
    "after:bg-[var(--spec-badge-line)]",
    "after:transition after:duration-300",
    "hover:-translate-y-px hover:after:scale-x-100",
    "hover:after:bg-[var(--spec-badge-line-hover)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!href) {
    return (
      <span style={commonStyle} className={commonClassName}>
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={target ?? (shouldBlank ? "_blank" : undefined)}
      rel={rel ?? (shouldBlank ? "noopener noreferrer" : undefined)}
      style={commonStyle}
      className={commonClassName}
      {...rest}
    >
      {children}
    </a>
  );
};

export default ZeroLink;
