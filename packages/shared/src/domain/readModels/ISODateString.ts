import { z } from "zod/v4";

export const isoDateStringSchema = z.templateLiteral([
  z.string(),
  ".",
  z.int(),
  "Z",
]);
export type ISODateString = `${string}.${number}Z`;
