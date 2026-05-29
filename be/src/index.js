import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { CookieJar } from 'tough-cookie'
import fetchCookie from 'fetch-cookie'

const app  = express()
const PORT = process.env.PORT || 4000
const SUPERSET_URL = process.env.SUPERSET_URL || 'http://localhost:8088'

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

// ──────────────────────────────────────────────
// Ottieni il guest token in un'unica sessione
// ──────────────────────────────────────────────
async function getGuestToken(dashboardId) {
  // Cookie jar condiviso tra le 3 chiamate
  const jar = new CookieJar()
  const sessionFetch = fetchCookie(fetch, jar)

  // 1. Login → access token
  const loginRes = await sessionFetch(`${SUPERSET_URL}/api/v1/security/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.SUPERSET_ADMIN_USER     || 'admin',
      password: process.env.SUPERSET_ADMIN_PASSWORD || 'admin',
      provider: 'db',
      refresh:  true,
    }),
  })
  if (!loginRes.ok) throw new Error(`Login Superset fallito: ${loginRes.status}`)
  const { access_token } = await loginRes.json()

  // 2. CSRF token (stessa sessione → cookie già presenti)
  const csrfRes = await sessionFetch(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Referer': SUPERSET_URL,
    },
  })
  if (!csrfRes.ok) throw new Error(`CSRF token fallito: ${csrfRes.status}`)
  const { result: csrfToken } = await csrfRes.json()

  // 3. Guest token (stessa sessione + CSRF header)
  const guestRes = await sessionFetch(`${SUPERSET_URL}/api/v1/security/guest_token/`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${access_token}`,
      'X-CSRFToken':   csrfToken,
      'Referer':       SUPERSET_URL,
    },
    body: JSON.stringify({
      user: {
        username:   'workshop-guest',
        first_name: 'Guest',
        last_name:  'Workshop',
      },
      resources: [{ type: 'dashboard', id: dashboardId }],
      rls: [],
    }),
  })

  if (!guestRes.ok) {
    const body = await guestRes.text()
    throw new Error(`Guest token fallito (${guestRes.status}): ${body}`)
  }

  const { token } = await guestRes.json()
  return token
}

// ──────────────────────────────────────────────
// POST /embed/token
// ──────────────────────────────────────────────
app.post('/embed/token', async (req, res) => {
  const { dashboardId } = req.body

  if (!dashboardId) {
    return res.status(400).json({ error: 'dashboardId è obbligatorio' })
  }

  try {
    const token = await getGuestToken(dashboardId)
    res.json({ token })
  } catch (err) {
    console.error('[embed/token]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────────────
// Health check
// ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`BE in ascolto su http://localhost:${PORT}`)
  console.log(`Superset target: ${SUPERSET_URL}`)
})
