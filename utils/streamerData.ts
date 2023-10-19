import { Twitch } from "@/utils/types";
import axios, { AxiosError } from "axios";

export default async function getStreamerData({ client, token, streamer }: Twitch) {
  try {
    const streamerData = await axios.get('https://api.twitch.tv/helix/users', {
      params: { login: streamer },
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': client,
        'Content-Type': 'application/json'
      }
    });
    return streamerData.data.data[0];
  } catch (error: AxiosError | any) {
    if (error.response.status === 401 || error.response.data.message === 'Invalid OAuth token') {
      console.debug('Refresh Token')
    }
  }
}
