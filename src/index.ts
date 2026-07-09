import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()

const REPOSITORY_URL = 'https://github.com/kazu-42/HonoWarden'
const RELEASE_NOTES_URL = `${REPOSITORY_URL}/releases/tag/v0.1.0-alpha`
const SECURITY_POLICY_URL = `${REPOSITORY_URL}/blob/main/SECURITY.md`
const SECURITY_CONTACT_EMAIL = 'security@honowarden.com'
const SECURITY_CONTACT_MAILTO = `mailto:${SECURITY_CONTACT_EMAIL}`
const SECURITY_TXT_URL = 'https://honowarden.com/.well-known/security.txt'

app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    xFrameOptions: 'DENY',
  }),
)

app.get('/', (c) => {
  return c.html(buildHomePage())
})

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'honowarden-website',
  })
})

app.get('/favicon.svg', (c) => {
  return c.body(faviconSvg(), 200, {
    'Cache-Control': 'public, max-age=86400',
    'Content-Type': 'image/svg+xml; charset=utf-8',
  })
})

app.get('/favicon.ico', (c) => {
  return c.body(faviconSvg(), 200, {
    'Cache-Control': 'public, max-age=86400',
    'Content-Type': 'image/svg+xml; charset=utf-8',
  })
})

app.get('/robots.txt', (c) => {
  return c.text(
    [
      'User-agent: *',
      'Allow: /',
      'Sitemap: https://honowarden.com/sitemap.xml',
      '',
    ].join('\n'),
  )
})

app.get('/.well-known/security.txt', (c) => {
  return c.text(securityTxt(), 200, {
    'Cache-Control': 'public, max-age=3600',
    'Content-Type': 'text/plain; charset=utf-8',
  })
})

app.get('/security.txt', (c) => {
  return c.redirect('/.well-known/security.txt', 308)
})

