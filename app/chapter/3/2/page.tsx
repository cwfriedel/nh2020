import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter III: Results — Foothill & Lower Montane Ecosystems | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter3_2']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Ch. III Part 2' },
      ]}
      prev={{ href: '/chapter/3/1', label: 'Ch. III Part 1: Species & Habitat' }}
      next={{ href: '/chapter/3/3a', label: 'Ch. III Part 3: Montane Ecosystems' }}
    />
  )
}
