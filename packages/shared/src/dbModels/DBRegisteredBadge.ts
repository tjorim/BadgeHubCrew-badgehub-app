import { DBDatedData } from "@shared/dbModels/project/DBDatedData";
import { TimestampTZ } from "@shared/dbModels/DBTypes";

export interface DBRegisteredBadgeInsert {
  id: string;
  mac_address: string;
  badge_id: string;
  last_seen_at: TimestampTZ;
}

// table name: registered_badges
export interface DBRegisteredBadge
  extends DBRegisteredBadgeInsert,
    DBDatedData {}
