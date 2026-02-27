import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter III: Results — Landscape Features | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter3_4']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Ch. III Part 5' },
      ]}
      prev={{ href: '/chapter/3/3b', label: 'Ch. III Part 4: Subalpine Ecosystems' }}
      next={{ href: '/chapter/4', label: 'Chapter IV: Information Sources' }}
    />
  )
}
