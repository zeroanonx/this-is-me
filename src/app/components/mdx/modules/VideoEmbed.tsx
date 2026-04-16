interface VideoEmbedProps {
  height?: number | string;
  src: string;
  title: string;
}

/**
 * @function 渲染 MDX 中可复用的视频嵌入组件。
 */
const VideoEmbed = ({ height = 420, src, title }: VideoEmbedProps) => {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-white/8 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <iframe
        width="100%"
        height={height}
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoEmbed;