app.get('/sitemap.xml', (c) => {
  return c.body(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://honowarden.com/</loc>
    <changefreq>weekly</changefreq>
  </url>
</urlset>
`,
    200,
    {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  )
})

app.notFound((c) => {
  return c.html(buildNotFoundPage(), 404)
})

function buildHomePage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HonoWarden</title>
    <meta
      name="description"
      content="HonoWarden is a minimal API-only encrypted vault sync server for Cloudflare Workers."
    />
    <meta property="og:title" content="HonoWarden" />
    <meta
      property="og:description"
      content="A minimal API-only encrypted vault sync server for personal and small-team use."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://honowarden.com/" />
    <meta name="theme-color" content="#0f2d2e" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="alternate icon" href="/favicon.ico" />
    <style>${styles()}</style>
  </head>
  <body>
    <header class="site-header" aria-label="Primary">
      <a class="brand" href="/" aria-label="HonoWarden home">
        <span class="brand-mark" aria-hidden="true">H</span>
        <span>HonoWarden</span>
      </a>
      <nav aria-label="Project links">
        <a href="${REPOSITORY_URL}">Repository</a>
        <a href="#status">Status</a>
        <a href="#scope">Scope</a>
        <a href="#security">Security</a>
      </nav>
    </header>
    <main>
      <section class="hero">
        <div class="hero-visual" aria-hidden="true">
          <span class="trace trace-a"></span>
          <span class="trace trace-b"></span>
          <span class="trace trace-c"></span>
          <span class="node node-a"></span>
          <span class="node node-b"></span>
          <span class="node node-c"></span>
          <span class="node node-d"></span>
          <span class="pulse pulse-a"></span>
          <span class="pulse pulse-b"></span>
        </div>
        <div class="hero-inner">
          <p class="eyebrow">Cloudflare-native encrypted vault sync</p>
          <h1>HonoWarden</h1>
          <p class="lede">
            A minimal API-only server for personal and small-team vault sync,
            built with Hono, Cloudflare Workers, D1, and R2.
          </p>
          <div class="hero-actions" aria-label="Primary actions">
            <a class="button primary" href="${REPOSITORY_URL}">View source</a>
            <a class="button secondary" href="#scope">Read scope</a>
            <a class="button secondary" href="${SECURITY_CONTACT_MAILTO}">Security contact</a>
          </div>
          <dl class="signal-list" aria-label="Project signals">
            <div>
              <dt>Runtime</dt>
              <dd>Workers</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>D1 + R2</dd>
            </div>
            <div>
              <dt>Surface</dt>
              <dd>API only</dd>
            </div>
          </dl>
        </div>
      </section>

      <section class="band" id="status">
        <div class="section-inner two-column">
          <div>
            <p class="section-kicker">Current status</p>
            <h2>Pre-alpha, built in verifiable increments.</h2>
          </div>
          <div class="status-panel">
            <div class="status-row">
              <span>Account bootstrap</span>
              <strong>Restricted</strong>
            </div>
            <div class="status-row">
              <span>Token rotation</span>
              <strong>Implemented</strong>
            </div>
            <div class="status-row">
              <span>Folder and item sync</span>
              <strong>In progress</strong>
            </div>
            <div class="status-row">
              <span>Public registration</span>
              <strong>Disabled</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="section-inner" id="scope">
        <p class="section-kicker">Initial scope</p>
        <h2>Small surface, explicit boundaries.</h2>
        <div class="feature-grid" aria-label="Initial project scope">
          <article>
            <span class="feature-number">01</span>
            <h3>Personal vault sync</h3>
            <p>Focuses on one user or a small allowlisted group before broader collaboration features.</p>
          </article>
          <article>
            <span class="feature-number">02</span>
            <h3>Opaque encrypted payloads</h3>
            <p>Stores encrypted client payloads without server-side decryption or plaintext vault fields.</p>
          </article>
          <article>
            <span class="feature-number">03</span>
            <h3>Cloudflare deploy path</h3>
            <p>Targets Workers, D1, and R2 so the operational model stays compact and reproducible.</p>
          </article>
        </div>
      </section>

      <section class="band final-band">
        <div class="section-inner closing" id="security">
          <div>
            <p class="section-kicker">Security</p>
            <h2>Open development, security-first defaults.</h2>
            <p class="closing-copy">
              Report vulnerabilities privately before opening public issues.
              The verified disclosure mailbox and machine-readable security
              metadata are active for coordinated reports.
            </p>
          </div>
          <div class="closing-actions" aria-label="Security and project links">
            <a class="button primary" href="${SECURITY_CONTACT_MAILTO}">Email security</a>
            <a class="button secondary" href="/.well-known/security.txt">security.txt</a>
            <a class="button secondary" href="${SECURITY_POLICY_URL}">Security policy</a>
            <a class="button secondary" href="${RELEASE_NOTES_URL}">Release notes</a>
            <a class="button secondary" href="${REPOSITORY_URL}">Follow the build</a>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>`
}

function buildNotFoundPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Not found - HonoWarden</title>
    <style>${styles()}</style>
  </head>
  <body class="not-found">
    <main class="not-found-panel">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <p class="lede">The page you requested does not exist.</p>
      <a class="button primary" href="/">Return home</a>
    </main>
  </body>
</html>`
}

function faviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0f2d2e"/>
  <path d="M18 29h28v22H18z" fill="#fffaf0"/>
  <path d="M23 29v-7c0-6 4-10 9-10s9 4 9 10v7h-6v-7c0-3-1-5-3-5s-3 2-3 5v7z" fill="#fffaf0"/>
  <path d="M26 39h12v4H26z" fill="#d45b45"/>
</svg>`
}

function securityTxt(): string {
  return [
    `Contact: ${SECURITY_CONTACT_MAILTO}`,
    `Policy: ${SECURITY_POLICY_URL}`,
    'Preferred-Languages: en, ja',
    `Canonical: ${SECURITY_TXT_URL}`,
    'Expires: 2027-07-08T00:00:00Z',
    '',
  ].join('\n')
}

function styles(): string {
  return `
:root {
  color-scheme: light;
  --ink: #102021;
  --muted: #526668;
  --paper: #f7f4ec;
  --paper-strong: #fffaf0;
  --line: rgba(16, 32, 33, 0.16);
  --green: #0f6f5c;
  --blue: #245e9d;
  --coral: #d45b45;
  --gold: #b8892f;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: "Trebuchet MS", "Gill Sans", Verdana, sans-serif;
}

a {
  color: inherit;
}

.site-header {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 72px;
  padding: 18px clamp(20px, 5vw, 64px);
  color: var(--paper-strong);
  background: rgba(15, 45, 46, 0.86);
  border-bottom: 1px solid rgba(255, 250, 240, 0.2);
  backdrop-filter: blur(16px);
}

.brand,
nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand {
  text-decoration: none;
  font-weight: 800;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  color: var(--ink);
  background: var(--paper-strong);
  border-radius: 6px;
}

nav {
  gap: clamp(12px, 2.4vw, 28px);
  font-size: 0.92rem;
}

nav a {
  text-decoration: none;
  opacity: 0.84;
}

nav a:hover {
  opacity: 1;
}

.hero {
  position: relative;
  min-height: min(780px, calc(100svh - 44px));
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 132px clamp(22px, 7vw, 96px) 72px;
  color: var(--paper-strong);
  background:
    linear-gradient(90deg, rgba(15, 45, 46, 0.96), rgba(15, 45, 46, 0.74)),
    repeating-linear-gradient(0deg, rgba(255, 250, 240, 0.08) 0 1px, transparent 1px 42px),
    repeating-linear-gradient(90deg, rgba(255, 250, 240, 0.07) 0 1px, transparent 1px 42px),
    #0f2d2e;
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 920px;
}

.hero-visual {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.9;
}

.trace,
.node,
.pulse {
  position: absolute;
  display: block;
}

.trace {
  height: 2px;
  transform-origin: left center;
  background: linear-gradient(90deg, transparent, rgba(240, 203, 122, 0.94), transparent);
}

.trace-a {
  width: 52vw;
  top: 30%;
  left: 44%;
  transform: rotate(-9deg);
}

.trace-b {
  width: 44vw;
  top: 58%;
  left: 50%;
  transform: rotate(11deg);
  background: linear-gradient(90deg, transparent, rgba(103, 184, 178, 0.86), transparent);
}

.trace-c {
  width: 36vw;
  top: 74%;
  left: 38%;
  transform: rotate(-18deg);
  background: linear-gradient(90deg, transparent, rgba(212, 91, 69, 0.76), transparent);
}

.node {
  width: clamp(82px, 12vw, 160px);
  aspect-ratio: 1;
  border: 1px solid rgba(255, 250, 240, 0.34);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 250, 240, 0.12), rgba(255, 250, 240, 0.03)),
    rgba(15, 45, 46, 0.32);
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.24);
}

.node::before,
.node::after {
  content: "";
  position: absolute;
  left: 18%;
  right: 18%;
  height: 2px;
  background: rgba(255, 250, 240, 0.56);
}

.node::before {
  top: 34%;
}

.node::after {
  top: 56%;
  right: 38%;
}

.node-a {
  top: 20%;
  right: 12%;
}

.node-b {
  top: 50%;
  right: 28%;
}

.node-c {
  bottom: 11%;
  right: 8%;
}

.node-d {
  top: 36%;
  right: -42px;
}

.pulse {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--coral);
  box-shadow: 0 0 0 12px rgba(212, 91, 69, 0.16);
  animation: pulse 2.8s ease-in-out infinite;
}

.pulse-a {
  top: 30%;
  right: 32%;
}

.pulse-b {
  top: 64%;
  right: 18%;
  background: var(--gold);
  box-shadow: 0 0 0 12px rgba(184, 137, 47, 0.16);
  animation-delay: 1.1s;
}

.eyebrow,
.section-kicker {
  margin: 0 0 14px;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--coral);
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1,
h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
}

h1 {
  margin-bottom: 20px;
  font-size: clamp(3.5rem, 11vw, 8.2rem);
  line-height: 0.9;
}

h2 {
  margin-bottom: 20px;
  font-size: clamp(2.3rem, 6vw, 5.8rem);
  line-height: 0.98;
}

h3 {
  margin-bottom: 12px;
  font-size: 1.25rem;
}

.lede {
  max-width: 720px;
  margin-bottom: 30px;
  font-size: clamp(1.18rem, 2vw, 1.62rem);
  line-height: 1.5;
  color: rgba(255, 250, 240, 0.86);
}

.hero-actions,
.closing,
.closing-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 12px 18px;
  border-radius: 6px;
  font-weight: 800;
  text-decoration: none;
}

.button.primary {
  color: var(--paper-strong);
  background: var(--coral);
}

.button.secondary {
  color: var(--paper-strong);
  border: 1px solid rgba(255, 250, 240, 0.5);
}

.signal-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  max-width: 760px;
  margin: 42px 0 0;
  border: 1px solid rgba(255, 250, 240, 0.28);
  background: rgba(255, 250, 240, 0.18);
}

.signal-list div {
  padding: 18px;
  background: rgba(15, 45, 46, 0.76);
}

dt {
  margin-bottom: 8px;
  color: rgba(255, 250, 240, 0.64);
  font-size: 0.74rem;
  text-transform: uppercase;
}

dd {
  margin: 0;
  font-weight: 800;
}

.band {
  background: var(--paper-strong);
  border-block: 1px solid var(--line);
}

.section-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(68px, 10vw, 118px) clamp(22px, 5vw, 54px);
}

.two-column {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.62fr);
  gap: clamp(32px, 7vw, 88px);
  align-items: start;
}

.status-panel {
  border: 1px solid var(--line);
  background: var(--paper);
}

.status-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid var(--line);
}

.status-row:last-child {
  border-bottom: 0;
}

.status-row span {
  color: var(--muted);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.feature-grid article {
  min-height: 280px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--paper-strong);
}

.feature-number {
  display: inline-block;
  margin-bottom: 56px;
  color: var(--blue);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2.4rem;
}

.feature-grid p {
  color: var(--muted);
  line-height: 1.6;
}

.final-band {
  background: var(--ink);
  color: var(--paper-strong);
}

.closing {
  justify-content: space-between;
  gap: 32px;
}

.closing h2 {
  max-width: 760px;
}

.closing-copy {
  max-width: 680px;
  color: rgba(255, 250, 240, 0.74);
  line-height: 1.6;
}

.closing-actions {
  justify-content: flex-end;
  max-width: 540px;
}

.not-found {
  display: grid;
  min-height: 100svh;
  place-items: center;
}

.not-found-panel {
  width: min(680px, calc(100vw - 44px));
  padding: 44px;
  color: var(--paper-strong);
  background: var(--ink);
  border-radius: 8px;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.45);
  }
}

@media (max-width: 780px) {
  .site-header {
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
  }

  nav {
    width: 100%;
    justify-content: space-between;
  }

  .hero {
    min-height: auto;
    padding-top: 176px;
  }

  h1 {
    font-size: clamp(2.65rem, 11vw, 3.5rem);
  }

  .hero-visual {
    opacity: 0.48;
  }

  .signal-list,
  .two-column,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .node-d,
  .trace-c {
    display: none;
  }

  .closing {
    align-items: flex-start;
    flex-direction: column;
  }
}
`
}

export default app
