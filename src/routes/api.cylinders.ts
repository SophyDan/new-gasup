import { createFileRoute } from '@tanstack/react-router'
import { listCylinders, saveCylinderPrices } from '../../lib/database.mjs'
import { getSessionUser } from '../../lib/auth.mjs'

export const Route = createFileRoute('/api/cylinders')({
  server: {
    handlers: {
      GET: async () => Response.json({ cylinders: await listCylinders() }),
      PUT: async ({ request }) => {
        if ((await getSessionUser(request))?.role !== 'STAFF') return Response.json({ error: 'Staff login required' }, { status: 401 })
        const body = await request.json().catch(() => null)
        const cylinders = body?.cylinders
        if (!Array.isArray(cylinders) || cylinders.length>30 || !cylinders.some((c:any)=>c && c.active!==false) || cylinders.some((c: any) => !c || !Number.isFinite(c.sizeKg) || c.sizeKg <= 0 || c.sizeKg>100 || !Number.isFinite(c.pricePerKg) || c.pricePerKg < 50 || (c.active!==undefined && typeof c.active!=='boolean')) || new Set(cylinders.map((c:any)=>c?.sizeKg)).size!==cylinders.length) {
          return Response.json({ error: 'Cylinder prices are invalid' }, { status: 400 })
        }
        try {
          await saveCylinderPrices(cylinders)
          return Response.json({ ok: true })
        } catch {
          return Response.json({ error: 'Could not save cylinder prices' }, { status: 500 })
        }
      },
    },
  },
})
