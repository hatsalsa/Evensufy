import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import HomePage from "./_components/HomePage";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'
export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return (
    <>
      <HomePage session={session} />
    </>
  )
}