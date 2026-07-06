# Cloudflare Deployment

Worker: `honowarden-website`

Cloudflare account:

- Account name: `gHive`
- Account ID: `7e31a4cfe4ffd2cfff49c04236261de8`
- Zone: `honowarden.com`
- Zone ID: `f943f9ad49c08ef28fe641cf9277b1ed`

## Production Domains

The Worker is configured with Workers Custom Domains:

- `honowarden.com`
- `www.honowarden.com`

The Wrangler config uses `custom_domain: true` so Cloudflare treats the Worker as the origin for each hostname.

## Latest Manual Deploy

```sh
pnpm deploy
```

Latest verified deployment:

- Version ID: `3db432cb-6422-4311-b558-6eb2b0b5bb51`
- Deployed at: `2026-07-06T12:25:16Z`

Authoritative Cloudflare DNS servers returned A/AAAA records for `honowarden.com` after the deploy. Local resolvers may temporarily cache the previous NXDOMAIN state.

## Verification

```sh
npx wrangler whoami
```

If you are troubleshooting permissions, confirm the session is on the `gHive` account before rerunning email-routing commands.

```sh
pnpm check
pnpm lint
pnpm test
pnpm format
```

Live response was verified with `curl --resolve` while local DNS propagation was still catching up:

```sh
curl --resolve honowarden.com:443:104.21.63.78 https://honowarden.com/
curl --resolve honowarden.com:443:104.21.63.78 https://honowarden.com/favicon.ico
curl --resolve www.honowarden.com:443:104.21.63.78 https://www.honowarden.com/
```

The latest deployment was also verified to return the `/health` JSON response and the favicon route with `Content-Type: image/svg+xml`.
