import { privateRestContracts } from "@shared/contracts/privateRestContracts";
import { publicRestContracts } from "@shared/contracts/publicRestContracts";
import { initContract } from "@ts-rest/core";

const c = initContract();

export const tsRestApiContracts = c.router({
  ...privateRestContracts,
  ...publicRestContracts,
});
