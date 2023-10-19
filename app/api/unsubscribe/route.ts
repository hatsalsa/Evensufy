import { validateToken, getToken } from '@/utils/auth'
import { Database } from '@/utils/libs/supabase/types/Database'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
const twitch_client = process.env.SUPABASE_AUTH_TWITCH_CLIENT_ID
const twitch_secret = process.env.SUPABASE_AUTH_TWITCH_SECRET
const twitchToken = process.env.TWITCH_BEARER

export async function DELETE(request: Request) {
  const { streamer } = await request.json()
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ response: "Forbidden", status: 403 }, { status: 403 })
  }
  try {
    const { data } = await supabase.from('subscriptions').select('subscription_id').eq('login_name', streamer)
    const isTokenValid = await validateToken({ twitchToken })
    if (isTokenValid === true) {
      if (data && data.length) {
        for (let i = 0; i < data?.length; i++) {
          await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${data[i].subscription_id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${twitchToken}`,
              'Client-Id': `${twitch_client}`,
              "Content-Type": "application/json",
            }
          })
        }
      }
      let { data: unsubscribed, error } = await supabase.from('streamers').update({ subscribed: false }).eq('login_name', streamer)
      // delete records from subscriptions table so it doesn't create more
      const { error: dberror } = await supabase
        .from('subscriptions')
        .delete()
        .eq('login_name', streamer)
      return NextResponse.json({ response: "Unsubscribed", status: 200 }, { status: 200 })
    }
    else {
      const { newToken } = await getToken({ twitch_secret: twitch_secret, twitch_client: twitch_client })
      if (data && data.length) {
        for (let i = 0; i < data?.length; i++) {
          await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${data[i].subscription_id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${twitchToken}`,
              'Client-Id': `${twitch_client}`,
              "Content-Type": "application/json",
            }
          })
        }
      }
      let { data: unsubscribed, error } = await supabase.from('streamers').update({ subscribed: false }).eq('login_name', streamer)

      // delete records from subscriptions table so it doesn't create more
      const { error: dberror } = await supabase
        .from('subscriptions')
        .delete()
        .eq('login_name', streamer)
      return NextResponse.json({ response: "Unsubscribed", status: 200 }, { status: 200 })
    }
  } catch (error: any) {
    throw new Error(error)
  }

}