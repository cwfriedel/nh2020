import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter III: Results — Montane & Upper Montane Ecosystems | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter3_3a']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Ch. III Part 3' },
      ]}
      prev={{ href: '/chapter/3/2', label: 'Ch. III Part 2: Foothill Ecosystems' }}
      next={{ href: '/chapter/3/3b', label: 'Ch. III Part 4: Subalpine Ecosystems' }}
    />
  )
}
