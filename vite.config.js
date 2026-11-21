import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Runs api/chat.js inside `npm run dev`, so local development behaves like Vercel.
function apiDevPlugin(env) {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        Object.assign(process.env, env)

        // Small shims so the Vercel-style handler works on a plain Node response
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }

        let raw = ''
        for await (const chunk of req) raw += chunk
        try {
          req.body = raw ? JSON.parse(raw) : {}
        } catch {
          req.body = {}
        }

        try {
          const mod = await server.ssrLoadModule('/api/chat.js')
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          res.status(500).json({ error: 'Server error' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), apiDevPlugin(env)],
  }
})
