import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter III: Results — Subalpine & Great Basin Ecosystems | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter3_3b']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Ch. III Part 4' },
      ]}
      prev={{ href: '/chapter/3/3a', label: 'Ch. III Part 3: Montane Ecosystems' }}
      next={{ href: '/chapter/3/4', label: 'Ch. III Part 5: Landscape Features' }}
    />
  )
}
