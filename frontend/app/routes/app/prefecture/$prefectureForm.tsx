import { ViewonlyField } from "@/components/form/viewonlyField.tsx";
import { FormInput } from "@/components/form/withReactHook/formInput.tsx";
import { GridEditForm } from "@/components/grid/gridEditForm.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { prefectureZod } from "@my-app/graphql-server/zodSchema";
import { Button, Card, CardContent, Form, SheetFooter, SheetHeader, SheetTitle } from "@my-app/shadcn";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  type PrefectureFormType,
  fetchPrefecture,
  getDefaultPrefecture,
  updatePrefecture,
} from "./prefectureFormDataClient.ts";

type Props = {
  code?: number;
  onClose: () => void;
};

export const PrefectureForm = ({ code, onClose }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const formData = useForm<PrefectureFormType>({
    resolver: zodResolver(prefectureZod),
    defaultValues: getDefaultPrefecture(),
  });

  useEffect(() => {
    if (!code) {
      formData.reset(getDefaultPrefecture());
      setIsLoaded(false);
      return;
    }
    (async () => {
      await fetchPrefecture(formData, code);
      setIsLoaded(true);
    })();
  }, [code]);

  if (!code || !isLoaded) {
    // ロード後、編集フォームを表示する
    return <div />;
  }

  return (
    <GridEditForm className="w-[70%] min-w-[70%]" modal={false} open={code !== undefined} onClose={onClose}>
      <Form {...formData}>
        <SheetHeader>
          <SheetTitle>顧客情報の編集</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full w-full items-center gap-4 px-4">
          <Card className="w-full inline">
            <CardContent className="flex flex-row gap-5 flex-wrap">
              <ViewonlyField label="都道府県コード" value={formData.getValues().code.toString()} />
              <ViewonlyField label="都道府県名" value={formData.getValues().name} />
            </CardContent>
          </Card>
          <div className="w-full flex flex-col gap-4">
            <FormInput className="w-full" form={formData} name="nameKana" label="都道府県名（カナ）" type="text" />
            <FormInput className="w-full" form={formData} name="nameAlpha" label="都道府県名（ローマ字）" type="text" />
          </div>
        </div>
        <SheetFooter>
          <Button
            onClick={async () => {
              await formData.handleSubmit(async (data) => {
                await updatePrefecture(data);
              })();
            }}
          >
            保存
          </Button>
        </SheetFooter>
      </Form>
    </GridEditForm>
  );
};
