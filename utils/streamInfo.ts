
import axios, { AxiosError } from "axios";
import { Twitch } from "@/utils/types";

// const streamer = 'leesslmo_'
export default async function getStreamData({ client, token, streamer }: Twitch) {
  try {
    const stream = await axios.get('https://api.twitch.tv/helix/streams', {
      params: { user_login: streamer },
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': client,
        'Content-Type': 'application/json'
      }
    });
    const data = stream.data.data[0]
    if (data) {
      return data
    }
    else {
      return null;  // streamer is offline.
    }
  }
  catch (error: AxiosError | any) {
    if (error.response.status === 401 || error.response.data.message === 'Invalid OAuth token') {
      console.debug('Refresh Token')
    }
  }
}