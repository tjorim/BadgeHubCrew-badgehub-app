import type Keycloak from "keycloak-js";
import React, { use } from "react";

export interface User {
  name: string;
  email: string;
  id: string;
}

interface SessionContextType {
  user?: User;
  keycloak?: Keycloak;
}

export const SessionContext = React.createContext<SessionContextType>({});
export const useSession = () => use(SessionContext);
