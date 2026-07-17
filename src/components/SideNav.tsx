'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Inicio', href: '/' },
  { label: 'Registro', href: '/registro' },
  { label: 'Credenciales', href: '/credenciales' },
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="flex h-full w-56 flex-col gap-1 bg-zinc-900 p-4">
      <span className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
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
    </nav>
  )
}
