# Cloudflare Email Routing Plan

Domain: `honowarden.com`

## Intended Initial Routes

| Address                     | Purpose                           | Destination                         |
| --------------------------- | --------------------------------- | ----------------------------------- |
| `hello@honowarden.com`      | General project contact           | `<verified-forwarding-destination>` |
| `security@honowarden.com`   | Coordinated vulnerability reports | `<verified-forwarding-destination>` |
| `admin@honowarden.com`      | Domain and service operations     | `<verified-forwarding-destination>` |
| `support@honowarden.com`    | Product and user support          | `<verified-forwarding-destination>` |
| `postmaster@honowarden.com` | RFC and mailbox diagnostics       | `<verified-forwarding-destination>` |
| `abuse@honowarden.com`      | Abuse and policy reports          | `<verified-forwarding-destination>` |

Cloudflare Email Routing is forwarding-only. It does not provide an inbox or mailbox UI, so each alias simply forwards into an external destination mailbox (currently `<verified-forwarding-destination>`) that holds the actual mail.

## Required Cloudflare Permissions

- Zone read for `honowarden.com`
- DNS edit for MX and SPF records when Email Routing is enabled
- Email Routing write for destination address and routing rules

## Setup Checklist

1. Verify that `honowarden.com` is active in the gHive Cloudflare account.
2. Enable Email Routing for the zone.
3. Add `<verified-forwarding-destination>` as a destination address.
4. Open the verification email and confirm the destination.
5. Add route rules for `hello`, `security`, `admin`, `support`, `postmaster`, and `abuse`.
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
npx wrangler email routing addresses list
```

Current result:

- `wrangler whoami`: `email_routing:write` is not present in the session scopes.
- `email routing list`: no zones found with Email Routing enabled.
- `email routing settings honowarden.com`: `Authentication error 10000` because the OAuth token is missing `email_routing:write`.
- `email routing addresses list`: `Authentication error 10000` for the same reason, even though the account membership is Super Administrator.

Run `npx wrangler login` again and grant Email Routing scopes, or provide a scoped Cloudflare API token with Email Routing write permission before automating the checklist.

## Public Contact Gate

Do not deploy website changes that advertise `security@honowarden.com` as an active vulnerability reporting mailbox until:

1. `wrangler whoami` shows `email_routing:write`, or an equivalent scoped API token is active.
2. Email Routing is enabled for `honowarden.com`.
3. `<verified-forwarding-destination>` is verified as a destination address.
4. The `security@honowarden.com` route exists.
5. An inbound test message to `security@honowarden.com` is received at the destination mailbox.

## Resume Commands After Permission Refresh

After `wrangler whoami` shows `email_routing:write`, run:

```sh
npx wrangler email routing enable honowarden.com
npx wrangler email routing addresses create <verified-forwarding-destination>
```

Open the verification email sent to `<verified-forwarding-destination>`, then create the routes:

```sh
npx wrangler email routing rules create honowarden.com --name hello --match-type literal --match-field to --match-value hello@honowarden.com --action-type forward --action-value <verified-forwarding-destination>
npx wrangler email routing rules create honowarden.com --name security --match-type literal --match-field to --match-value security@honowarden.com --action-type forward --action-value <verified-forwarding-destination>
npx wrangler email routing rules create honowarden.com --name admin --match-type literal --match-field to --match-value admin@honowarden.com --action-type forward --action-value <verified-forwarding-destination>
npx wrangler email routing rules create honowarden.com --name support --match-type literal --match-field to --match-value support@honowarden.com --action-type forward --action-value <verified-forwarding-destination>
npx wrangler email routing rules create honowarden.com --name postmaster --match-type literal --match-field to --match-value postmaster@honowarden.com --action-type forward --action-value <verified-forwarding-destination>
npx wrangler email routing rules create honowarden.com --name abuse --match-type literal --match-field to --match-value abuse@honowarden.com --action-type forward --action-value <verified-forwarding-destination>
npx wrangler email routing dns get honowarden.com
```
