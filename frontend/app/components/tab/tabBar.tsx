import { Card, cn } from "@my-app/shadcn";
import { type ComponentProps, useEffect, useState } from "react";
import { TabMenu, type TabMenuItem } from "./tabMenu.tsx";

/**
 * タブメニュー
 * Note: ダークモード非対応、タブの折り返し非対応
 */

export type TabBarProps = {
  defaultSelectedId?: number | string;
  height?: number | string;
  menues: TabMenuItem[];
  notAdd?: boolean;
  onAdd?: (index: number) => void;
  onDelete?: (index: number, menu: TabMenuItem) => void;
  onTabSelect?: (index: number, menu?: TabMenuItem) => void;
};

export default function TabBar({
  defaultSelectedId,
  menues,
  notAdd = false,
  onAdd,
  onDelete,
  onTabSelect,
  className,
  ...options
}: TabBarProps & ComponentProps<"div">) {
  const [tabIds, setTabIds] = useState<(number | string)[]>();
  const [activeTabId, setActiveTabId] = useState<number | string | undefined>(defaultSelectedId);

  useEffect(() => {
    const newTabIds = menues.map((menu) => menu.uuid);
    const newActiveTabId = resolveActiveTabId(activeTabId ?? "", tabIds ?? [], newTabIds);
    setTabIds(newTabIds);
    setActiveTabId(newActiveTabId);
    const selectedIndex = menues.findIndex((menu) => menu.uuid === newActiveTabId);
    onTabSelect?.(selectedIndex, menues[selectedIndex]!);
  }, [menues]);

  if (activeTabId === undefined && notAdd === true) {
    return <div />;
  }

  return (
    <Card
      className={cn(
        "h-10",
        className,
        "flex flex-row flex-wrap-reverse gap-0 rounded-b-none border-b-0 py-0",
      )}
      {...options}
    >
      {menues.map((menue, index) => (
        <TabMenu
          key={menue.uuid}
          onClick={() => {
            setActiveTabId(menue.uuid);
            onTabSelect?.(index, menue);
          }}
          onDelete={() => onDelete?.(index, menue)}
          selected={menue.uuid === activeTabId}
          {...menue}
        />
      ))}
      {!notAdd /** 追加ボタン */ && (
        <div className="relative h-full w-8 flex justify-center items-center">
          <span
            className={cn(
              "inline-block h-7 w-7 rounded-[50%]",
              "text-muted-foreground hover:text-muted hover:bg-muted-foreground",
            )}
            onClick={() => onAdd?.(menues.length)}
          >
            <i className={cn("i-mdi-plus text-[20px]", "absolute top-[10px] right-[6px] ")} />
          </span>
        </div>
      )}
    </Card>
  );
}

// 新旧のメニューを比較して、アクティブなタブを決定する
const resolveActiveTabId = (
  oldActiveTabId: string | number,
  oldTabIds: (string | number)[],
  newTabIds: (string | number)[],
) => {
  if (oldTabIds.length === 0 && newTabIds.length === 0) {
    return undefined;
  }

  // 前回選択なし
  if (oldActiveTabId === undefined) {
    return newTabIds[0];
  }

  // 前回がタブなしの場合は、最初のタブを選択
  if (oldTabIds.length === 0) {
    return newTabIds[0];
  }

  // タブが削除された場合
  if (oldTabIds.length > newTabIds.length) {
    // 前回選択タブが削除されていなかった場合
    const currentTabIndex = newTabIds.findIndex((id) => id === oldActiveTabId);
    if (currentTabIndex >= 0) {
      return oldActiveTabId;
    }

    // 前回選択タブが削除されていた場合
    const oldTabIndex = oldTabIds.findIndex((id) => id === oldActiveTabId);
    return oldTabIndex < newTabIds.length
      ? newTabIds[oldTabIndex]
      : newTabIds[newTabIds.length - 1];
  }

  if (oldTabIds.length < newTabIds.length) {
    // 新しいタブが追加された場合は、追加タブを選択（一番右側）
    return newTabIds[newTabIds.length - 1];
  }

  // タブの変更なく再レンダリングされた場合
  return oldActiveTabId;
};
