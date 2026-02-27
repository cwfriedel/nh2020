import ReportPage from '@/components/ReportPage'
import { pages } from '@/lib/content'

export const metadata = {
  title: 'Tables, Figures & Appendices | Nevada County Natural Resources Report',
}

export default function TablesFiguresPage() {
  const data = pages['tables_figures']
  return (
    <ReportPage
      title={data.title}
      html={data.html}
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Tables, Figures & Appendices' },
      ]}
      prev={{ href: '/chapter/4', label: 'Chapter IV: Information Sources' }}
    />
  )
}
