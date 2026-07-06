import { describe, expect, it } from 'vitest'

import app from '../src/index'

describe('HonoWarden website', () => {
  it('renders the homepage', async () => {
    const response = await app.request('https://honowarden.com/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(html).toContain('<h1>HonoWarden</h1>')
    expect(html).toContain('Cloudflare Workers')
    expect(html).toContain('API only')
    expect(html).toContain('https://github.com/kazu-42/HonoWarden')
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

  it('renders a structured 404 page', async () => {
    const response = await app.request('/missing')
    const html = await response.text()

    expect(response.status).toBe(404)
    expect(html).toContain('Page not found')
  })
})
