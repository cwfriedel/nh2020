import NavBar from './NavBar'

interface ReportPageProps {
  title: string
  html: string
  breadcrumb?: { label: string; href?: string }[]
  next?: { href: string; label: string }
  prev?: { href: string; label: string }
}

export default function ReportPage({ title, html, breadcrumb, next, prev }: ReportPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <NavBar />

      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="bg-sage/10 border-b border-sage/30 px-4 py-2 text-xs text-gray-600 print:hidden">
          <div className="max-w-5xl mx-auto flex items-center gap-2">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-400">›</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="text-water hover:underline">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-700 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <header className="mb-8 pb-4 border-b-2 border-sage/40">
          <h1 className="text-3xl font-bold text-forest leading-tight">{title}</h1>
          <div className="mt-2 text-xs text-gray-500">
            Nevada County Natural Resources Report · Natural Heritage 2020 · © 2002 Nevada County Planning Department
          </div>
        </header>

        {/* Report content */}
        <article
          className="report-content prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: html.replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy" decoding="async"') }}
        />

        {/* Prev/Next navigation */}
        {(prev || next) && (
          <nav className="mt-12 pt-6 border-t border-sage/30 flex justify-between items-center print:hidden">
            {prev ? (
              <a
                href={prev.href}
                className="flex items-center gap-2 text-sm text-water hover:text-forest transition-colors group"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                <span>{prev.label}</span>
              </a>
            ) : (
              <div />
            )}
            {next && (
              <a
                href={next.href}
                className="flex items-center gap-2 text-sm text-water hover:text-forest transition-colors group"
              >
                <span>{next.label}</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>
            )}
          </nav>
        )}
      </main>

      <footer className="bg-forest text-white/70 text-xs py-4 px-6 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-2">
          <span>© 2002 Nevada County Planning Department · Natural Heritage 2020</span>
          <span>Prepared by Dr. Edward C. Beedy & Dr. Peter Brussard</span>
        </div>
      </footer>
    </div>
  )
}
