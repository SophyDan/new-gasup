import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

if (process.env.PAYSTACK_SECRET_KEY?.startsWith('sk_live_')) {
  console.warn('GasUp uses Paystack test mode only. A live secret key is configured and payments will be refused.')
}

export default defineConfig({
  // nitro() turns the TanStack Start server build into a deployable server.
  // On Vercel it auto-selects the "vercel" preset and writes .vercel/output
  // (static assets + serverless function). Without it Vercel serves 404.
  plugins: [tanstackStart(), nitro(), viteReact()]
})
