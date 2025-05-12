import type { Column, IFormatters, OnEventArgs } from "@slickgrid-universal/common";

export const editActionColumn = (
  formatters: IFormatters,
  option?: { name?: string; onClick?: (e: Event, args: OnEventArgs) => void },
): Column => {
  return {
    id: option?.name ?? "edit",
    field: option?.name ?? "edit",
    excludeFromQuery: true,
    excludeFromColumnPicker: true,
    excludeFromGridMenu: true,
    excludeFromHeaderMenu: true,
    formatter: formatters?.icon,
    params: { iconCssClass: "i-mdi-note-edit-outline hover:i-mdi-note-edit pointer text-xl" },
    minWidth: 45,
    maxWidth: 45,
    onCellClick: option?.onClick,
  };
};
