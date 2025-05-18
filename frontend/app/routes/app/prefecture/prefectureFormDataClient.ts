import type { prefectureZod } from "@my-app/graphql-server/zodSchema";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { genqlClient } from "../../../utils/graphqlClient.ts";

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

export const updateCustomerData = async (input: PrefectureFormType) => {
  await genqlClient.mutation({
    updateCustomerData: {
      __args: { input },
    },
  });
};

type PrefectureFormType = z.infer<typeof prefectureZod>;

export const getDefaultPrefecture = (): PrefectureFormType => ({
  code: 0,
  name: "",
  nameKana: "",
  nameAlpha: "",
});

export const fetchCustomer = async (
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
