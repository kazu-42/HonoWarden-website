import { describe, expect, it } from 'vitest'

import app from '../src/index'

const RELEASE_NOTES_URL =
  'https://github.com/kazu-42/HonoWarden/releases/tag/v0.1.0-alpha'
const SECURITY_POLICY_URL =
  'https://github.com/kazu-42/HonoWarden/blob/main/SECURITY.md'
const SECURITY_CONTACT = 'mailto:security@honowarden.com'
const SECURITY_TXT_URL = 'https://honowarden.com/.well-known/security.txt'

describe('HonoWarden website', () => {
  it('renders the homepage', async () => {
    const response = await app.request('https://honowarden.com/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(html).toContain('<h1>HonoWarden</h1>')
    expect(html).toContain('Cloudflare Workers')
    expect(html).toContain('API only')
    expect(html).toContain('<link rel="icon" href="/favicon.svg"')
    expect(html).toContain('https://github.com/kazu-42/HonoWarden')
    expect(html).toContain(RELEASE_NOTES_URL)
    expect(html).toContain(SECURITY_POLICY_URL)
    expect(html).toContain(SECURITY_CONTACT)
    expect(html).toContain('/.well-known/security.txt')
  })

  it('sets defensive browser headers', async () => {
    const response = await app.request('https://honowarden.com/')

    expect(response.headers.get('x-frame-options')).toBe('DENY')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(response.headers.get('referrer-policy')).toBe(
      'strict-origin-when-cross-origin',
    )
    expect(response.headers.get('content-security-policy')).toContain(
      "default-src 'self'",
    )
  })

  it('exposes a health check', async () => {
    const response = await app.request('/health')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      status: 'ok',
      service: 'honowarden-website',
    })
  })

  it('serves robots and sitemap metadata', async () => {
    const robots = await app.request('/robots.txt')
    const sitemap = await app.request('/sitemap.xml')

    expect(robots.status).toBe(200)
    expect(await robots.text()).toContain(
      'Sitemap: https://honowarden.com/sitemap.xml',
    )
    expect(sitemap.status).toBe(200)
    expect(sitemap.headers.get('content-type')).toContain('application/xml')
    expect(await sitemap.text()).toContain('https://honowarden.com/')
  })

  it('serves coordinated disclosure metadata after email verification', async () => {
    const response = await app.request('/.well-known/security.txt')
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/plain')
    expect(response.headers.get('cache-control')).toContain('max-age=3600')
    expect(body).toContain(`Contact: ${SECURITY_CONTACT}`)
    expect(body).toContain(`Policy: ${SECURITY_POLICY_URL}`)
    expect(body).toContain('Preferred-Languages: en, ja')
    expect(body).toContain(`Canonical: ${SECURITY_TXT_URL}`)
    expect(body).toContain('Expires: 2027-07-08T00:00:00Z')
  })

  it('redirects the legacy security metadata path', async () => {
    const response = await app.request('/security.txt')

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe('/.well-known/security.txt')
  })

  it('serves favicon metadata without a browser 404', async () => {
    const response = await app.request('/favicon.ico')
    const svg = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('image/svg+xml')
    expect(response.headers.get('cache-control')).toContain('max-age=86400')
    expect(svg).toContain('<svg')
  })

  it('renders a structured 404 page', async () => {
    const response = await app.request('/missing')
    const html = await response.text()

    expect(response.status).toBe(404)
    expect(html).toContain('Page not found')
  })
})
