/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.11.1.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type ExecuteMsg = {
  create_offer: {
    expires_at?: Timestamp | null;
    offered_nfts: TokenMsg[];
    peer: string;
    wanted_nfts: TokenMsg[];
    [k: string]: unknown;
  };
} | {
  remove_offer: {
    id: number;
    [k: string]: unknown;
  };
} | {
  accept_offer: {
    id: number;
    [k: string]: unknown;
  };
} | {
  reject_offer: {
    id: number;
    [k: string]: unknown;
  };
} | {
  remove_stale_offer: {
    id: number;
    [k: string]: unknown;
  };
};
export type Timestamp = Uint64;
export type Uint64 = string;
export interface TokenMsg {
  collection: string;
  token_id: number;
  [k: string]: unknown;
}
export interface InstantiateMsg {
  bundle_limit: number;
  maintainer: string;
  max_offers: number;
  offer_expiry: ExpiryRange;
  [k: string]: unknown;
}
export interface ExpiryRange {
  max: number;
  min: number;
  [k: string]: unknown;
}
export type Addr = string;
export interface OfferResponse {
  offer?: Offer | null;
  [k: string]: unknown;
}
export interface Offer {
  created_at: Timestamp;
  expires_at: Timestamp;
  id: number;
  offered_nfts: Token[];
  peer: Addr;
  sender: Addr;
  wanted_nfts: Token[];
  [k: string]: unknown;
}
export interface Token {
  collection: Addr;
  token_id: number;
  [k: string]: unknown;
}
export interface OffersResponse {
  offers: Offer[];
  [k: string]: unknown;
}
export interface ParamsResponse {
  params: SudoParams;
  [k: string]: unknown;
}
export interface SudoParams {
  bundle_limit: number;
  maintainer: Addr;
  max_offers: number;
  offer_expiry: ExpiryRange;
  [k: string]: unknown;
}
export type QueryMsg = {
  offer: {
    id: number;
    [k: string]: unknown;
  };
} | {
  offers_by_sender: {
    sender: string;
    [k: string]: unknown;
  };
} | {
  offers_by_peer: {
    peer: string;
    [k: string]: unknown;
  };
} | {
  params: {
    [k: string]: unknown;
  };
};