/**
 * @function 伪随机（固定 seed，刷新不变）
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 生成流动路径
 */
export const generateFlowPaths = ({
  width = 1000,
  height = 1000,
  lines = 80,
  steps = 200,
  seed = 13,
}) => {
  const rand = mulberry32(seed);
  const paths: string[] = [];

  for (let i = 0; i < lines; i++) {
    let x = rand() * width;
    let y = rand() * height;
    let angle = rand() * Math.PI * 2;

    let d = `M ${x.toFixed(2)} ${y.toFixed(2)}`;

    for (let j = 0; j < steps; j++) {
      // Flow field 核心
      const noise = Math.sin(x * 0.002) + Math.cos(y * 0.002);
      angle += noise * 0.3;

      x += Math.cos(angle) * 3;
      y += Math.sin(angle) * 3;

      if (x < 0 || y < 0 || x > width || y > height) break;

      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    paths.push(d);
  }

  return paths;
};
