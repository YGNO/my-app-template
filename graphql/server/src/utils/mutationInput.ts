import type {
  InputFieldRef,
  InputFieldsFromShape,
  InputObjectRef,
  InputType,
  RecursivelyNormalizeNullableFields,
} from "@pothos/core";
import { type TypeOf, z } from "zod";
import type { SchemaBuilderType, SchemaType } from "../schemaDefine.ts";

/** ZodObject のみサポート */
type AllowedZodType<Object extends z.ZodRawShape> = z.ZodEffects<z.ZodObject<Object>> | z.ZodObject<Object>;

/** Zod スキーマを Pothos の inputType に変換するクラス */
export class MutationInput {
  // 変換済みの ZodObject をキャッシュするマップ
  // Note: 現状、一意な name をキーにしているので、実質動作していない
  private processedZodObject = new Map<string, InputObject<z.ZodRawShape>>();
  private constructor(private sb: SchemaBuilderType) {}

  static from<T extends z.ZodRawShape>(sb: SchemaBuilderType, name: string, zodSchema: AllowedZodType<T>) {
    const converter = new MutationInput(sb);
    return converter.toInputType(name, zodSchema);
  }

  /** Zod スキーマから inputType を生成する */
  private toInputType<T extends z.ZodRawShape>(name: string, zodSchema: AllowedZodType<T>): InputObject<T> {
    // 変換済みの ZodObject の場合は、同じ型を返す
    if (this.processedZodObject.has(name)) {
      return this.processedZodObject.get(name) as InputObject<T>;
    }

    // ZodEffects の場合は、内部のスキーマを取得する
    const unwrapSchema = zodSchema instanceof z.ZodEffects ? zodSchema._def.schema : zodSchema;
    if (!(unwrapSchema instanceof z.ZodObject)) {
      throw new Error(`Zod schema must be an object: ${name}`);
    }

    const inputType = this.sb
      .inputRef<z.infer<typeof unwrapSchema>>(name)
      .implement({ fields: this.toInputFieldList(unwrapSchema, name) });
    // Note: processedZodObject は任意の型を格納しているので、ダウンキャストする
    this.processedZodObject.set(name, inputType as InputObject<z.ZodRawShape>);
    return inputType;
  }

  /** Zod スキーマから inputType のフィールド一覧を生成する */
  private toInputFieldList<Object extends z.ZodRawShape>(zodSchema: z.ZodObject<Object>, path: string) {
    return (fb: InputFieldBuilder) => {
      const fields = {} as InputFieldList<Object>;
      if (zodSchema instanceof z.ZodObject) {
        const shapeEntries = Object.entries(zodSchema.shape) as [keyof InputShape<Object>, z.ZodTypeAny][];
        for (const [key, fieldSchema] of shapeEntries) {
          fields[key] = this.toInputField(fb, key.toString(), fieldSchema, path);
        }
      }
      return fields;
    };
  }

  /** Zod スキーマから inputType の個別フィールドを生成する */
  private toInputField(
    fb: InputFieldBuilder,
    fieldName: string,
    zodType: z.ZodTypeAny,
    path: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ): InputFieldRef<SchemaType, any> {
    const isOptional = zodType instanceof z.ZodOptional;
    const isNullable = zodType instanceof z.ZodNullable;
    const unwrapZodType = isOptional || isNullable ? zodType.unwrap() : zodType;

    return fb.field({
      type: this.toInputFieldType(fb, path, fieldName, resolveZotType(unwrapZodType)),
      required: !isOptional && !isNullable,
    });
  }

  /** Zod スキーマから inputType のGraphQLでの型を生成する */
  private toInputFieldType(
    fb: InputFieldBuilder,
    path: string,
    fieldName: string,
    { typeName, type }: ReturnType<typeof resolveZotType>,
  ): InputType<SchemaType> {
    switch (typeName) {
      case "string":
      case "date": // FIXME: date用の処理実装
        return "String";

      case "number":
        return type.isInt ? "Int" : "Float";

      case "boolean":
        return "Boolean";

      case "array":
        return fb.listRef(this.toInputFieldType(fb, path, fieldName, resolveZotType(type.element)));

      case "object":
        return this.toInputType(`${path}_${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`, type);

      case "enum":
        return this.sb.enumType(`${path}_${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`, {
          values: type.options,
        });

      case "unknown":
        // その他の型は string としてフォールバック
        console.warn(`Unsupported Zod type for ${fieldName}:`, type);
        return "String";
    }
  }
}

const resolveZotType = (
  zodType: z.ZodTypeAny,
):
  | { typeName: "string"; type: z.ZodString }
  | { typeName: "number"; type: z.ZodNumber }
  | { typeName: "boolean"; type: z.ZodBoolean }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  | { typeName: "enum"; type: z.ZodEnum<any> }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  | { typeName: "array"; type: z.ZodArray<any> }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  | { typeName: "object"; type: z.ZodObject<any> }
  | { typeName: "date"; type: z.ZodDate }
  | { typeName: "unknown"; type: z.ZodTypeAny } => {
  const isOptional = zodType instanceof z.ZodOptional;
  const isNullable = zodType instanceof z.ZodNullable;
  const innerType = isOptional || isNullable ? zodType.unwrap() : zodType;

  if (innerType instanceof z.ZodString) {
    return { typeName: "string", type: innerType };
  }

  if (innerType instanceof z.ZodNumber) {
    return { typeName: "number", type: innerType };
  }

  if (innerType instanceof z.ZodBoolean) {
    return { typeName: "boolean", type: innerType };
  }

  if (innerType instanceof z.ZodEnum) {
    return { typeName: "enum", type: innerType };
  }

  if (innerType instanceof z.ZodArray) {
    return { typeName: "array", type: innerType };
  }

  if (innerType instanceof z.ZodObject) {
    return { typeName: "object", type: innerType };
  }

  if (innerType instanceof z.ZodDate) {
    return { typeName: "date", type: innerType };
  }

  if (innerType instanceof z.ZodEffects) {
    return resolveZotType(innerType._def.schema);
  }

  return { typeName: "unknown", type: innerType };
};

type InputObject<T extends z.ZodRawShape> = InputObjectRef<
  SchemaType,
  RecursivelyNormalizeNullableFields<{
    [k in keyof z.objectUtil.addQuestionMarks<
      z.baseObjectOutputType<T>,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      any
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    >]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<T>, any>[k];
  }>
>;
type InputShape<T extends z.ZodRawShape> = RecursivelyNormalizeNullableFields<TypeOf<z.ZodObject<T>>>;
type InputFieldList<T extends z.ZodRawShape> = InputFieldsFromShape<SchemaType, InputShape<T>, "InputObject">;
type InputFieldBuilder = PothosSchemaTypes.InputFieldBuilder<SchemaType, "InputObject">;
