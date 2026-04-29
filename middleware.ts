import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 主站域名（国际站）
const MAIN_HOST = "zeroanon.com";
// 国内站域名
const CN_HOST = "cn.zeroanon.com";

// 识别为中国大陆访问的国家代码集合
const CHINA_COUNTRY_CODES = new Set(["CN"]);

/**
 * @function 去掉 host 里的端口，方便本地和生产环境共用判断逻辑。
 */
function normalizeHost(host: string): string {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

/**
 * @function 从常见边缘平台请求头中读取访问者国家代码。
 */
function getCountryCode(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code")
  )?.toUpperCase();
}

/**
 * @function 保留当前路径和查询参数，只替换目标域名。
 */
function redirectToHost(
  request: NextRequest,
  host: string,
  protocol: "http:" | "https:"
) {
  const url = request.nextUrl.clone();
  url.protocol = protocol;
  url.host = host;

  return NextResponse.redirect(url, 307);
}

export function middleware(request: NextRequest) {
  // 当前请求的 host
  const host = normalizeHost(request.headers.get("host") ?? "");
  // Vercel / Cloudflare 等边缘平台注入的访问者国家代码，例如 CN / US
  const country = getCountryCode(request);

  // 本地开发环境通常拿不到地理位置请求头，因此直接放行
  if (!country) {
    return NextResponse.next();
  }

  const isChinaVisitor = CHINA_COUNTRY_CODES.has(country);

  // 如果访问者来自中国大陆，并且当前访问的是主站，则重定向到国内站
  if (isChinaVisitor && host === MAIN_HOST) {
    return redirectToHost(request, CN_HOST, "http:");
  }

  // 如果访问者不在中国大陆，并且当前访问的是国内站，则重定向回国际站
  if (!isChinaVisitor && host === CN_HOST) {
    return redirectToHost(request, MAIN_HOST, "https:");
  }

  // 其他情况保持原请求继续执行
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 排除 API、Next 静态资源和常见站点文件，避免无意义重定向
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
