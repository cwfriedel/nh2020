import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Executive Summary | Nevada County Natural Resources Report',
}

export default function SummaryPage() {
  const data = pages['summary']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Executive Summary' },
      ]}
      next={{ href: '/chapter/1', label: 'Chapter I: Introduction' }}
    />
  )
}
