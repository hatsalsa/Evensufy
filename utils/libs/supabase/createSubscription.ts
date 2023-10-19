import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/utils/libs/supabase/types/Database'
// import { createSub } from '@/types'
type createSub = Database['public']['Tables']['subscriptions']['Insert']
const createSubscription = async ({ broadcaster_id, created_at, method, login_name, subscription_id, subscription_type }: createSub) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  try {
    const user_id = session?.user.id
    const { data, error } = await supabase.from('subscriptions').insert([{ broadcaster_id: broadcaster_id, created_at: created_at, method: method, login_name: login_name, subscription_id: subscription_id, subscription_type: subscription_type, user_id: user_id }])
  } catch (error) {
    console.debug(error)
    throw new Error(error as string)
  }

}

export default createSubscription