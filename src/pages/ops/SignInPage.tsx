import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../auth/AuthProvider'
import { isSupabaseConfigured } from '../../data/supabase'

const schema = z.object({ email: z.string().email('Enter a valid email.'), password: z.string().min(8, 'Enter at least 8 characters.') })
type Values = z.infer<typeof schema>

export function SignInPage() {
  const { user, signIn, enterDemo } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) })
  if (user) return <Navigate to="/ops/overview" replace />
  const submit = async (values: Values) => { setError(null); try { await signIn(values.email, values.password); navigate('/ops/overview') } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not sign in.') } }
  const demo = () => { enterDemo(); navigate('/ops/overview') }
  return <main className="sign-in-page" id="main-content"><section className="sign-in-art"><Link to="/"><ArrowLeft size={16} /> Return to guest website</Link><div><p className="eyebrow">Velora operations</p><h1>Hospitality,<br />in one clear view.</h1><p>Reservations, rooms, service and revenue—connected around the guest.</p></div></section><section className="sign-in-panel"><div className="brand"><span>V</span> VELORA <small>OPS</small></div><div><p className="eyebrow">Owner workspace</p><h2>Welcome, David.</h2><p>Open the dashboard to manage Velora operations.</p></div><Button size="lg" onClick={demo} icon={<LockKeyhole size={17} />}>Open owner dashboard</Button>{isSupabaseConfigured && <><div className="signin-divider"><span>Account sign in</span></div>{error && <div className="alert alert--error" role="alert">{error}</div>}<form onSubmit={handleSubmit(submit)} noValidate><div className="field"><label htmlFor="staff-email">Work email</label><input id="staff-email" type="email" autoComplete="email" defaultValue="davidavowo@gmail.com" {...register('email')} />{errors.email && <p className="field-error">{errors.email.message}</p>}</div><div className="field"><label htmlFor="staff-password">Password</label><input id="staff-password" type="password" autoComplete="current-password" {...register('password')} />{errors.password && <p className="field-error">{errors.password.message}</p>}</div><Button type="submit" variant="secondary" loading={isSubmitting}>Sign in with password</Button></form></>}<p className="help-text">Authorized staff only.</p></section></main>
}
