
import { Database } from "./libs/supabase/types/Database"
import getStreamerData from "./streamerData"
import { register } from "./types"
import createEventSub from "./eventsub"
import createSubscription from "./libs/supabase/createSubscription"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const twitch_client = process.env.SUPABASE_AUTH_TWITCH_CLIENT_ID
export const reSubscribe = async ({ streamer, token }: register) => {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    const { id: streamerId } = await getStreamerData({ client: twitch_client, token: token, streamer })
    const { onlineData, offlineData } = await createEventSub({ token, streamer_id: streamerId })
    const { id: onlineSubscriptionID, type: onlineEvenType, transport: { method: onlineTransportType }, created_at: onlineCreationTime, condition: { broadcaster_user_id: onlineStreamerID } } = onlineData

    const { id: offlineSubscriptionID, type: offlineEvenType, transport: { method: offlineTransportType }, created_at: offlineCreationTime, condition: { broadcaster_user_id: offlineStreamerID } } = offlineData
    const insertOnline = await createSubscription({ broadcaster_id: onlineStreamerID, created_at: onlineCreationTime, method: onlineTransportType, login_name: streamer, subscription_id: onlineSubscriptionID, subscription_type: onlineEvenType })



    const insertOffline = await createSubscription({ broadcaster_id: offlineStreamerID, created_at: offlineCreationTime, method: offlineTransportType, login_name: streamer, subscription_id: offlineSubscriptionID, subscription_type: offlineEvenType })
    let { data: subscribed, error } = await supabase.from('streamers').update({ subscribed: true }).eq('login_name', streamer)
  } catch (error) {
    console.log(error)
  }
}
