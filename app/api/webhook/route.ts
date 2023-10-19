
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { updateUserOnlineAction, updateStreamerOfflineAction, userValidation } from "@/utils/webhookactions";

const secret = process.env.WEBHOOK_SECRET

const mockup = 'kimchkim'
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json();

  const { subscription, event } = body

  const rawBody = JSON.stringify(body);
  const list = Object.fromEntries(request.headers)

  const { "twitch-eventsub-message-signature": Signature,
    "twitch-eventsub-message-id": MessageId,
    "twitch-eventsub-message-timestamp": Timestamp,
    "twitch-eventsub-message-type": MessageType } = list ?? ""
  const { status: subscriptionStatus, type: subscriptionType } = body.subscription
  const message = MessageId + Timestamp + rawBody;

  if (MessageType === "webhook_callback_verification") {
    console.log('Verifying Webhook')
    const time = Math.floor(new Date().getTime() / 1000);

    const timestampInSeconds = Math.floor(new Date(Timestamp).getTime() / 1000);
    if (Math.abs(time - timestampInSeconds) > 600) {
      // needs to be < 10 minutes
      console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${MessageId}.`);
      throw new Error("Ignore this request.");
    }
    // Error if secret wasn't passed
    if (!secret) {
      console.log(`Twitch signing secret is empty.`);
      throw new Error("Twitch signing secret is empty.");
    }
    const hmac = "sha256=" + getHmac(secret, message);

    const isValidSignature = verifyMessage(hmac, Signature);
    if (!isValidSignature) {
      // throw new Error('Invalid Signature');
      console.log("Invalid Signature");
      return new Response("Invalid Signature", { status: 406 });
    } else {
      console.log("Validation successful")
      return new Response(body.challenge, { status: 200 });
    }
  } else if (MessageType === "notification" && subscriptionStatus === "enabled") {
    const { broadcaster_user_login: eventStreamer } = body.event
    const streamer = eventStreamer.toLowerCase()
    const isUserRegistered = await userValidation({ streamer: streamer })
    if (isUserRegistered?.length !== 0) {
      if (subscriptionType === "stream.online") {
        await updateUserOnlineAction({ streamer: streamer })
        return new Response("Success", { status: 200 })
      } else if (subscriptionType === "stream.offline") {
        await updateStreamerOfflineAction({ streamer: streamer })
        return new Response("Success", { status: 200 })
      } else {
        return new Response("Invalid Event", { status: 406 })
      }
    }
    else {
      console.log("Streamer not found")
      return new Response("Streamer not found ", { status: 406 })
    }

  } else {
    return new Response("Not Allowed", { status: 405 })
  }
  // Get the HMAC.
  function getHmac(secret: string, message: string) {
    return crypto.createHmac("sha256", secret).update(message).digest("hex");
  }

  // Verify whether our hash matches the hash that Twitch passed in the header.
  function verifyMessage(hmac: string, verifySignature: string) {
    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(verifySignature)
    );
  }
  // return new Response("Not Allowed", { status: 405 })
}




export async function GET(request: Request, response: Response) {
  return new Response("Method not allowed", { status: 405 })
}
export async function PUT(request: Request, response: Response) {
  return new Response("Method not allowed", { status: 405 })
}
export async function PATCH(request: Request, response: Response) {
  return new Response("Method not allowed", { status: 405 })
}
export async function DELETE(request: Request, response: Response) {
  return new Response("Method not allowed", { status: 405 })
}


