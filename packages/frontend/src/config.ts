export * from "@shared/config/sharedConfig.ts";

export const REPO_URL = "https://github.com/badgehubcrew/badgehub-app";
export const BADGEHUB_FRONTEND_BASE_URL =
  globalThis.document?.location?.origin ?? "";
export const APP_GRID_PAGE_SIZE = 12;
export const FALLBACK_ICON_URL = `${BADGEHUB_FRONTEND_BASE_URL}/assets/no-icon-uploaded.png`;
export const ERROR_ICON_URL = `${BADGEHUB_FRONTEND_BASE_URL}/assets/no-icon-uploaded.png`;
