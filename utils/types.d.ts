import type { Session } from '@supabase/auth-helpers-nextjs'
export type TokenValidation = {
  twitchToken: string | undefined | null
  // twitchRefreshToken: string | undefined | null
}

export type Auth = {
  token: string | undefined
}
export type TokenRefresh = {
  twitch_client: string | undefined
  twitch_secret: string | undefined
}


export type Twitch = {
  client: string | undefined
  token: string | undefined | null
  streamer: string | undefined
}

export type StreamInfo = {
  user_id: string | undefined | ''
  user_login: string | undefined | ''
  user_name: string | undefined | ''
  type: string | undefined | ''
  title: string | undefined | ''
}

export type StreamerData = {
  id: string | undefined | ''
  login: string | undefined | ''
  display_name: string | undefined | ''
  profile_image_url: string | undefined | ''
}

export type Webhook = {
  type: string | undefined | ''
  broadcaster_user_id: string | undefined | ''
}

export type Subscription = {
  id: string | undefined | ''
  type: string | undefined | ''
  transport: {
    method: string | undefined | ''
  }
  created_at: string | undefined | ''
  condition: {
    broadcaster_user_id: string | undefined | ''
  }
}

export type EventSub = {
  token: string | undefined | null
  streamer_id: string | undefined | ''
}

export type Submit = {
  streamer: string | undefined | ''
}

export type CardType = {
  streamerName: string
  title: string | null
  profileImage: string | StaticImageData
  isLive: boolean | string[]
  createdAt: string
  subscriptionStatus: string
  // session: Session | null
}

export type register = {
  token: string | undefined | null
  streamer: string | undefined | ''
}


export type createSub = {
  broadcaster_id?: string | null
  created_at: string
  login_name?: string | null
  method?: string | null
  subscription_id?: string | null
  subscription_type?: string | null
  user_id?: string | null
}

export type createStreamer = {
  broadcaster_id: string
  created_at?: string
  login_name?: string | null
  profile_image?: string | null
  stream_offline?: boolean | null
  stream_online?: boolean | null
  title?: string | null
  user_id?: string | null
}
export type statusKey = string[]
export type streamStatus = string[]

export type manualDatabaseActions = {
  streamer: string
  title: string,
  stream_status: boolean
  stream_online: boolean
  stream_offline: boolean
}


export type manualDatabaseOfflineActions = {
  streamer: string
  stream_status: boolean
  stream_online: boolean
  stream_offline: boolean
}

export type streamAction = {
  streamer: string
}

export type discordActions = {
  streamer: string
  streamtitle: string
  gameName: string
  avatar: string | undefined
  profileImage: string | undefined
}