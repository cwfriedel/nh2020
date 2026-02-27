import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter III: Results — Species & Habitat Relationships | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter3_1']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Ch. III Part 1' },
      ]}
      prev={{ href: '/chapter/2', label: 'Chapter II: Methods' }}
      next={{ href: '/chapter/3/2', label: 'Ch. III Part 2: Foothill Ecosystems' }}
    />
  )
}
