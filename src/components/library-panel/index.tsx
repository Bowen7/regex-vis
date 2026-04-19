import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MagnifyingGlass,
  Plus,
  Check,
  Phone,
  Envelope,
  IdentificationCard,
  Link,
  Lock,
  Hash,
  Calendar,
  User,
  Globe,
  GlobeSimple,
  Palette,
  Code,
  Square,
  DotsThree,
  Copy,
  Eye
} from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  regexLibrary,
  regexCategories,
  searchRegexLibrary,
  getRegexByCategory,
  RegexLibraryItem,
  RegexCategory
} from '@/utils/regex-library'
import { useCopyToClipboard } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'

type Props = {
  onLoadRegex: (regex: string, flags: string[]) => void
}

const categoryIcons: Record<RegexCategory, React.ReactNode> = {
  phone: <Phone className="w-4 h-4" />,
  email: <Envelope className="w-4 h-4" />,
  id_card: <IdentificationCard className="w-4 h-4" />,
  url: <Link className="w-4 h-4" />,
  password: <Lock className="w-4 h-4" />,
  numbers: <Hash className="w-4 h-4" />,
  dates: <Calendar className="w-4 h-4" />,
  usernames: <User className="w-4 h-4" />,
  ipv4: <Globe className="w-4 h-4" />,
  ipv6: <GlobeSimple className="w-4 h-4" />,
  hex_color: <Palette className="w-4 h-4" />,
  html_tags: <Code className="w-4 h-4" />,
  whitespace: <Square className="w-4 h-4" />,
  other: <DotsThree className="w-4 h-4" />
}

function LibraryPanel({ onLoadRegex }: Props) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [, copy] = useCopyToClipboard()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<RegexLibraryItem | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredItems = useMemo(() => {
    if (searchQuery.trim()) {
      return searchRegexLibrary(searchQuery)
    }
    
    if (activeCategory === 'all') {
      return regexLibrary
    }
    
    return getRegexByCategory(activeCategory as RegexCategory)
  }, [searchQuery, activeCategory])

  const handleLoadRegex = (item: RegexLibraryItem) => {
    onLoadRegex(item.regex, item.flags)
    toast({
      description: t('Regex loaded successfully')
    })
  }

  const handleCopyRegex = (item: RegexLibraryItem) => {
    const flagsStr = item.flags.length > 0 ? `/${item.flags.join('')}` : ''
    copy(`/${item.regex}/${flagsStr}`)
    toast({
      description: t('Regex copied to clipboard')
    })
  }

  const renderRegexItem = (item: RegexLibraryItem) => {
    const isSelected = selectedItem?.id === item.id
    const flagsStr = item.flags.length > 0 ? item.flags.join('') : ''

    return (
      <div
        key={item.id}
        className={`p-3 rounded-lg border transition-all cursor-pointer ${
          isSelected 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onClick={() => setSelectedItem(isSelected ? null : item)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-sm truncate">{item.name}</h4>
              {flagsStr && (
                <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                  {flagsStr}
                </span>
              )}
            </div>
            <code className="text-xs text-primary font-mono mt-1 block truncate">
              {item.regex}
            </code>
          </div>
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                handleCopyRegex(item)
              }}
              title={t('Copy regex')}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                handleLoadRegex(item)
              }}
              title={t('Load regex')}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {isSelected && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t('Description')}</Label>
              <p className="text-sm mt-1">{item.description}</p>
            </div>
            
            {item.testStrings.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">{t('Test Strings')}</Label>
                <div className="mt-1 space-y-1">
                  {item.testStrings.map((testStr, idx) => {
                    let matches = false
                    try {
                      const regex = new RegExp(item.regex, item.flags.join(''))
                      matches = regex.test(testStr)
                    } catch {
                      // ignore
                    }
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between text-xs font-mono px-2 py-1 rounded ${
                          matches 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        }`}
                      >
                        <span className="truncate">"{testStr}"</span>
                        <span className="ml-2 flex-shrink-0">
                          {matches ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <span className="text-xs">✗</span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {item.tags.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">{t('Tags')}</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2 pt-1">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => handleLoadRegex(item)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {t('Load & Visualize')}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderCategoryList = () => {
    const categories = [
      { key: 'all', labelKey: 'All', icon: <MagnifyingGlass className="w-4 h-4" /> },
      ...regexCategories.map(cat => ({
        key: cat.key,
        labelKey: cat.labelKey,
        icon: categoryIcons[cat.key]
      }))
    ]

    return (
      <TabsList className="grid grid-cols-2 gap-1 h-auto">
        {categories.map(cat => (
          <TabsTrigger
            key={cat.key}
            value={cat.key}
            className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="mr-1.5">{cat.icon}</span>
            <span className="text-xs">{t(cat.labelKey)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('Search Regex Library')}</Label>
        <div className="relative">
          <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value)
              if (value) {
                setActiveCategory('all')
              }
            }}
            placeholder={t('Search by name, description, tags...')}
            className="pl-9"
          />
        </div>
      </div>

      {!searchQuery && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <ScrollArea className="h-32">
            {renderCategoryList()}
          </ScrollArea>
        </Tabs>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t('Results')}</Label>
          <span className="text-xs text-muted-foreground">
            {filteredItems.length} {t('items found')}
          </span>
        </div>
        
        <ScrollArea className="h-80 border rounded-md">
          <div className="p-2 space-y-2">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => renderRegexItem(item))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MagnifyingGlass className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('No regex patterns found')}</p>
                <p className="text-xs mt-1">{t('Try a different search term or category')}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          <strong>{t('Tip:')}</strong> {t('Click on a pattern to see details, test strings, and tags. Click the + button to load and visualize the regex.')}
        </p>
      </div>
    </div>
  )
}

export default LibraryPanel
