import { Sheet, SheetContent } from "@my-app/shadcn";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
  modal?: boolean;
} & ComponentProps<"div">;

export const GridEditForm = ({ open, closeOnOutsideClick = true, onClose, modal, children, ...props }: Props) => {
  return (
    <Sheet
      modal={modal}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <SheetContent
        {...props}
        onPointerDownOutside={() => {
          if (closeOnOutsideClick) {
            onClose();
          }
        }}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};
