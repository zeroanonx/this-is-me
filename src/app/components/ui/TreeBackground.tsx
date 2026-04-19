"use client";

import { useEffect, useRef } from "react";

const HALF_TURN = Math.PI;
const QUARTER_TURN = Math.PI / 2;
const BRANCH_ANGLE_OFFSET = Math.PI / 12;
const BRANCH_COLOR = "#88888825";
const BRANCH_LENGTH = 6;
const FRAME_INTERVAL = 1000 / 40;
const MIN_BRANCH_DEPTH = 30;
const MOBILE_BREAKPOINT = 500;
const OUT_OF_BOUNDS_OFFSET = 100;
const MOBILE_TREE_COUNT = 2;

type StepTask = () => void;

interface BranchCounter {
  value: number;
}

interface Point {
  x: number;
  y: number;
}

/**
 * @function 初始化 canvas 的显示尺寸和像素比，保证线条在高分屏下依然清晰。
 */
const initCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null => {
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const devicePixelRatio = window.devicePixelRatio || 1;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = devicePixelRatio * width;
  canvas.height = devicePixelRatio * height;

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  context.lineWidth = 1;
  context.strokeStyle = BRANCH_COLOR;

  return context;
};

/**
 * @function 将极坐标位移转换为画布中的二维坐标。
 */
const polarToCartesian = (
  x: number,
  y: number,
  radius: number,
  angle: number
): Point => {
  return {
    x: x + radius * Math.cos(angle),
    y: y + radius * Math.sin(angle),
  };
};

/**
 * @function 判断当前分支节点是否已经完全离开可视区域。
 */
const isOutOfBounds = (point: Point): boolean => {
  return (
    point.x < -OUT_OF_BOUNDS_OFFSET ||
    point.x > window.innerWidth + OUT_OF_BOUNDS_OFFSET ||
    point.y < -OUT_OF_BOUNDS_OFFSET ||
    point.y > window.innerHeight + OUT_OF_BOUNDS_OFFSET
  );
};

/**
 * @function 返回更偏向画面中段的随机比例，避免树枝都挤在边角。
 */
const getRandomMiddle = (): number => {
  return Math.random() * 0.6 + 0.2;
};

/**
 * @function 根据当前分支深度返回更自然的分叉概率。
 */
const getBranchRate = (depth: number): number => {
  return depth <= MIN_BRANCH_DEPTH ? 0.8 : 0.5;
};

/**
 * @function 根据屏幕宽度生成树状生长的起始任务。
 */
const createInitialSteps = (
  width: number,
  height: number,
  drawBranch: (
    x: number,
    y: number,
    angle: number,
    counter?: BranchCounter
  ) => void
): StepTask[] => {
  const steps: StepTask[] = [
    () => drawBranch(getRandomMiddle() * width, -5, QUARTER_TURN),
    () => drawBranch(getRandomMiddle() * width, height + 5, -QUARTER_TURN),
    () => drawBranch(-5, getRandomMiddle() * height, 0),
    () => drawBranch(width + 5, getRandomMiddle() * height, HALF_TURN),
  ];

  return width < MOBILE_BREAKPOINT ? steps.slice(0, MOBILE_TREE_COUNT) : steps;
};

/**
 * @function 渲染树状背景，并在动画结束或组件卸载时正确清理资源。
 */
const TreeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let animationFrameId = 0;
    let currentSteps: StepTask[] = [];
    let nextSteps: StepTask[] = [];
    let lastFrameTime = 0;
    let context = initCanvas(canvas, window.innerWidth, window.innerHeight);

    if (!context) {
      return;
    }

    /**
     * @function 递归绘制单条树枝，并把下一层分叉加入队列。
     */
    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      counter: BranchCounter = { value: 0 }
    ): void => {
      if (!context) {
        return;
      }

      const length = Math.random() * BRANCH_LENGTH;

      counter.value += 1;

      const nextPoint = polarToCartesian(x, y, length, angle);

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(nextPoint.x, nextPoint.y);
      context.stroke();

      if (isOutOfBounds(nextPoint)) {
        return;
      }

      const branchRate = getBranchRate(counter.value);

      if (Math.random() < branchRate) {
        nextSteps.push(() =>
          drawBranch(
            nextPoint.x,
            nextPoint.y,
            angle + Math.random() * BRANCH_ANGLE_OFFSET,
            counter
          )
        );
      }

      if (Math.random() < branchRate) {
        nextSteps.push(() =>
          drawBranch(
            nextPoint.x,
            nextPoint.y,
            angle - Math.random() * BRANCH_ANGLE_OFFSET,
            counter
          )
        );
      }
    };

    /**
     * @function 按固定节奏推进树枝生长，避免每一帧都过度刷新。
     */
    const frame = (timestamp: number): void => {
      if (timestamp - lastFrameTime < FRAME_INTERVAL) {
        animationFrameId = window.requestAnimationFrame(frame);
        return;
      }

      currentSteps = nextSteps;
      nextSteps = [];
      lastFrameTime = timestamp;

      if (!currentSteps.length) {
        return;
      }

      currentSteps.forEach((task) => {
        if (Math.random() < 0.5) {
          nextSteps.push(task);
          return;
        }

        task();
      });

      animationFrameId = window.requestAnimationFrame(frame);
    };

    /**
     * @function 重新初始化整张画布，并从边缘重新开始生长。
     */
    const start = (): void => {
      window.cancelAnimationFrame(animationFrameId);
      context = initCanvas(canvas, window.innerWidth, window.innerHeight);

      if (!context) {
        return;
      }

      context.lineWidth = 1;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      currentSteps = [];
      nextSteps = createInitialSteps(
        window.innerWidth,
        window.innerHeight,
        drawBranch
      );
      lastFrameTime = performance.now();
      animationFrameId = window.requestAnimationFrame(frame);
    };

    start();
    window.addEventListener("resize", start);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", start);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        maskImage: "radial-gradient(circle, black, transparent)",
        WebkitMaskImage: "radial-gradient(circle, black, transparent)",
      }}
    >
      <canvas ref={canvasRef} width="400" height="400" />
    </div>
  );
};

export default TreeBackground;
