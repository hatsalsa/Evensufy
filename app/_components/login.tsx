'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/auth-helpers-nextjs'
import { Button } from '@nextui-org/button'

export default function LoginButton({ session }: { session: Session | null }) {

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitch',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })
    router.refresh()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  return (
    <>
      <Button className={`${session ? "bg-transparent hover:bg-[#4338ca] hover:transition-all leading-[24px] font-[500] text-[16px]" : "bg-transparent hover:bg-[#292A2B]"}`} onPress={session ? handleSignOut : handleSignIn}> {session ? "Sign out" : "Sign in"}</Button>
    </>
  )
}