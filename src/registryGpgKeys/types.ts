import {
  WhereClause,
  StringComparisonExp,
  DateTimeComparisonExp,
} from "../common/filtering/types";
import {
  ResourceObject,
  ListResponse,
  SingleResponse,
} from "../common/types/jsonApi";

export interface RegistryGpgKeyAttributes {
  "ascii-armor": string;
  "created-at": string;
  "key-id": string;
  namespace: string;
  source: string;
  "source-url": string | null;
  "trust-signature": string;
  "updated-at": string;
}

export type RegistryGpgKeyResource =
  ResourceObject<RegistryGpgKeyAttributes>;

export type RegistryGpgKeyResponse = SingleResponse<RegistryGpgKeyResource>;
export type RegistryGpgKeyListResponse = ListResponse<RegistryGpgKeyResource>;

export interface RegistryGpgKey {
  id: string;
  asciiArmor: string;
  createdAt: string;
  keyId: string;
  namespace: string;
  source: string;
  sourceUrl: string | null;
  trustSignature: string;
  updatedAt: string;
}

export interface RegistryGpgKeyFilter extends WhereClause<RegistryGpgKey> {
  _and?: RegistryGpgKeyFilter[];
  _or?: RegistryGpgKeyFilter[];
  _not?: RegistryGpgKeyFilter;

  id?: StringComparisonExp;
  keyId?: StringComparisonExp;
  namespace?: StringComparisonExp;
  source?: StringComparisonExp;
  createdAt?: DateTimeComparisonExp;
  updatedAt?: DateTimeComparisonExp;
}
