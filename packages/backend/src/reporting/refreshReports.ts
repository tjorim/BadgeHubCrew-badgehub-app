import { REFRESH_REPORTS_INTERVAL_SEC } from "@config";
import { PostgreSQLBadgeHubFiles } from "@db/PostgreSQLBadgeHubFiles";
import { PostgreSQLBadgeHubMetadata } from "@db/PostgreSQLBadgeHubMetadata";
import { BadgeHubData } from "@domain/BadgeHubData";

export const startRefreshReportsInterval = (
  badgeHubData: BadgeHubData = new BadgeHubData(
    new PostgreSQLBadgeHubMetadata(),
    new PostgreSQLBadgeHubFiles()
  )
) => {
  if (process.env.NODE_APP_INSTANCE && process.env.NODE_APP_INSTANCE !== "0") {
    return;
  }
  setInterval(() => {
    badgeHubData.refreshReports().catch((e) => {
      console.error("RefreshReportsInterval: refreshReports failed", e);
    });
  }, Number(REFRESH_REPORTS_INTERVAL_SEC) * 1000);
};
