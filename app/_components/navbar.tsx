'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Session } from '@supabase/auth-helpers-nextjs'
import LoginButton from './login'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";

export default function Navigation({ session }: { session: Session | null }) {
  const pathname = usePathname()
  return (
    <Navbar maxWidth='full'>
      <NavbarContent className="flex flex-auto  gap-1 sm:gap-3" justify='start' >
        <NavbarItem>
          <Link className={`link ${pathname === '/' ? ' bg-[#292A2B] h-[40px] rounded-[12px] text-[16px] px-[16px] flex items-center leading-[24px] font-[500] transition-all hover:cursor-pointer' : 'hover:bg-[#292A2B] h-[40px] rounded-[12px] text-[16px] px-[16px] flex items-center leading-[24px] font-[500] transition-all hover:cursor-pointer'}`} href={"/"} >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          {session ? <>
            <Link className={`link ${pathname === '/register' ? ' bg-[#292A2B] h-[40px] rounded-[12px] text-[16px] px-[16px] flex items-center leading-[24px] font-[500] transition-all hover:cursor-pointer' : 'hover:bg-[#292A2B] h-[40px] flex rounded-[12px] text-[16px] px-[16px]  items-center leading-[24px] font-[500] transition-all hover:cursor-pointer'}`} href={"/register"} >
              Register
            </Link>
          </> : null}
        </NavbarItem>
        <NavbarItem>
          {session ? <Link className={`link ${pathname === '/subscriptions' ? ' bg-[#292A2B] h-[40px] rounded-[12px] text-[16px] px-[16px] flex items-center leading-[24px] font-[500] transition-all hover:cursor-pointer' : 'hover:bg-[#292A2B] h-[40px] rounded-[12px] text-[16px] px-[16px] flex items-center leading-[24px] font-[500] transition-all hover:cursor-pointer'}`
          } href={"/subscriptions"} >
            Subscriptions
          </Link> : null}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="center">
        <NavbarItem>
          <LoginButton session={session} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}


