import NavBar from '@/components/NavBar'
import Link from 'next/link'

const chapters = [
  {
    href: '/summary',
    title: 'Executive Summary',
    desc: 'A concise overview of Nevada County\'s natural resources, methodology, and key findings across all watershed areas.',
    icon: '📋',
  },
  {
    href: '/chapter/1',
    title: 'Chapter I: Introduction',
    desc: 'Background on Nevada County\'s General Plan, the Natural Heritage 2020 initiative, and the goals of this scientific report.',
    icon: '📖',
  },
  {
    href: '/chapter/2',
    title: 'Chapter II: Methods',
    desc: 'Watershed mapping approach, GIS database compilation, vegetation classification, species surveys, and peer review process.',
    icon: '🔬',
  },
  {
    href: '/chapter/3/1',
    title: 'Chapter III: Results',
    desc: 'Detailed findings on plant diversity, animal species, large- and small-patch ecosystems, and special habitats across 100 watersheds.',
    icon: '🌿',
    sub: [
      { href: '/chapter/3/1', label: 'Species & Habitat Relationships' },
      { href: '/chapter/3/2', label: 'Foothill & Lower Montane Ecosystems' },
      { href: '/chapter/3/3a', label: 'Montane & Upper Montane Ecosystems' },
      { href: '/chapter/3/3b', label: 'Subalpine & Great Basin Ecosystems' },
      { href: '/chapter/3/4', label: 'Landscape Features' },
    ],
  },
  {
    href: '/chapter/4',
    title: 'Chapter IV: Information Sources',
    desc: 'Complete bibliography and list of data sources used in preparing this report and the accompanying GIS database.',
    icon: '📚',
  },
  {
    href: '/tables-figures',
    title: 'Tables, Figures & Appendices',
    desc: 'All supporting tables, maps, and appendices including species lists, habitat matrices, and watershed data.',
    icon: '📊',
  },
  {
    href: '/map',
    title: 'Interactive Map',
    desc: 'Explore Nevada County\'s watersheds, elevation zones, and natural features on an interactive map.',
    icon: '🗺',
  },
  {
    href: '/metadata',
    title: 'GIS Metadata',
    desc: 'FGDC-compliant metadata for all spatial datasets and GIS coverages included with this report.',
    icon: '🗂',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <NavBar />

      {/* Hero */}
      <section
        className="relative bg-forest text-white overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-16">
          <div className="text-sage text-sm font-semibold uppercase tracking-widest mb-3">
            Natural Heritage 2020
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Nevada County<br />
            <span className="text-sage">Natural Resources Report</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-6">
            A comprehensive scientific analysis of watersheds, habitats, and plant and animal
            species across Nevada County, California.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/summary"
              className="bg-sage hover:bg-sage/80 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors no-underline text-sm"
            >
              Read Executive Summary
            </Link>
            <Link
              href="/map"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg border border-white/30 transition-colors no-underline text-sm"
            >
              🗺 View Interactive Map
            </Link>
          </div>
        </div>
      </section>

      {/* Full-width feature image */}
      <div className="w-full overflow-hidden" style={{ maxHeight: '420px' }}>
        <img
          src="/images/upscaled/redfoxpup.jpg"
          alt="Red fox pup, Nevada County"
          className="w-full object-cover"
          style={{ maxHeight: '420px' }}
        />
      </div>

      {/* Stats bar */}
      <div className="bg-sage/20 border-y border-sage/30">
        <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '100', label: 'Watersheds Mapped' },
            { value: '1,814', label: 'Plant Taxa' },
            { value: '27', label: 'Large-Patch Ecosystems' },
            { value: '2002', label: 'Publication Year' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-forest">{stat.value}</div>
              <div className="text-xs text-gray-600 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Report sections */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <h2 className="text-2xl font-bold text-forest mb-6">Report Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {chapters.map((ch) => (
            <Link
              key={ch.href}
              href={ch.href}
              className="group bg-white rounded-xl shadow-sm border border-sage/20 hover:border-sage/50 hover:shadow-md transition-all p-5 no-underline"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-forest group-hover:text-bark transition-colors text-sm">
                    {ch.title}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">{ch.desc}</p>
                  {ch.sub && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ch.sub.map((s) => (
                        <span
                          key={s.href}
                          className="text-xs bg-sage/10 text-forest/80 px-2 py-0.5 rounded"
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* About box */}
        <div className="mt-10 bg-white rounded-xl border border-sage/20 shadow-sm p-6">
          <h2 className="font-bold text-forest text-lg mb-3">About This Report</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Prepared for the <strong>Nevada County Planning Department</strong> as part of the
            Natural Heritage 2020 initiative, this report provides a scientifically sound analysis
            of Nevada County's watersheds, habitats, and species. It was prepared by{' '}
            <strong>Dr. Edward C. Beedy</strong> (Sierra Business Council) and{' '}
            <strong>Dr. Peter Brussard</strong> (University of Nevada, Reno).
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The report covers the three major drainage basins — the <strong>Yuba</strong>,{' '}
            <strong>Bear</strong>, and <strong>Truckee</strong> rivers — across 100 planning
            watersheds, documenting 1,814 plant taxa (≈26% of California's flora) and hundreds of
            vertebrate species across 27 large-patch ecosystems.
          </p>
          <div className="mt-4 pt-4 border-t border-sage/20">
            <h3 className="font-semibold text-forest text-sm mb-2">Acknowledgements</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              The authors extend their gratitude to the following peer reviewers who provided
              detailed comments and fact-checking of the entire document on short notice:
            </p>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-0.5 list-none pl-0">
              {[
                'Ms. Vicki Campbell, U.S. Fish and Wildlife Service, Sacramento',
                'Dr. Frank Davis, Donald Bren School of Environmental Science, University of California Santa Barbara',
                'Mr. Jeff Finn, Regional Wildlife Biologist, California Department of Fish and Game, Nevada County',
                'Dr. Jim Gaither, The Nature Conservancy, California Field Office, San Francisco',
                'Dr. John Harris, Biology Department, Mills College, Oakland',
                'Mr. John Koltun, Geographic Resource Solutions, Anchorage, Alaska',
                'Dr. William F. Laudenslayer, Jr., U.S. Forest Service, Fresno',
                'Dr. Thomas Parker, Biology Department, San Francisco State University',
                'Dr. Michael Soulé, Professor Emeritus, College of Natural Resources, University of California, Santa Cruz',
                'Dr. Peter Stine, U.S. Forest Service, Sacramento',
              ].map((name) => (
                <li key={name} className="before:content-['·'] before:mr-2 before:text-sage">
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-sage/20 text-xs text-gray-500">
            © 2002 Nevada County Planning Department · Design © 2002 Centauria.com ·
            Digitally preserved and modernized for public access
          </div>
        </div>
      </main>

      <footer className="bg-forest text-white/70 text-xs py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-2">
          <span>© 2002 Nevada County Planning Department · Natural Heritage 2020</span>
          <span>Prepared by Dr. Edward C. Beedy & Dr. Peter Brussard</span>
        </div>
      </footer>
    </div>
  )
}
