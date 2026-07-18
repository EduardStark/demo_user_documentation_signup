'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import wbpLogo from '@/data/images/WBP_logo.jpeg'
import zirveLogo from '@/data/images/Zirve_logo.png'

const links = [
  { label: 'Inicio', href: '/' },
  { label: 'Registro', href: '/registro' },
  { label: 'Credenciales', href: '/credenciales' },
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="flex h-full w-56 flex-col bg-zinc-900">
      {/* Client branding */}
      <div className="flex items-center justify-center border-b border-zinc-800 px-4 py-4">
        <Image
          src={wbpLogo}
          alt="White Box Project"
          width={70}
          height={70}
          className="rounded-full"
          priority
        />
      </div>

      {/* Nav links */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Dashboard
        </span>
        {links.map(({ label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Developer credit */}
      <div className="flex items-center justify-center border-t border-zinc-800 px-4 py-4">
        <Image
          src={zirveLogo}
          alt="Zirve"
          width={64}
          height={64}
          className="mix-blend-screen"
        />
      </div>
    </nav>
  )
}
