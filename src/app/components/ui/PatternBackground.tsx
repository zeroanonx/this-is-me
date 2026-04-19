"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { cva } from "class-variance-authority";
import clsx from "clsx";

export const PATTERN_BACKGROUND_DIRECTION = {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
  TopLeft: "top-left",
  TopRight: "top-right",
  BottomLeft: "bottom-left",
  BottomRight: "bottom-right",
} as const;

export const PATTERN_BACKGROUND_VARIANT = {
  Grid: "grid",
  Dot: "dot",
  BigDot: "big-dot",
} as const;

export const PATTERN_BACKGROUND_MASK = {
  Ellipse: "ellipse",
  EllipseTop: "ellipse-top",
} as const;

export const PATTERN_BACKGROUND_SPEED = {
  Default: 10000,
  Slow: 25000,
  Fast: 5000,
} as const;

type PatternBackgroundDirection = keyof typeof PATTERN_BACKGROUND_DIRECTION;
type PatternBackgroundVariant = keyof typeof PATTERN_BACKGROUND_VARIANT;
type PatternBackgroundMask = keyof typeof PATTERN_BACKGROUND_MASK;
type PatternBackgroundSize = "xs" | "sm" | "md" | "lg";

const ANIMATION_STYLE_ID = "pattern-background-animations";

const patternBackgroundVariants = cva(
  "fixed inset-0 pointer-events-none z-1 overflow-hidden",
  {
    variants: {
      variant: {
        grid: "bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]",
        dot: "bg-[radial-gradient(currentColor_1px,transparent_1px)]",
        "big-dot": "bg-[radial-gradient(currentColor_3px,transparent_3px)]",
      },
      size: {
        xs: "bg-[size:8px_8px]",
        sm: "bg-[size:16px_16px]",
        md: "bg-[size:24px_24px]",
        lg: "bg-[size:32px_32px]",
      },
      mask: {
        ellipse:
          "[mask-image:radial-gradient(ellipse_at_center,transparent,black_80%)]",
        "ellipse-top":
          "[mask-image:radial-gradient(ellipse_at_top,transparent,black_80%)]",
      },
    },
    defaultVariants: {
      variant: "grid",
      size: "md",
      mask: "ellipse",
    },
  }
);

export interface PatternBackgroundProps {
  animate?: boolean;
  children?: ReactNode;
  className?: string;
  direction?: PatternBackgroundDirection;
  mask?: PatternBackgroundMask;
  size?: PatternBackgroundSize;
  speed?: number;
  variant?: PatternBackgroundVariant;
}

/**
 * @function 在客户端挂载时注入一次背景动画样式，避免模块顶层直接操作 document。
 */
const ensureAnimationStyles = (): void => {
  if (
    typeof document === "undefined" ||
    document.getElementById(ANIMATION_STYLE_ID)
  ) {
    return;
  }

  const style = document.createElement("style");

  style.id = ANIMATION_STYLE_ID;
  style.innerHTML = `
@keyframes to-top { from { background-position: 0 100%; } to { background-position: 0 0; } }
@keyframes to-bottom { from { background-position: 0 0; } to { background-position: 0 100%; } }
@keyframes to-left { from { background-position: 100% 0; } to { background-position: 0 0; } }
@keyframes to-right { from { background-position: 0 0; } to { background-position: 100% 0; } }
@keyframes to-top-left { from { background-position: 100% 100%; } to { background-position: 0 0; } }
@keyframes to-top-right { from { background-position: 0 100%; } to { background-position: 100% 0; } }
@keyframes to-bottom-left { from { background-position: 100% 0; } to { background-position: 0 100%; } }
@keyframes to-bottom-right { from { background-position: 0 0; } to { background-position: 100% 100%; } }

.move {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.move-top { animation-name: to-top; }
.move-bottom { animation-name: to-bottom; }
.move-left { animation-name: to-left; }
.move-right { animation-name: to-right; }
.move-top-left { animation-name: to-top-left; }
.move-top-right { animation-name: to-top-right; }
.move-bottom-left { animation-name: to-bottom-left; }
.move-bottom-right { animation-name: to-bottom-right; }
`;

  document.head.appendChild(style);
};

/**
 * @function 生成当前背景所需的动画类名。
 */
const getAnimationClassName = (
  animate: boolean,
  direction: PatternBackgroundDirection
): string | null => {
  if (!animate) {
    return null;
  }

  return `move move-${PATTERN_BACKGROUND_DIRECTION[direction]}`;
};

/**
 * @function 渲染可复用的网格 / 圆点背景，并按需附加平移动画。
 */
const PatternBackground = ({
  animate = false,
  children,
  className,
  direction = "Top",
  mask = "Ellipse",
  size = "md",
  speed = PATTERN_BACKGROUND_SPEED.Default,
  variant = "Grid",
}: PatternBackgroundProps) => {
  useEffect(() => {
    ensureAnimationStyles();
  }, []);

  const animationClassName = useMemo(() => {
    return getAnimationClassName(animate, direction);
  }, [animate, direction]);

  const animationStyle = useMemo<CSSProperties | undefined>(() => {
    if (!animate) {
      return undefined;
    }

    return {
      animationDuration: `${speed}ms`,
    };
  }, [animate, speed]);

  return (
    <div
      className={clsx(
        patternBackgroundVariants({
          mask: PATTERN_BACKGROUND_MASK[mask],
          size,
          variant: PATTERN_BACKGROUND_VARIANT[variant],
        }),
        "text-neutral-300 dark:text-neutral-700",
        animationClassName,
        className
      )}
      style={animationStyle}
    >
      {children}
    </div>
  );
};

export default PatternBackground;
