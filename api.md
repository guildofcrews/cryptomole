# CryptoMole API Documentation

## Authentication

All API endpoints require Bearer token authentication via the `INGEST_API_KEY` environment variable.

```
Authorization: Bearer <your-api-key>
```

---

## Endpoints

### POST /api/posts

Create a new post (as draft).

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `coinSlug` | string | Yes* | Primary coin slug (see list below) |
| `coinSlugs` | string[] | No | Array of coin slugs for multi-coin posts. First slug becomes primary. |
| `title` | string | Yes | Post title |
| `summary` | string | No | Short summary |
| `body` | string | No | Full post body (Markdown supported) |
| `sourceType` | string | No | One of: `x`, `inbox`, `blog`, `call`, `announcement`, `other` (default: `other`) |
| `sourceUrl` | string | No | URL to the original source |
| `publishedAt` | string | No | ISO 8601 timestamp (default: now) |
| `topics` | string[] | No | Regulatory topics: `regulation`, `etf`, `legislation`, `stablecoin-reg` |

*Either `coinSlug` or `coinSlugs[0]` is required.

#### Example: Single-coin post

```json
{
  "coinSlug": "bitcoin",
  "title": "SEC Approves Spot Bitcoin ETF",
  "summary": "The SEC has approved the first spot Bitcoin ETF.",
  "sourceType": "announcement",
  "sourceUrl": "https://example.com/article",
  "topics": ["etf", "regulation"]
}
```

#### Example: Multi-coin post

```json
{
  "coinSlugs": ["bitcoin", "ethereum", "solana"],
  "title": "Major Exchange Adds Support for BTC, ETH, SOL",
  "summary": "Three major cryptocurrencies now supported.",
  "sourceType": "blog"
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Post created as draft. It will be visible after approval.",
  "post": {
    "id": "uuid",
    "title": "...",
    "status": "draft",
    "coinSlug": "bitcoin",
    "coinSlugs": ["bitcoin", "ethereum", "solana"],
    "topics": ["etf", "regulation"]
  }
}
```

---

### GET /api/posts

List posts with optional filters.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `draft`, `approved`, `rejected` |
| `coin` | string | Filter by primary coin slug |

#### Example

```
GET /api/posts?status=approved&coin=bitcoin
```

#### Response

```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "...",
      "summary": "...",
      "sourceType": "x",
      "sourceUrl": "...",
      "publishedAt": "2026-10-21T00:00:00.000Z",
      "status": "approved",
      "topics": ["regulation"],
      "createdAt": "...",
      "coinSlug": "bitcoin",
      "coinName": "Bitcoin",
      "coinTicker": "BTC"
    }
  ]
}
```

---

## Valid Topics

Posts can be tagged with regulatory/macro topics:

- `regulation` - General regulatory news
- `etf` - ETF-related news (approvals, filings, flows)
- `legislation` - Legislative developments
- `stablecoin-reg` - Stablecoin regulation

---

## Coin Classes

Each coin has a `coinClass` indicating how news is sourced:

| Class | Description |
|-------|-------------|
| `project` | Team-driven news; poll per-coin source maps |
| `macro` | News driven by shared macro/regulatory sources |
| `macro+project` | Both macro and project news |
| `issuer` | Issuer of stablecoins/tokenized assets |

---

## Supported Coin Slugs (70 total)

### Layer 1 / Layer 2 (`l1-l2`)
- `bitcoin` (BTC) - macro
- `ethereum` (ETH) - macro+project
- `solana` (SOL) - macro+project
- `arbitrum` (ARB) - project
- `optimism` (OP) - project
- `polygon` (POL) - project
- `starknet` (STRK) - project
- `sui` (SUI) - project

### Oracles & Interop (`oracles-interop`)
- `chainlink` (LINK) - project
- `layerzero` (ZRO) - project
- `wormhole` (W) - project

### AI (`ai`)
- `render` (RENDER) - project
- `akash` (AKT) - project
- `venice` (VVV) - project
- `ionet` (IO) - project
- `bittensor` (TAO) - project
- `fetch` (FET) - project
- `virtuals` (VIRTUAL) - project
- `near` (NEAR) - project
- `aethir` (ATH) - project
- `elizaos` (ELIZAOS) - project
- `grass` (GRASS) - project

### DePIN (`depin`)
- `filecoin` (FIL) - project
- `helium` (HNT) - project
- `arweave` (AR) - project
- `hivemapper` (HONEY) - project

### DeFi (`defi`)
- `aave` (AAVE) - project
- `uniswap` (UNI) - project
- `curve` (CRV) - project
- `pendle` (PENDLE) - project
- `hyperliquid` (HYPE) - project
- `lido` (LDO) - project
- `jito` (JTO) - project
- `eigenlayer` (EIGEN) - project
- `morpho` (MORPHO) - project
- `jupiter` (JUP) - project
- `dydx` (DYDX) - project

### Real-World Assets (`rwa`)
- `ondo` (ONDO) - issuer
- `centrifuge` (CFG) - issuer
- `plume` (PLUME) - issuer
- `maple` (SYRUP) - issuer
- `mantra` (OM) - issuer

### Stablecoins (`stablecoins`)
- `tether` (USDT) - issuer
- `usdc` (USDC) - issuer
- `ethena` (USDe) - issuer
- `pyusd` (PYUSD) - issuer
- `sky` (SKY) - issuer

### Gaming/Metaverse (`gaming`)
- `immutable` (IMX) - project
- `gala` (GALA) - project
- `sandbox` (SAND) - project
- `axie` (AXS) - project
- `ronin` (RON) - project
- `beam` (BEAM) - project
- `treasure` (MAGIC) - project

### NFTs/Digital Collectibles (`nfts`)
- `blur` (BLUR) - project
- `apecoin` (APE) - project
- `pudgypenguins` (PENGU) - project

### SocialFi/Creator Economy (`socialfi`)
- `degen` (DEGEN) - project
- `cyber` (CYBER) - project
- `farcaster` (—) - project

### Privacy (`privacy`)
- `monero` (XMR) - project
- `zcash` (ZEC) - project
- `secret` (SCRT) - project
- `oasis` (ROSE) - project

### Identity/Reputation (`identity`)
- `world` (WLD) - project
- `ens` (ENS) - project
- `gitcoin` (GTC) - project

### Storage/Data (`storage-data`)
- `storj` (STORJ) - project
- `thegraph` (GRT) - project
- `walrus` (WAL) - project

---

## Categories (13 total)

| Slug | Name |
|------|------|
| `ai` | AI |
| `depin` | DePIN |
| `defi` | DeFi |
| `rwa` | Real-World Assets |
| `stablecoins` | Stablecoins |
| `gaming` | Gaming/Metaverse |
| `nfts` | NFTs/Digital Collectibles |
| `socialfi` | SocialFi/Creator Economy |
| `privacy` | Privacy |
| `identity` | Identity/Reputation |
| `storage-data` | Storage/Data |
| `l1-l2` | Layer 1 / Layer 2 |
| `oracles-interop` | Oracles & Interop |

---

## Error Responses

| Status | Description |
|--------|-------------|
| 400 | Bad request (missing fields, invalid values) |
| 401 | Unauthorized (missing or invalid API key) |
| 404 | Coin slug not found |
| 500 | Internal server error |
| 503 | API not configured (INGEST_API_KEY not set) |
