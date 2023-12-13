'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import { sidebarLinks } from '@/constants';

const Leftsidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth()

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-col flex-1 w-full gap-6 px-6">
        {sidebarLinks.map(item => {
          const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

          if (item.route === '/profile') item.route = `${item.route}/${userId}`
          

          return (
            <Link href={item.route} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`} key={item.label}>
              <Image src={item.imgURL} width={24} height={24} alt={item.label} />
              <p className='text-light-1 max-lg:hidden'>
                {item.label}
              </p>
            </Link>
          )
        })}
      </div>
      <div className='mt-10 px-6 '>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src='/assets/logout.svg' alt="logout" width={24} height={24} />
              <p className='text-light-2 max-lg:hidden '>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
};

export default Leftsidebar;
