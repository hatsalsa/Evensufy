import { TokenValidation, TokenRefresh } from '@/utils/types'

import axios from 'axios'

export const validateToken = async ({ twitchToken }: TokenValidation) => {
  const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
    headers: {
      Authorization: `Bearer ${twitchToken}`
    }
  })
  if (response.status === 200) {
    return true
  }
  else if (response.status === 401) {
    return false
  }
}


export const getToken = async ({ twitch_secret, twitch_client }: TokenRefresh) => {
  const response = await axios.post(' https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: twitch_client,
      client_secret: twitch_secret,
      grant_type: 'client_credentials'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const newTwitchToken = response.data.access_token
  process.env.TWITCH_BEARER = newTwitchToken
  const { access_token: newToken } = response.data
  return newToken

}


