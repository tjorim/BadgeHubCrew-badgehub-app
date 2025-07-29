import Keycloak from "keycloak-js";

async function getFreshToken(keycloak: Keycloak | undefined) {
  await keycloak?.updateToken(30);
  return keycloak?.token;
}

export async function getAuthorizationHeader(keycloak: Keycloak | undefined) {
  return { authorization: `Bearer ${await getFreshToken(keycloak)}` };
}