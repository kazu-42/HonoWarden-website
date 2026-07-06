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

The local Wrangler OAuth session can deploy Workers, but it is missing Email Routing write permission. Run `npx wrangler login` again or provide a scoped Cloudflare API token with Email Routing write permission before automating the checklist.
