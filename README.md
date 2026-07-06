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

- `https://honowarden.com`
- `https://www.honowarden.com`
- Workers preview on the account workers.dev subdomain

## Cloudflare Operations

Quick links:

- [Deployment state and validation](docs/cloudflare-deployment.md)
- [Email Routing plan and permissions](docs/cloudflare-email-routing.md)

For the current operator path and known blockers (DNS propagation lag, missing Email Routing permission), see the docs above.
