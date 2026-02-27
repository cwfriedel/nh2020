import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter IV: Information Sources | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter4']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Chapter IV' },
      ]}
      prev={{ href: '/chapter/3/4', label: 'Ch. III Part 5: Landscape Features' }}
      next={{ href: '/tables-figures', label: 'Tables, Figures & Appendices' }}
    />
  )
}
