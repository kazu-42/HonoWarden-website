# HonoWarden Website

Homepage for HonoWarden, served by a Hono app on Cloudflare Workers.

## Local Development

```sh
pnpm install
pnpm dev
```

## Checks

```sh
pnpm check
pnpm lint
pnpm test
pnpm format
```

## Deploy

```sh
npx wrangler whoami
pnpm deploy
```

The Worker is configured for:

- `https://honowarden.com/*`
- `https://www.honowarden.com/*`
- Workers preview on the account workers.dev subdomain

## Email Routing

Cloudflare Email Routing requires the domain to use Cloudflare authoritative nameservers and requires an API token or OAuth session with Email Routing write permissions.

Recommended initial aliases:

- `hello@honowarden.com`
- `security@honowarden.com`
- `admin@honowarden.com`

Do not publish these addresses until the destination mailbox is verified and routing has been tested.
