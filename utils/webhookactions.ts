import axios from "axios"
import { validateToken, getToken } from "./auth"
import getStreamData from "./streamInfo"
import { discordActions, streamAction, manualDatabaseActions, manualDatabaseOfflineActions } from "./types"
import getStreamerData from "./streamerData"
const twitch_token = process.env.TWITCH_BEARER
const twitch_client = process.env.TWITCH_CLIENT
const twitch_secret = process.env.TWITCH_SECRET
const supatoken = process.env.SUPA_TOKEN
const supakey = process.env.SUPA_APIKEY
const webhook = process.env.DISCORD_WEBHOOK

const manualDatabaseAction = async ({ streamer, title, stream_status, stream_online, stream_offline }: manualDatabaseActions) => {
  await axios.patch('http://localhost:54321/rest/v1/streamers', {
    title: title,
    stream_status: stream_status,
    stream_online: stream_online,
    stream_offline: stream_offline
  }, {
    params: {
      login_name: `eq.${streamer}`,
      select: "*"
    },
    headers: {
      Authorization: `Bearer ${supatoken}`,
      apikey: supakey,
      "Content-Type": "application/json"
    },
  })
}

const manualDatabaseOfflineAction = async ({ streamer, stream_status, stream_online, stream_offline }: manualDatabaseOfflineActions) => {
  await axios.patch('http://localhost:54321/rest/v1/streamers', {
    stream_status: stream_status,
    stream_online: stream_online,
    stream_offline: stream_offline
  }, {
    params: {
      login_name: `eq.${streamer}`,
      select: "*"
    },
    headers: {
      Authorization: `Bearer ${supatoken}`,
      apikey: supakey,
      "Content-Type": "application/json"
    },
  })
}


export const userValidation = async ({ streamer }: { streamer: string }) => {
  const response = await axios.get('http://localhost:54321/rest/v1/streamers', {
    params: {
      login_name: `eq.${streamer}`,
    },
    headers: {
      Authorization: `Bearer ${supatoken}`,
      apikey: supakey,
      "Content-Type": "application/json"
    },

  })
  return response.data
}

//This is used to avoid discord cache issues.
function generateRandomNumber() {
  return Math.floor(Math.random() * 900000) + 100000;
}

// EASIER FOR USER TO DEFINE THEIR DISCORD AVATAR
const avatar = process.env.DISCORD_AVATAR_URL

const discordAction = async ({ streamer, streamtitle, gameName, avatar, profileImage }: discordActions) => {
  const randomnumber = generateRandomNumber();
  await axios.post(`${webhook}`, {
    // uncomment  content to add a message to the embed
    content: "@here this is just a test",
    mention_everyone: true,
    avatar_url: avatar,
    username: "HatSalsa-bot",
    embeds: [
      {
        "title": `${streamer} is live!`,
        "color": 4321431,
        "timestamp": "2023-06-22T19:05:16.897Z",
        "url": `https://twitch.tv/${streamer}`,
        "author": {
          "url": `https://twitch.tv/${streamer}`,
          "icon_url": profileImage,
          "name": `${streamer} is live`
        },
        "thumbnail": {
          "url": profileImage
        },
        "footer": {
          "text": "lonusbot",
          "icon_url": profileImage
        },
        "image": {
          "url": `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}-1280x720.jpg?r=${randomnumber}`,
          "proxy_url": `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}-1280x720.jpg?r=${randomnumber}`,
          "height": 1280,
          "width": 720
        },
        "fields": [
          {
            "name": "Now playing",
            "value": gameName,
            "inline": true
          },
          {
            "name": "Stream title",
            "value": streamtitle,
            "inline": true
          }
        ]
      }
    ]
  },)

}


export const updateUserOnlineAction = async ({ streamer: loginName }: streamAction) => {
  const isTokenValid = await validateToken({ twitchToken: twitch_token })
  if (isTokenValid === true) {
    const streamData = await getStreamData({ client: twitch_client, token: twitch_token, streamer: loginName })
    if (streamData && streamData.title && streamData.game_name) {
      const { title: streamTitle, game_name: gameName } = streamData;

      const { profile_image_url: streamerProfileImage } = await getStreamerData({ client: twitch_client, token: twitch_token, streamer: loginName })

      await manualDatabaseAction({ streamer: loginName, title: streamTitle, stream_online: true, stream_offline: false, stream_status: false })

      await discordAction({ streamer: loginName, streamtitle: streamTitle, gameName: gameName.game_name, avatar: avatar, profileImage: streamerProfileImage })
    } else {
      // const { game_name: gameName } = streamData;

      const { profile_image_url: streamerProfileImage } = await getStreamerData({ client: twitch_client, token: twitch_token, streamer: loginName })

      await manualDatabaseAction({ streamer: loginName, title: "default", stream_online: true, stream_offline: false, stream_status: false })

      await discordAction({ streamer: loginName, streamtitle: "default", gameName: "notleague", avatar: avatar, profileImage: streamerProfileImage })
    }

  }
  else {
    const { newToken } = await getToken({ twitch_secret: twitch_secret, twitch_client: twitch_client })
    const streamData = await getStreamData({ client: twitch_client, token: newToken, streamer: loginName })
    const { title: streamTitle, game_name: gameName } = streamData
    const { profile_image_url: streamerProfileImage } = await getStreamerData({ client: twitch_client, token: twitch_token, streamer: loginName })
    await manualDatabaseAction({ streamer: loginName, title: streamTitle, stream_online: true, stream_offline: true, stream_status: true })
    await discordAction({ streamer: loginName, streamtitle: streamTitle, gameName: gameName.game_name, avatar: avatar, profileImage: streamerProfileImage })
  }
}

//NOTE: THIS DOESNT NOTIFY TO DISCORD JUST UPDATES DATABASE
export const updateStreamerOfflineAction = async ({ streamer: loginName }: streamAction) => {
  await manualDatabaseOfflineAction({ streamer: loginName, stream_online: false, stream_offline: true, stream_status: false })
}