import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Providers } from "../providers"
import Compose from "./Compose"
import { cookies } from "next/headers"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return <section>
    <Providers>
      <Compose>
        {children}
      </Compose>
    </Providers>

  </section>
}