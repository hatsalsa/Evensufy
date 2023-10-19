import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import LoginButton from '@/app/_components/login'


export const dynamic = 'force-dynamic'
export default async function Login() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return <LoginButton session={session} />
}