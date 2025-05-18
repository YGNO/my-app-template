import { Card, cn } from "@my-app/shadcn";
import { type ComponentProps, useState } from "react";
import TabBar, { type TabBarProps } from "./tabBar.tsx";

type Props = { children: React.ReactNode } & TabBarProps;

export const TabLayout = ({
  children,
  className,
  defaultSelectedId,
  menues,
  onAdd,
  onDelete,
  onTabSelect,
  ...options
}: Props & ComponentProps<"div">) => {
  const [activeTabId, setActiveTabId] = useState<number | string | undefined>(defaultSelectedId);
  return (
    <div className={cn(className, "flex flex-col")} {...options}>
      <TabBar
        className="w-full bg-muted"
        defaultSelectedId={defaultSelectedId}
        menues={menues}
        onAdd={onAdd}
        onDelete={onDelete}
        onTabSelect={(index, menu) => {
          setActiveTabId(menu?.uuid);
          onTabSelect?.(index, menu);
        }}
      />
      <Card
        className="w-full h-full p-4 rounded-t-none border-t-0"
        // タブ切り替え時にコンテンツを再レンダリングするために、一意なキーを設定する
        key={`tab-content-${activeTabId ?? ""}`}
      >
        {children}
      </Card>
    </div>
  );
};
