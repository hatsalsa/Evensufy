'use client'
import Image from "next/image"
import logo from "@/app/assets/logo.png"
import footerLogo from "@/app/assets/footer-logo.png"
import { Button } from '@nextui-org/button';
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
export default function HomePage({ session }: { session: Session | null }) {
  const router = useRouter()
  const supabase = createClientComponentClient()



  const handleSignIn = async () => {
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitch',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })
    router.refresh()
  }
  return (
    <>
      <div className=" flex center justify-center flex-col gap-[20px] align-middle items-center min-h-[87vh]  ">
        <div className=" flex-grow-1 flex flex-col items-center justify-center gap-[20px]">
          <Image
            className='w-[125px] sm:w-[250px]'
            src={logo}
            width={250}
            height={160}
            alt=""
          />
          <div className='z-30 flex flex-col justify-center gap-[10px] align-middle items-center'>
            <h1 className=' sm:text-[40px]   font-bold'>EVENTSUB NOTIFIER</h1>
            <h3 className='text-[15px]'>Get your own stream notifications.</h3>
            <div>

              <Button color="primary" onPress={handleSignIn} variant='shadow' className=' font-semibold'>
                {session ? "Create Subscription" : "Sign In"}
              </Button>

            </div>
          </div>
        </div>
      </div>
      <footer className='flex align-middle justify-center pb-[10px] sm:bottom-0'>
        <div className='flex flex-col items-center gap-1'>
          <Image src={footerLogo} width={24} height={25} alt="" />
          <h6 className=' text-[9px]'>A hatsalsa product.</h6>
        </div>
      </footer>
    </>
  )
}