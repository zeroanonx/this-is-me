import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 主站域名（国际站）
const MAIN_HOST = "zeroanon.com";
// 国内站域名
const CN_HOST = "cn.zeroanon.com";

// 识别为中国大陆访问的国家代码集合
const CHINA_COUNTRY_CODES = new Set(["CN"]);

export function middleware(request: NextRequest) {
  // 当前请求的 host
  const host = request.headers.get("host") ?? "";
  // Vercel 在生产环境注入的访问者国家代码，例如 CN / US
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();

  // 本地开发环境通常拿不到 Vercel 的地理位置请求头，因此直接放行
  if (!country) {
    return NextResponse.next();
  }

  // 如果访问者来自中国大陆，并且当前访问的是主站，则重定向到国内站
  if (CHINA_COUNTRY_CODES.has(country) && host === MAIN_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "http:";
    url.host = CN_HOST;
    return NextResponse.redirect(url, 307);
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
