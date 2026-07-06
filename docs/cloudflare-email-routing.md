# Cloudflare Email Routing Plan

Domain: `honowarden.com`

## Intended Initial Routes

| Address                   | Purpose                           | Destination         |
| ------------------------- | --------------------------------- | ------------------- |
| `hello@honowarden.com`    | General project contact           | `ghive42@gmail.com` |
| `security@honowarden.com` | Coordinated vulnerability reports | `ghive42@gmail.com` |
| `admin@honowarden.com`    | Domain and service operations     | `ghive42@gmail.com` |

## Required Cloudflare Permissions

- Zone read for `honowarden.com`
- DNS edit for MX and SPF records when Email Routing is enabled
- Email Routing write for destination address and routing rules

## Setup Checklist

1. Verify that `honowarden.com` is active in the gHive Cloudflare account.
2. Enable Email Routing for the zone.
3. Add `ghive42@gmail.com` as a destination address.
4. Open the verification email and confirm the destination.
5. Add route rules for `hello`, `security`, and `admin`.
6. Confirm Cloudflare-created MX records:
   - `isaac.mx.cloudflare.net`
   - `linda.mx.cloudflare.net`
   - `amir.mx.cloudflare.net`
7. Confirm SPF TXT includes `_spf.mx.cloudflare.net`.
8. Send inbound tests to each alias and verify delivery.

## Current Automation Status

Status snapshot (as documented in this repo): the local Wrangler OAuth session can deploy Workers and manage Worker Custom Domains, but it is missing Email Routing permission.

Observed commands and current evidence:

```sh
npx wrangler whoami
npx wrangler email routing list
npx wrangler email routing settings honowarden.com
```

Current result:

- `wrangler whoami`: `email_routing:write` is not present in the session scopes.
- `email routing list`: no zones found with Email Routing enabled.
- `email routing settings honowarden.com`: `Authentication error 10000` because the OAuth token is missing `email_routing:write`.

Run `npx wrangler login` again and grant Email Routing scopes, or provide a scoped Cloudflare API token with Email Routing write permission before automating the checklist.

## Resume Commands After Permission Refresh

After `wrangler whoami` shows `email_routing:write`, run:

```sh
npx wrangler email routing enable honowarden.com
npx wrangler email routing addresses create ghive42@gmail.com
```

Open the verification email sent to `ghive42@gmail.com`, then create the routes:

```sh
npx wrangler email routing rules create honowarden.com --name hello --match-type literal --match-field to --match-value hello@honowarden.com --action-type forward --action-value ghive42@gmail.com
npx wrangler email routing rules create honowarden.com --name security --match-type literal --match-field to --match-value security@honowarden.com --action-type forward --action-value ghive42@gmail.com
npx wrangler email routing rules create honowarden.com --name admin --match-type literal --match-field to --match-value admin@honowarden.com --action-type forward --action-value ghive42@gmail.com
npx wrangler email routing dns get honowarden.com
```
