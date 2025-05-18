import { Card, Label, cn } from "@my-app/shadcn";
import type { ComponentProps } from "react";

export type TabMenuItem = {
  uuid: number | string;
  title: string;
  deletable?: boolean;
};

const ID_PREFIX = "tab-menu-";
export const TabMenu = ({
  uuid,
  title,
  deletable = false,
  onDelete,
  selected = false,
  className,
  ...options
}: TabMenuItem & {
  onDelete?: () => void;
  first?: boolean;
  selected?: boolean;
} & ComponentProps<"div">) => {
  return (
    <Card
      id={`${ID_PREFIX}${uuid}`}
      className={cn(
        className,
        "h-full inline-flex flex-row gap-2 p-0 border-0 rounded-b-none shadow-none",
        !selected ? "bg-transparent hover:bg-primary-foreground" : "",
      )}
      {...options}
    >
      <div className="relative inline-flex flex-col h-full justify-center align-middle">
        <span className="flex justify-center items-center pl-2">
          <Label className="px-2 whitespace-nowrap">{title}</Label>
          {deletable && (
            <span
              className={cn(
                "relative h-4 w-4 rounded-[50%]",
                "text-muted-foreground hover:text-muted hover:bg-muted-foreground",
              )}
              onClick={(e) => {
                onDelete?.();
                e.stopPropagation();
              }}
            >
              <i className={cn("i-mdi-close text-[14px]", "absolute top-[1px] right-[1px] ")} />
            </span>
          )}
        </span>
        {
          // タブ選択中の下線
          selected && (
            <span className="absolute w-full left-1 bottom-1 select-none">
              <div className="w-full h-1 rounded-full bg-primary" />
            </span>
          )
        }
      </div>
      {/** 区切り線 */}
      <span className="h-full py-1 select-none">
        <div className={cn("h-full border-r-1", selected ? "invisible" : "")} />
      </span>
    </Card>
  );
};
