import { register } from "@/utils/types";
import getStreamData from '@/utils/streamInfo'
import getStreamerData from '@/utils/streamerData'
import createEventSub from "./eventsub";
import createStreamer from "@/utils/libs/supabase/createStreamer";
import createSubscription from "@/utils/libs/supabase/createSubscription";
const twitch_client = process.env.SUPABASE_AUTH_TWITCH_CLIENT_ID
let isLive = false;
export const userRegistration = async ({ token, streamer }: register) => {

  const { id: streamerId, login: streamerLogin, display_name: streamerDisplayName, profile_image_url: streamerProfileImage } = await getStreamerData({ client: twitch_client, token: token, streamer })
  try {
    const streamData = await getStreamData({ client: twitch_client, token, streamer: streamer })
    if (!streamData) {
      isLive = false
      const { onlineData, offlineData } = await createEventSub({ token, streamer_id: streamerId })

      const { id: onlineSubscriptionID, type: onlineEvenType, transport: { method: onlineTransportType }, created_at: onlineCreationTime, condition: { broadcaster_user_id: onlineStreamerID } } = onlineData

      const { id: offlineSubscriptionID, type: offlineEvenType, transport: { method: offlineTransportType }, created_at: offlineCreationTime, condition: { broadcaster_user_id: offlineStreamerID } } = offlineData

      await createStreamer({ broadcaster_id: streamerId, login_name: streamerLogin, profile_image: streamerProfileImage, stream_offline: true, stream_online: isLive, stream_status: isLive, title: "", subscribed: true })

      const insertOnline = await createSubscription({ broadcaster_id: onlineStreamerID, created_at: onlineCreationTime, method: onlineTransportType, login_name: streamer, subscription_id: onlineSubscriptionID, subscription_type: onlineEvenType })



      const insertOffline = await createSubscription({ broadcaster_id: offlineStreamerID, created_at: offlineCreationTime, method: offlineTransportType, login_name: streamer, subscription_id: offlineSubscriptionID, subscription_type: offlineEvenType })
    }
    else {
      isLive = true
      const { title } = streamData
      const { onlineData, offlineData } = await createEventSub({ token, streamer_id: streamerId })

      const { id: onlineSubscriptionID, type: onlineEvenType, transport: { method: onlineTransportType }, created_at: onlineCreationTime, condition: { broadcaster_user_id: onlineStreamerID } } = onlineData

      const { id: offlineSubscriptionID, type: offlineEvenType, transport: { method: offlineTransportType }, created_at: offlineCreationTime, condition: { broadcaster_user_id: offlineStreamerID } } = offlineData

      await createStreamer({ broadcaster_id: streamerId, login_name: streamerLogin, profile_image: streamerProfileImage, stream_offline: false, stream_online: isLive, stream_status: isLive, title: title, subscribed: true })

      const insertOnline = await createSubscription({ broadcaster_id: onlineStreamerID, created_at: onlineCreationTime, method: onlineTransportType, login_name: streamer, subscription_id: onlineSubscriptionID, subscription_type: onlineEvenType })



      const insertOffline = await createSubscription({ broadcaster_id: offlineStreamerID, created_at: offlineCreationTime, method: offlineTransportType, login_name: streamer, subscription_id: offlineSubscriptionID, subscription_type: offlineEvenType })

    }
  } catch (error) {
    throw new Error(error as string)
  }
}