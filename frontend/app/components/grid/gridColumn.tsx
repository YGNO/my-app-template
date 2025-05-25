import type { Column, Formatter, IFormatters, OnEventArgs } from "slickgrid-react";

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

const treeButton: Formatter = (_row, _cell, value, _columnDef) => {
  if (value === "chaild") {
    return "";
  }
  const icon = document.createElement("i");
  icon.classList.add(
    value === "open" ? "i-mdi-menu-down" : "i-mdi-menu-right",
    "text-[28px]",
    "text-primary",
    "hover:text-primary/50",
    "relative",
    "bottom-[4px]",
  );
  icon.setAttribute("role", "treeRoot");
  return icon;
};

export const treeActionColumn = (
  _formatters: IFormatters,
  option?: { name?: string; onClick?: (e: Event, args: OnEventArgs) => void },
): Column => {
  return {
    id: option?.name ?? "treeNode",
    field: option?.name ?? "treeNode",
    excludeFromQuery: true,
    excludeFromColumnPicker: true,
    excludeFromGridMenu: true,
    excludeFromHeaderMenu: true,
    formatter: treeButton,
    minWidth: 45,
    maxWidth: 45,
    onCellClick(e, args) {
      const { row, dataContext, dataView } = args;
      if (dataContext.treeNode === "chaild") {
        return;
      }
      e.preventDefault();
      if (dataContext.treeNode === "open") {
        dataContext.treeNode = "close";
        const item = dataView.getItems()[row + 1];
        dataView.deleteItem(item.code);
        return;
      }
      dataContext.treeNode = "open";
      const newData = {
        ...dataContext,
        code: self.crypto.randomUUID(),
        treeNode: "chaild",
      };
      dataView.insertItem(row + 1, newData);
    },
  };
};
