import { z } from "zod/v3";
import { getSharedConfig } from "@shared/config/sharedConfig";

export const categoryNameSchema = z.enum(getCategoryNames());
export type CategoryName = string;

export function getCategoryNames(): [CategoryName, ...CategoryName[]] {
  return getSharedConfig().categories;
}
