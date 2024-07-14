import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LanguageSelect() {
  const { i18n } = useTranslation()
  const language = i18n.language

  return (
    <Select value={language} onValueChange={i18n.changeLanguage}>
      <SelectTrigger className="w-[100px] px-2 text-xs h-8">
        <SelectValue placeholder="Select a language" className="" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en" className="text-xs">English</SelectItem>
          <SelectItem value="cn" className="text-xs">简体中文</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
