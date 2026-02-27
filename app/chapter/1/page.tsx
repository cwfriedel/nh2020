import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter I: Introduction | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter1']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Chapter I' },
      ]}
      prev={{ href: '/summary', label: 'Executive Summary' }}
      next={{ href: '/chapter/2', label: 'Chapter II: Methods' }}
    />
  )
}
