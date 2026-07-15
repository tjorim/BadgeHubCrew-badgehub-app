import type { DBDatedData } from "@db/models/project/DBDatedData";
import type { AppMetadataJSON } from "@shared/domain/readModels/project/AppMetadataJSON";
import type { TimestampTZ } from "../DBTypes";
import type { ProjectSlugRelation } from "./DBProject";

export type VersionRelation<
  K extends string = "version_id",
  VC extends keyof DBInsertVersion = "id",
> = Record<K, DBInsertVersion[VC]>;

export interface DBInsertVersion extends ProjectSlugRelation {
  id: number;
  revision: number;
  blur_hash?: string;
  app_metadata: AppMetadataJSON; // JSON string of the app metadata
  zip?: string;
  size_of_zip?: number;
  git_commit_id?: string;
  published_at?: TimestampTZ;
  download_count?: number;
}

export interface DBVersion extends DBInsertVersion, DBDatedData {
  download_count: number;
}
