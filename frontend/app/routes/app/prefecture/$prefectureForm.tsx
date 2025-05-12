import { ViewonlyField } from "@/components/form/viewonlyField.tsx";
import { GridEditForm } from "@/components/grid/gridEditForm.tsx";
import {
  Button,
  Card,
  Input,
  Label,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@my-app/shadcn";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const PrefectureForm = ({ open, onClose }: Props) => {
  return (
    <GridEditForm className="w-[300px] min-w-[50%] max-w-[300px]" modal={false} open={open} onClose={onClose}>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 px-4">
        <Card className="w-f p-4 flex flex-row gap-5 flex-wrap">
          <ViewonlyField label="都道府県コード" value="111111111" />
          <ViewonlyField label="都道府県コード" value="111111111" />
          <ViewonlyField label="都道府県コード" value="111111111" />
          <ViewonlyField label="都道府県コード" value="111111111" />
          <ViewonlyField label="都道府県コード" value="111111111" />
          <ViewonlyField label="都道府県コード" value="111111111" />
        </Card>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" defaultValue="@peduarte" className="col-span-3" />
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">保存</Button>
        </SheetClose>
      </SheetFooter>
    </GridEditForm>
  );
};
