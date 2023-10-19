import EventRegisterForm from "@/app/_components/register"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
export const dynamic = 'force-dynamic'
export default async function RegisterPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/unathenticated')
  }
  return (
    <div className="flex justify-center align-middle min-h-[90vh]">
      <EventRegisterForm />
    </div>
  )
}
