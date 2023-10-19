import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/utils/libs/supabase/types/Database'
type streamerTable = Database['public']['Tables']['streamers']['Insert']
const createStreamer = async ({ broadcaster_id, login_name, profile_image, stream_offline, stream_online, stream_status, title, subscribed }: streamerTable) => {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  try {
    const user_id = session?.user.id
    const { data, error } = await supabase.from('streamers').insert([{ broadcaster_id: broadcaster_id, login_name: login_name, profile_image: profile_image, stream_offline: stream_offline, stream_online: stream_online, stream_status: stream_status, title: title, user_id: user_id, subscribed: subscribed }])
  } catch (error) {
    console.debug(error)
    throw new Error(error as string)
  }

}

export default createStreamer
