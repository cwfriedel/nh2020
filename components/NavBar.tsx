'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/summary', label: 'Executive Summary' },
  {
    label: 'Chapter I: Introduction',
    href: '/chapter/1',
  },
  {
    label: 'Chapter II: Methods',
    href: '/chapter/2',
  },
  {
    label: 'Chapter III: Results',
    href: '#',
    children: [
      { href: '/chapter/3/1', label: 'Species & Habitat' },
      { href: '/chapter/3/2', label: 'Ecosystems Pt. 1' },
      { href: '/chapter/3/3a', label: 'Ecosystems Pt. 2' },
      { href: '/chapter/3/3b', label: 'Ecosystems Pt. 3' },
      { href: '/chapter/3/4', label: 'Landscape Features' },
    ],
  },
  { href: '/chapter/4', label: 'Chapter IV: Sources' },
  { href: '/tables-figures', label: 'Tables & Figures' },
  { href: '/map', label: '🗺 Interactive Map' },
  { href: '/metadata', label: 'GIS Metadata' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  return (
    <nav className="bg-forest text-white shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="text-2xl">🌲</span>
            <div>
              <div className="font-bold text-sm leading-tight">Nevada County</div>
              <div className="text-xs text-sage leading-tight">Natural Resources Report</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <button className="px-3 py-2 text-xs font-medium rounded hover:bg-white/10 transition-colors flex items-center gap-1">
                    {item.label}
                    <span className="text-xs opacity-60">▾</span>
                  </button>
                  <div className="absolute top-full left-0 bg-forest border border-white/20 rounded shadow-xl min-w-48 z-50 hidden group-hover:block">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-2 text-xs hover:bg-white/10 no-underline transition-colors ${
                          pathname === child.href ? 'bg-white/20' : ''
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`px-3 py-2 text-xs font-medium rounded hover:bg-white/10 transition-colors no-underline ${
                    pathname === item.href ? 'bg-white/20' : ''
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-white/20">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex justify-between"
                    onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                  >
                    {item.label} <span>{expandedItem === item.label ? '▴' : '▾'}</span>
                  </button>
                  {expandedItem === item.label && (
                    <div className="pl-6 border-l border-white/20 ml-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-xs hover:bg-white/10 no-underline"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="block px-4 py-2 text-sm hover:bg-white/10 no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
