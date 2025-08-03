import { z } from "zod";
import { __tsCheckSame } from "@shared/zodUtils/zodTypeComparison";

export type ProjectApiTokenMetadata = {
  created_at: Date;
  last_used_at: Date;
};

export const projectApiTokenMetadataSchema = z
  .object({
    created_at: z.date(),
    last_used_at: z.date(),
  })
  .describe(`Metadata about the token.`);

__tsCheckSame<
  ProjectApiTokenMetadata,
  ProjectApiTokenMetadata,
  z.infer<typeof projectApiTokenMetadataSchema>
>(true);
