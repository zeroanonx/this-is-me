import { Icon } from "@iconify-icon/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/components/shadcn/hover-card";

interface Props {
  icon?: string;
  title: string;
  link?: string;
  previewImg?: string;
  previewDesc?: string;
}

const CardLink = ({ icon, title, link, previewImg, previewDesc }: Props) => {
  const content = (
    <span className="inline-block px-1 text-zinc-500 transition-all hover:text-zinc-700 hover:underline dark:hover:text-zinc-300">
      <span className="flex items-center gap-1">
        {icon ? <Icon icon={icon} /> : null}
        <code>{title}</code>
      </span>
    </span>
  );

  const cardInner = (
    <div className="block h-full w-full overflow-hidden rounded-md">
      {previewImg ? (
        <img
          src={previewImg}
          alt={title}
          className="m-0 h-36 w-full object-cover"
        />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          暂无预览图
        </div>
      )}

      {title || previewDesc ? (
        <div className="space-y-1 p-3">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {title}
          </div>
          {previewDesc ? (
            <div className="line-clamp-3 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
              {previewDesc}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <HoverCard openDelay={150} closeDelay={80}>
      <HoverCardTrigger asChild>{content}</HoverCardTrigger>

      <HoverCardContent
        side="bottom"
        align="start"
        sideOffset={12}
        className="w-72 overflow-hidden p-0"
      >
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {cardInner}
          </a>
        ) : (
          cardInner
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default CardLink;
