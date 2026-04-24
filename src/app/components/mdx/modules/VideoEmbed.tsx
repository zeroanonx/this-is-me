"use client";

import { useEffect, useMemo, useState } from "react";

interface VideoEmbedProps {
  height?: number | string;
  src?: string;
  title: string;
  fallbackHref?: string;
  fallbackText?: string;
  autoShowNotice?: boolean;
  switchTimeout?: number;
}

/**
 * @function 渲染 MDX 中可复用的视频嵌入组件。
 * 默认优先使用 src 播放，若主播放源加载不稳定则自动切换到 fallbackHref。
 */
const VideoEmbed = ({
  height = 420,
  src,
  title,
  fallbackHref,
  fallbackText = "当前正在使用备用播放源。",
  autoShowNotice = true,
  switchTimeout = 4000,
}: VideoEmbedProps) => {
  const [currentSource, setCurrentSource] = useState<"primary" | "fallback">(
    src ? "primary" : "fallback"
  );
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [autoSwitched, setAutoSwitched] = useState(false);

  const hasPrimary = Boolean(src);
  const hasFallback = Boolean(fallbackHref);

  const currentSrc = useMemo(() => {
    return currentSource === "primary" ? src : fallbackHref;
  }, [currentSource, fallbackHref, src]);

  const wrapperClassName =
    "my-6 overflow-hidden rounded-2xl border border-white/8 bg-black/30 shadow-[0_18px_50px_rgba(0,0,0,0.18)]";

  const noticeClassName =
    "flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/8 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-white/80";

  const buttonClassName =
    "cursor-pointer underline underline-offset-4 transition hover:text-white";

  useEffect(() => {
    if (hasPrimary) {
      setCurrentSource("primary");
    } else if (hasFallback) {
      setCurrentSource("fallback");
    } else {
      setCurrentSource("primary");
    }

    setIframeLoaded(false);
    setAutoSwitched(false);
  }, [hasFallback, hasPrimary, fallbackHref, src]);

  useEffect(() => {
    setIframeLoaded(false);
  }, [currentSrc]);

  useEffect(() => {
    if (!hasPrimary || !hasFallback) {
      return;
    }

    if (currentSource !== "primary") {
      return;
    }

    if (iframeLoaded) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentSource("fallback");
      setAutoSwitched(true);
    }, switchTimeout);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentSource, hasFallback, hasPrimary, iframeLoaded, switchTimeout]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleSwitchToPrimary = () => {
    if (!hasPrimary) {
      return;
    }

    setCurrentSource("primary");
    setIframeLoaded(false);
    setAutoSwitched(false);
  };

  const handleSwitchToFallback = () => {
    if (!hasFallback) {
      return;
    }

    setCurrentSource("fallback");
    setIframeLoaded(false);
    setAutoSwitched(false);
  };

  const renderNotice = () => {
    if (!autoShowNotice) {
      return null;
    }

    if (!hasPrimary && !hasFallback) {
      return null;
    }

    if (hasPrimary && hasFallback) {
      return (
        <div className={noticeClassName}>
          <span>
            该视频提供了主播放源和备用播放源，主地址不可用时会自动切换。
          </span>

          {autoSwitched ? <span>{fallbackText}</span> : null}

          <button
            type="button"
            onClick={handleSwitchToPrimary}
            className={buttonClassName}
          >
            切换到主播放源
          </button>

          <button
            type="button"
            onClick={handleSwitchToFallback}
            className={buttonClassName}
          >
            切换到备用播放源
          </button>
        </div>
      );
    }

    return (
      <div className={noticeClassName}>
        <span>
          {hasPrimary ? "当前视频使用主播放源。" : "当前视频使用备用播放源。"}
        </span>
      </div>
    );
  };

  const renderVideoContent = () => {
    if (!currentSrc) {
      return (
        <div
          className="flex items-center justify-center px-6 text-sm text-white/60"
          style={{ height }}
        >
          当前视频缺少可用的视频地址。
        </div>
      );
    }

    return (
      <iframe
        key={currentSource}
        width="100%"
        height={height}
        src={currentSrc}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={handleIframeLoad}
      />
    );
  };

  return (
    <div className={wrapperClassName}>
      {renderNotice()}
      {renderVideoContent()}
    </div>
  );
};

export default VideoEmbed;
