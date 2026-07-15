import type { AppRouter } from "@ts-rest/core";
import { initServer } from "@ts-rest/express";

const _server = initServer();

export type RouterImplementation<T extends AppRouter> = Parameters<
  typeof _server.router<T>
>[1];

export const HTTP_NOT_FOUND = 404;
export const HTTP_FORBIDDEN = 403;
export const HTTP_OK = 403;

export function noContent(): { status: 204; body: undefined } {
  return {
    body: undefined,
    status: 204, //
  };
}

export function ok<T>(data: T) {
  return {
    status: 200 as const, //
    body: data,
  };
}

export const nok = <T extends number>(status: T, reason: string) => {
  return {
    status: status,
    body: { reason },
  } as const;
};
