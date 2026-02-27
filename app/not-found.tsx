import NavBar from '@/components/NavBar'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <NavBar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl text-center">
          <div className="text-6xl mb-6">📀</div>
          <h1 className="text-3xl font-bold text-forest mb-4">File Not Available</h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            This figure, table, or appendix was originally distributed on CD-ROM and could not be
            included in this digital version of the report.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            The original <em>Nevada County Natural Resources Report</em> (2002) included over 150
            PDF figures and maps stored on two CD-ROMs. A subset of those files has been digitized;
            the remainder may be available from{' '}
            <a
              href="https://www.yubawatershedinstitute.org"
              className="text-water hover:text-forest underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yuba Watershed Institute
            </a>{' '}
            or Nevada County Planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 bg-forest text-white rounded-lg hover:bg-forest/90 transition-colors font-medium"
            >
              ← Return Home
            </Link>
            <Link
              href="/tables-figures"
              className="px-5 py-2.5 border border-forest text-forest rounded-lg hover:bg-forest/5 transition-colors font-medium"
            >
              Tables & Figures Index
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
