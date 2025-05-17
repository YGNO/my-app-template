import z from "zod";

const require = "入力してください。";

export const prefectureZod = z.object({
  code: z.number().min(1, { message: require }),
  name: z.string().min(1, { message: require }),
  nameKana: z.string().min(1, { message: require }),
  nameAlpha: z.string().min(1, { message: require }),
});
