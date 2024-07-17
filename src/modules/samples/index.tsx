import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SimpleGraph from '@/modules/graph/simple-graph'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const samples = [
  { desc: '1. Whole Numbers', label: '/^\\d+$/', regex: '^\\d+$' },
  {
    desc: '2. Decimal Numbers',
    label: '/^\\d*\\.\\d+$/',
    regex: '^\\d*\\.\\d+$',
  },
  {
    desc: '3. Whole + Decimal Numbers',
    label: '/^\\d*(\\.\\d+)?$/',
    regex: '^\\d*(\\.\\d+)?$',
  },
  {
    desc: '4. Negative, Positive Whole + Decimal Numbers',
    label: '/^-?\\d*(\\.\\d+)?$/',
    regex: '^-?\\d*(\\.\\d+)?$',
  },
  {
    desc: '5. Url',
    label:
      '/^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#()?&//=]*)$/',
    regex:
      '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#()?&//=]*)$',
  },
  {
    desc: '6. Date Format YYYY-MM-dd',
    label: '/^[12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/',
    regex: '^[12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
  },
]
function Samples() {
  const { t } = useTranslation()
  return (
    <ScrollArea className="flex-1">
      <div>
        <div className="max-w-7xl my-0 mx-auto p-6 flex flex-col gap-y-12">
          {samples.map(({ desc, label, regex }) => {
            const linkTo = `/?r=${encodeURIComponent(`/${regex}/`)}`
            return (
              <div key={regex}>
                <Link to={linkTo}>
                  <span>{t(desc)}</span>
                  :
                  <span className="ml-2 text-teal-400 font-mono text-sm">{label}</span>
                </Link>
                <ScrollArea>
                  <Link to={linkTo}>
                    <SimpleGraph regex={regex} />
                  </Link>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}

export default Samples
