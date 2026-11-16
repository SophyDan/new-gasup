import { createFileRoute } from '@tanstack/react-router'
import { authThrottleSeconds, clearAuthFailures, createUser, getUserByEmail, recordAuthFailure, updateUserPassword } from '../../lib/database.mjs'
import { hashPassword, issueSession, safeUser, timingSafeStringEqual } from '../../lib/auth.mjs'

export const Route = createFileRoute('/api/auth/staff-login')({
  server: { handlers: { POST: async ({ request }) => {
    const staffEmail=(process.env.STAFF_EMAIL||'').trim().toLowerCase()
    const staffPassword=process.env.STAFF_PASSWORD||''
    if(!staffEmail || staffPassword.length<10 || staffPassword.length>256) return Response.json({error:'Staff login is not configured. Set STAFF_EMAIL and STAFF_PASSWORD on the server.'},{status:503})
    const input=await request.json().catch(()=>null)
    const email=typeof input?.email==='string'?input.email.trim().toLowerCase():''
    const password=typeof input?.password==='string'?input.password:''
    const retryAfter=await authThrottleSeconds(email)
    if(retryAfter) return Response.json({error:'Too many sign-in attempts. Try again later.'},{status:429,headers:{'Retry-After':String(retryAfter)}})
    if(email!==staffEmail || !timingSafeStringEqual(password,staffPassword)){await recordAuthFailure(email);return Response.json({error:'Email or password is incorrect.'},{status:401})}
    await clearAuthFailures(email)
    let user=await getUserByEmail(staffEmail)
    if(user && user.role!=='STAFF') return Response.json({error:'This email belongs to a customer account.'},{status:409})
    if(!user) user=await createUser({name:'GasUp Staff',email:staffEmail,phone:'',passwordHash:hashPassword(staffPassword),role:'STAFF'})
    else user=await updateUserPassword(user.id,hashPassword(staffPassword))
    return Response.json({user:safeUser(user)},{headers:{'Set-Cookie':issueSession(user)}})
  } } },
})
