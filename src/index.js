const { createServer } = require("@graphql-yoga/node");
const fetch = require("node-fetch");

const baseUrl = "https://api.dexscreener.io/latest/dex";
// Provide your schema
const server = createServer({
  schema: {
    typeDefs: `
    type BaseToken {
      address: String!
      name: String!
      symbol: String!
    }
    
    type QuoteToken {
      symbol: String!
    }
    
    type BuySell {
      buys: Float!
      sells: Float!
    }
    
    type Transactions {
      m5: BuySell!
      h1: BuySell!
      h6: BuySell!
      h24: BuySell!
    }
    
    type PriceChange {
      m5: Float!
      h1: Float!
      h6: Float!
      h24: Float!
    }
    
    type Liquidity {
      usd: Float
      base: Float!
      quote: Float!
    }
    
    type Pair {
      chainId: String!
      dexId: String!
      url: String!
      pairAddress: String!
      baseToken: BaseToken!
      quoteToken: QuoteToken!
      priceNative: String!
      priceUsd: String
      txns: Transactions!
      volume: PriceChange!
      priceChange: PriceChange!
      liquidity: Liquidity!
      fdv: Float
      pairCreatedAt: Float!
    }
    
    type Search {
      schemaVersion: String!
      pairs: [Pair!]!
    }
    
    type Pairs {
      schemaVersion: String!
      pair: Pair!
    }
    
    type Tokens {
      schemaVersion: String!
      pairs: [Pair!]!
    }
    
    type Query {
      search(query: String!): Search!
      pairs(chainid: String!, pairAddress: String!): Pairs!
      tokens(tokenAddress: String!): Tokens!
    }
    
    `,
    resolvers: {
      Query: {
        search: (parent, args) => {
          return fetch(`${baseUrl}/search?q=${args.query}`).then((res) =>
            res.json()
          );
        },
        tokens: (parent, args) => {
          return fetch(
            `${baseUrl}/pairs/${args.chainid}/${args.pairAddress}`
          ).then((res) => res.json());
        },
        pairs: (parent, args) => {
          return fetch(`${baseUrl}/tokens/${args.tokenAddress}`).then((res) =>
            res.json()
          );
        },
      },
    },
  },
});
// Start the server and explore http://localhost:4000/graphql
server.start();
