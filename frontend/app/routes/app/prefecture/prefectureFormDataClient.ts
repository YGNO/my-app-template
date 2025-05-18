import { genqlClient } from "@/utils/graphqlClient.ts";
import type { prefectureZod } from "@my-app/graphql-server/zodSchema";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

const fetchData = async (code: number) => {
  // 顧客情報の取得クエリ
  return await genqlClient.query({
    prefecture: {
      __args: {
        code,
      },
      code: true,
      name: true,
      nameKana: true,
      nameAlpha: true,
    },
  });
};

export const updatePrefecture = async (input: PrefectureFormType) => {
  await genqlClient.mutation({
    updatePrefecture: {
      __args: { input },
    },
  });
};

export type PrefectureFormType = z.infer<typeof prefectureZod>;

export const getDefaultPrefecture = (): PrefectureFormType => ({
  code: 0,
  name: "",
  nameKana: "",
  nameAlpha: "",
});

export const fetchPrefecture = async (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formObject: UseFormReturn<PrefectureFormType, any, PrefectureFormType>,
  code?: number,
) => {
  if (code === undefined) {
    formObject.reset(getDefaultPrefecture());
    return;
  }
  const customerData = (await fetchData(code)).prefecture as PrefectureFormType;
  formObject.reset(customerData);
};
