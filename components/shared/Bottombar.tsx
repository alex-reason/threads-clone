'use client'
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "@/constants";

const Bottombar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(item => {
          const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
          return (
            <Link href={item.route} className={`bottombar_link ${isActive && 'bg-primary-500'}`} key={item.label}>
              <Image src={item.imgURL} width={24} height={24} alt={item.label} />
              <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                {item.label.split(/\s+./)[0]}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
export default Bottombar;