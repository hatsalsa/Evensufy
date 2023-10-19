
import { EventSub } from "@/utils/types";
import axios, { AxiosError } from "axios";
const webhook_url = process.env.WEBHOOK_URL
const webhook_secret = process.env.WEBHOOK_SECRET
const twitch_client = process.env.SUPABASE_AUTH_TWITCH_CLIENT_ID
const subscribeOnline = async ({ token, streamer_id }: EventSub) => {
  try {
    const online = await axios.post(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        type: `stream.online`,
        version: "1",
        condition: { "broadcaster_user_id": `${streamer_id}` },
        transport: {
          method: "webhook",
          callback: webhook_url,
          secret: webhook_secret,
        },
      },
      {
        headers: {
          Authorization: `Bearer ` + token,
          "Client-Id": twitch_client,
          "Content-Type": "application/json",
        },
      }
    )
    const onlineData = online.data.data[0]
    return onlineData
  } catch (error: AxiosError | any) {
    console.debug(error)
  }
}

const subscribeOffline = async ({ token, streamer_id }: EventSub) => {
  try {
    const offline = await axios.post(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        type: `stream.offline`,
        version: "1",
        condition: { "broadcaster_user_id": `${streamer_id}` },
        transport: {
          method: "webhook",
          callback: webhook_url,
          secret: webhook_secret,
        },
      },
      {
        headers: {
          Authorization: `Bearer ` + token,
          "Client-Id": twitch_client,
          "Content-Type": "application/json",
        },
      }
    )

    const offlineData = offline.data.data[0]
    return offlineData

  } catch (error: AxiosError | any) {
    console.debug(error)
  }

}
export default async function createEventSub({ token, streamer_id }: EventSub) {
  const onlineData = await subscribeOnline({ token, streamer_id })
  const offlineData = await subscribeOffline({ token, streamer_id })
  return { onlineData, offlineData }
}