import type { Column, IFormatters, OnEventArgs } from "slickgrid-react";

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
    params: {
      iconCssClass:
        "i-mdi-note-edit-outline hover:i-mdi-note-edit pointer text-xl" +
        // grid.css と色合いを合わせている
        " text-primary/60 hover:text-primary",
    },
    minWidth: 45,
    maxWidth: 45,
    onCellClick: option?.onClick,
  };
};

export const treeActionColumn = (
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
    formatter() {
      return "<div>何か？</div>";
    },
    params: {
      iconCssClass:
        "i-mdi-note-edit-outline hover:i-mdi-note-edit pointer text-xl" +
        // grid.css と色合いを合わせている
        " text-primary/60 hover:text-primary",
    },
    minWidth: 45,
    maxWidth: 45,
    onCellClick(e: Event, args: OnEventArgs) {
      const newData = {
        ...args.dataContext,
        code: self.crypto.randomUUID(),
      };
      args.dataView.insertItem(args.row + 1, newData);
      console.log("イベント", { e, args });
    },
  };
};
