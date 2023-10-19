import { validateToken, getToken } from '@/utils/auth'
import { userRegistration } from '@/utils/registration'
import { reSubscribe } from '@/utils/resubscribe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const twitch_client = process.env.SUPABASE_AUTH_TWITCH_CLIENT_ID
const twitch_secret = process.env.SUPABASE_AUTH_TWITCH_SECRET
const twitchToken = process.env.TWITCH_BEARER


export const dynamic = 'force-dynamic'
interface Subscription {
  subscribed: boolean
}

export async function POST(request: NextRequest) {
  const { streamer } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ response: "Forbidden", status: 403 }, { status: 403 })
  }
  let { data: streamers, error } = await supabase
    .from('streamers')
    .select('login_name')
    .eq('login_name', streamer)
  if (streamers?.length !== 0) {
    let { data: subscribed } = await supabase.from('streamers').select('subscribed').eq('login_name', streamer)
    let typedStreamers: Subscription[] = subscribed || [];
    if (typedStreamers[0]?.subscribed === true) {
      return NextResponse.json({ response: "Streamer already exists and subscribed", status: 409 }, { status: 409 })
    } else {
      // create only the subscription record in database and update status of subscribed to true
      const isTokenValid = await validateToken({ twitchToken })
      if (isTokenValid === true) {
        const resub = await reSubscribe({ token: twitchToken, streamer })
        return NextResponse.json({ response: "Streamer successfully resubscribed", status: 202 }, { status: 202 })
      } else {
        const { newToken } = await getToken({ twitch_secret: twitch_secret, twitch_client: twitch_client })
        const resub = await reSubscribe({ token: newToken, streamer })
        return NextResponse.json({ response: "Streamer successfully resubscribed", status: 202 }, { status: 202 })
      }

    }
  }
  else {
    try {
      const isTokenValid = await validateToken({ twitchToken })
      if (isTokenValid === true) {
        const register = await userRegistration({ token: twitchToken, streamer })
        return NextResponse.json({ response: "Streamer successfully subscribed", status: 202 }, { status: 202 })
      }
      else {
        const { newToken } = await getToken({ twitch_secret: twitch_secret, twitch_client: twitch_client })
        const register = await userRegistration({ token: newToken, streamer })
        return NextResponse.json({ response: "Streamer successfully subscribed", status: 202 }, { status: 202 })
      }
    } catch (error) {
      return NextResponse.json({ response: "Subscription failed", status: 409 }, { status: 409 })
    }
  }


  return NextResponse.json({ status: 202 })
}




