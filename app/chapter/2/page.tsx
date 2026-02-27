import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Chapter II: Methods | Nevada County Natural Resources Report',
}

export default function Page() {
  const data = pages['chapter2']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Chapter II' },
      ]}
      prev={{ href: '/chapter/1', label: 'Chapter I: Introduction' }}
      next={{ href: '/chapter/3/1', label: 'Chapter III: Results' }}
    />
  )
}
