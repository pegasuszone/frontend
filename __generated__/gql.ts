/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Name($name: String!) {\n    name(name: $name) {\n      associatedAddr\n    }\n  }\n": types.NameDocument,
    "\n  query OwnedTokens(\n    $owner: String\n    $limit: Int\n    $offset: Int\n    $filterByCollectionAddrs: [String!]\n  ) {\n    tokens(\n      ownerAddrOrName: $owner\n      limit: $limit\n      offset: $offset\n      filterByCollectionAddrs: $filterByCollectionAddrs\n    ) {\n      tokens {\n        id\n        tokenId\n        name\n        owner {\n          address\n        }\n        media {\n          type\n          height\n          width\n          visualAssets {\n            lg {\n              type\n              url\n              height\n              width\n              staticUrl\n            }\n          }\n        }\n        collection {\n          contractAddress\n          contractUri\n          name\n          floorPrice\n          media {\n            type\n            height\n            width\n            visualAssets {\n              lg {\n                type\n                url\n                height\n                width\n                staticUrl\n              }\n            }\n          }\n          tokenCounts {\n            active\n            total\n          }\n          mintStatus\n        }\n      }\n      pageInfo {\n        total\n        limit\n        offset\n      }\n    }\n  }\n": types.OwnedTokensDocument,
    "\n  query ProfileWallet($address: String!) {\n    wallet(address: $address) {\n      address\n      name {\n        name\n        associatedAddr\n        media {\n          type\n          height\n          width\n          visualAssets {\n            lg {\n              type\n              url\n              height\n              width\n              staticUrl\n            }\n          }\n        }\n        records {\n          name\n          value\n          verified\n        }\n      }\n      stats {\n        address\n      }\n    }\n  }\n": types.ProfileWalletDocument,
    "\n  query Token($collectionAddr: String!, $tokenId: String!) {\n    token(collectionAddr: $collectionAddr, tokenId: $tokenId) {\n      id\n      tokenId\n      name\n      owner {\n        address\n      }\n      collection {\n        name\n      }\n      media {\n        type\n        height\n        width\n        visualAssets {\n          lg {\n            type\n            url\n            height\n            width\n            staticUrl\n          }\n        }\n      }\n    }\n  }\n": types.TokenDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Name($name: String!) {\n    name(name: $name) {\n      associatedAddr\n    }\n  }\n"): (typeof documents)["\n  query Name($name: String!) {\n    name(name: $name) {\n      associatedAddr\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query OwnedTokens(\n    $owner: String\n    $limit: Int\n    $offset: Int\n    $filterByCollectionAddrs: [String!]\n  ) {\n    tokens(\n      ownerAddrOrName: $owner\n      limit: $limit\n      offset: $offset\n      filterByCollectionAddrs: $filterByCollectionAddrs\n    ) {\n      tokens {\n        id\n        tokenId\n        name\n        owner {\n          address\n        }\n        media {\n          type\n          height\n          width\n          visualAssets {\n            lg {\n              type\n              url\n              height\n              width\n              staticUrl\n            }\n          }\n        }\n        collection {\n          contractAddress\n          contractUri\n          name\n          floorPrice\n          media {\n            type\n            height\n            width\n            visualAssets {\n              lg {\n                type\n                url\n                height\n                width\n                staticUrl\n              }\n            }\n          }\n          tokenCounts {\n            active\n            total\n          }\n          mintStatus\n        }\n      }\n      pageInfo {\n        total\n        limit\n        offset\n      }\n    }\n  }\n"): (typeof documents)["\n  query OwnedTokens(\n    $owner: String\n    $limit: Int\n    $offset: Int\n    $filterByCollectionAddrs: [String!]\n  ) {\n    tokens(\n      ownerAddrOrName: $owner\n      limit: $limit\n      offset: $offset\n      filterByCollectionAddrs: $filterByCollectionAddrs\n    ) {\n      tokens {\n        id\n        tokenId\n        name\n        owner {\n          address\n        }\n        media {\n          type\n          height\n          width\n          visualAssets {\n            lg {\n              type\n              url\n              height\n              width\n              staticUrl\n            }\n          }\n        }\n        collection {\n          contractAddress\n          contractUri\n          name\n          floorPrice\n          media {\n            type\n            height\n            width\n            visualAssets {\n              lg {\n                type\n                url\n                height\n                width\n                staticUrl\n              }\n            }\n          }\n          tokenCounts {\n            active\n            total\n          }\n          mintStatus\n        }\n      }\n      pageInfo {\n        total\n        limit\n        offset\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ProfileWallet($address: String!) {\n    wallet(address: $address) {\n      address\n      name {\n        name\n        associatedAddr\n        media {\n          type\n          height\n          width\n          visualAssets {\n            lg {\n              type\n              url\n              height\n              width\n              staticUrl\n            }\n          }\n        }\n        records {\n          name\n          value\n          verified\n        }\n      }\n      stats {\n        address\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProfileWallet($address: String!) {\n    wallet(address: $address) {\n      address\n      name {\n        name\n        associatedAddr\n        media {\n          type\n          height\n          width\n          visualAssets {\n            lg {\n              type\n              url\n              height\n              width\n              staticUrl\n            }\n          }\n        }\n        records {\n          name\n          value\n          verified\n        }\n      }\n      stats {\n        address\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Token($collectionAddr: String!, $tokenId: String!) {\n    token(collectionAddr: $collectionAddr, tokenId: $tokenId) {\n      id\n      tokenId\n      name\n      owner {\n        address\n      }\n      collection {\n        name\n      }\n      media {\n        type\n        height\n        width\n        visualAssets {\n          lg {\n            type\n            url\n            height\n            width\n            staticUrl\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Token($collectionAddr: String!, $tokenId: String!) {\n    token(collectionAddr: $collectionAddr, tokenId: $tokenId) {\n      id\n      tokenId\n      name\n      owner {\n        address\n      }\n      collection {\n        name\n      }\n      media {\n        type\n        height\n        width\n        visualAssets {\n          lg {\n            type\n            url\n            height\n            width\n            staticUrl\n          }\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;