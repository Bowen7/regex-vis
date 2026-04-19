export type RegexLibraryItem = {
  id: string
  name: string
  nameKey: string
  description: string
  descriptionKey: string
  regex: string
  flags: string[]
  category: RegexCategory
  testStrings: string[]
  tags: string[]
}

export type RegexCategory = 
  | 'phone'
  | 'email'
  | 'id_card'
  | 'url'
  | 'password'
  | 'numbers'
  | 'dates'
  | 'usernames'
  | 'ipv4'
  | 'ipv6'
  | 'hex_color'
  | 'html_tags'
  | 'whitespace'
  | 'other'

export const regexLibrary: RegexLibraryItem[] = [
  {
    id: 'phone-cn-mobile',
    name: '中国手机号',
    nameKey: 'Chinese Mobile Phone',
    description: '匹配中国大陆手机号码，支持13x、14x、15x、16x、17x、18x、19x号段',
    descriptionKey: 'Matches Chinese mainland mobile phone numbers, supporting 13x, 14x, 15x, 16x, 17x, 18x, 19x prefixes',
    regex: '^1[3-9]\\d{9}$',
    flags: [],
    category: 'phone',
    testStrings: ['13812345678', '19987654321', '1381234567'],
    tags: ['phone', 'mobile', 'china']
  },
  {
    id: 'phone-cn-landline',
    name: '中国座机号码',
    nameKey: 'Chinese Landline Phone',
    description: '匹配中国大陆座机号码，支持带区号和不带区号的格式',
    descriptionKey: 'Matches Chinese mainland landline phone numbers, with or without area code',
    regex: '^(0\\d{2,3}-?)?\\d{7,8}$',
    flags: [],
    category: 'phone',
    testStrings: ['010-12345678', '02187654321', '12345678'],
    tags: ['phone', 'landline', 'china']
  },
  {
    id: 'phone-international',
    name: '国际电话号码',
    nameKey: 'International Phone',
    description: '匹配国际格式的电话号码，支持+号开头和国家代码',
    descriptionKey: 'Matches international format phone numbers with + prefix and country code',
    regex: '^\\+?[1-9]\\d{1,14}$',
    flags: [],
    category: 'phone',
    testStrings: ['+1234567890', '+8613812345678', '1234567890'],
    tags: ['phone', 'international']
  },
  {
    id: 'email-standard',
    name: '标准邮箱',
    nameKey: 'Standard Email',
    description: '匹配标准的电子邮件地址格式',
    descriptionKey: 'Matches standard email address format',
    regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: [],
    category: 'email',
    testStrings: ['user@example.com', 'test.user+tag@domain.co.uk', 'invalid@'],
    tags: ['email', 'standard']
  },
  {
    id: 'email-strict',
    name: '严格邮箱',
    nameKey: 'Strict Email',
    description: '更严格的邮箱验证，限制特殊字符的使用',
    descriptionKey: 'Stricter email validation with limited special characters',
    regex: '^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9-]*\\.[a-zA-Z]{2,}$',
    flags: [],
    category: 'email',
    testStrings: ['user@example.com', 'test.user-name@domain.org', '.start@invalid.com'],
    tags: ['email', 'strict']
  },
  {
    id: 'id-card-cn-18',
    name: '中国身份证18位',
    nameKey: 'Chinese ID Card (18 digits)',
    description: '匹配中国大陆18位居民身份证号码，支持校验码验证',
    descriptionKey: 'Matches Chinese mainland 18-digit resident ID card numbers with checksum validation',
    regex: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx]$',
    flags: [],
    category: 'id_card',
    testStrings: ['110101199003077853', '31010119881015321X', '11010119900307785'],
    tags: ['id', 'china', '18-digit']
  },
  {
    id: 'id-card-cn-15',
    name: '中国身份证15位',
    nameKey: 'Chinese ID Card (15 digits)',
    description: '匹配中国大陆15位旧版居民身份证号码',
    descriptionKey: 'Matches Chinese mainland 15-digit old version resident ID card numbers',
    regex: '^[1-9]\\d{5}\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}$',
    flags: [],
    category: 'id_card',
    testStrings: ['110101900307785', '310101881015321'],
    tags: ['id', 'china', '15-digit', 'old']
  },
  {
    id: 'url-http',
    name: 'HTTP/HTTPS URL',
    nameKey: 'HTTP/HTTPS URL',
    description: '匹配HTTP或HTTPS协议的URL地址',
    descriptionKey: 'Matches URLs with HTTP or HTTPS protocol',
    regex: '^https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$',
    flags: ['i'],
    category: 'url',
    testStrings: ['https://www.example.com/path?query=1', 'http://test.org', 'ftp://invalid.com'],
    tags: ['url', 'http', 'https']
  },
  {
    id: 'url-general',
    name: '通用URL',
    nameKey: 'General URL',
    description: '匹配多种协议的URL，包括http、https、ftp、file等',
    descriptionKey: 'Matches URLs with various protocols including http, https, ftp, file, etc.',
    regex: '^(https?|ftp|file):\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]*$',
    flags: ['i'],
    category: 'url',
    testStrings: ['https://example.com', 'ftp://ftp.server.com/file', 'file:///C:/path/file.txt'],
    tags: ['url', 'ftp', 'file']
  },
  {
    id: 'url-domain',
    name: '域名',
    nameKey: 'Domain Name',
    description: '匹配域名格式，不包含协议',
    descriptionKey: 'Matches domain name format without protocol',
    regex: '^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',
    flags: [],
    category: 'url',
    testStrings: ['example.com', 'sub.domain.co.uk', '-invalid.com'],
    tags: ['url', 'domain']
  },
  {
    id: 'password-weak',
    name: '弱密码',
    nameKey: 'Weak Password',
    description: '匹配至少6位字符的密码（安全性较低）',
    descriptionKey: 'Matches passwords with at least 6 characters (low security)',
    regex: '^.{6,}$',
    flags: [],
    category: 'password',
    testStrings: ['password', '123456', 'abc'],
    tags: ['password', 'weak']
  },
  {
    id: 'password-medium',
    name: '中等强度密码',
    nameKey: 'Medium Password',
    description: '匹配至少8位，包含大小写字母和数字的密码',
    descriptionKey: 'Matches passwords with at least 8 characters, including uppercase, lowercase and numbers',
    regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$',
    flags: [],
    category: 'password',
    testStrings: ['Password123', 'MyP@ssword', 'password123'],
    tags: ['password', 'medium']
  },
  {
    id: 'password-strong',
    name: '强密码',
    nameKey: 'Strong Password',
    description: '匹配至少8位，包含大小写字母、数字和特殊字符的密码',
    descriptionKey: 'Matches strong passwords with at least 8 characters, including uppercase, lowercase, numbers and special characters',
    regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
    flags: [],
    category: 'password',
    testStrings: ['MyP@ssw0rd', 'Strong!123', 'weakpassword'],
    tags: ['password', 'strong']
  },
  {
    id: 'password-very-strong',
    name: '极强密码',
    nameKey: 'Very Strong Password',
    description: '匹配至少12位，包含大小写字母、数字、特殊字符，且无连续重复的密码',
    descriptionKey: 'Matches very strong passwords with at least 12 characters, no consecutive repeats',
    regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=\\[\\]{}|\\\\;:\\'\",.<>\\/?`~])(?!.*(.)\\1{2,}).{12,}$",
    flags: [],
    category: 'password',
    testStrings: ['MySuperP@ssw0rd!', 'C0mpl3x!P@ss#123', 'aaaabbbb1111'],
    tags: ['password', 'very-strong']
  },
  {
    id: 'number-integer',
    name: '整数',
    nameKey: 'Integer',
    description: '匹配正整数或负整数',
    descriptionKey: 'Matches positive or negative integers',
    regex: '^-?\\d+$',
    flags: [],
    category: 'numbers',
    testStrings: ['123', '-456', '12.34'],
    tags: ['number', 'integer']
  },
  {
    id: 'number-decimal',
    name: '小数',
    nameKey: 'Decimal Number',
    description: '匹配带小数位的数字',
    descriptionKey: 'Matches numbers with decimal places',
    regex: '^-?\\d+\\.\\d+$',
    flags: [],
    category: 'numbers',
    testStrings: ['123.45', '-67.89', '123'],
    tags: ['number', 'decimal']
  },
  {
    id: 'number-currency',
    name: '货币金额',
    nameKey: 'Currency Amount',
    description: '匹配货币格式，支持千位分隔符和两位小数',
    descriptionKey: 'Matches currency format with thousand separators and two decimal places',
    regex: '^\\d{1,3}(,\\d{3})*(\\.\\d{2})?$',
    flags: [],
    category: 'numbers',
    testStrings: ['1,234.56', '1234.56', '1,234,567'],
    tags: ['number', 'currency']
  },
  {
    id: 'number-percentage',
    name: '百分比',
    nameKey: 'Percentage',
    description: '匹配百分比格式的数字',
    descriptionKey: 'Matches percentage format numbers',
    regex: '^\\d+(\\.\\d+)?%$',
    flags: [],
    category: 'numbers',
    testStrings: ['50%', '99.99%', '100'],
    tags: ['number', 'percentage']
  },
  {
    id: 'date-yyyy-mm-dd',
    name: '日期 (YYYY-MM-DD)',
    nameKey: 'Date (YYYY-MM-DD)',
    description: '匹配ISO格式的日期，支持闰年验证',
    descriptionKey: 'Matches ISO format dates with leap year validation',
    regex: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    flags: [],
    category: 'dates',
    testStrings: ['2024-03-07', '2024-02-29', '2024-13-01'],
    tags: ['date', 'iso']
  },
  {
    id: 'date-dd/mm/yyyy',
    name: '日期 (DD/MM/YYYY)',
    nameKey: 'Date (DD/MM/YYYY)',
    description: '匹配欧洲格式的日期',
    descriptionKey: 'Matches European format dates',
    regex: '^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$',
    flags: [],
    category: 'dates',
    testStrings: ['07/03/2024', '31/12/2024', '32/01/2024'],
    tags: ['date', 'european']
  },
  {
    id: 'date-mm/dd/yyyy',
    name: '日期 (MM/DD/YYYY)',
    nameKey: 'Date (MM/DD/YYYY)',
    description: '匹配美国格式的日期',
    descriptionKey: 'Matches US format dates',
    regex: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$',
    flags: [],
    category: 'dates',
    testStrings: ['03/07/2024', '12/31/2024', '13/01/2024'],
    tags: ['date', 'us']
  },
  {
    id: 'time-hh:mm',
    name: '时间 (HH:MM)',
    nameKey: 'Time (HH:MM)',
    description: '匹配24小时制的时间格式',
    descriptionKey: 'Matches 24-hour format time',
    regex: '^([01]\\d|2[0-3]):[0-5]\\d$',
    flags: [],
    category: 'dates',
    testStrings: ['14:30', '23:59', '25:00'],
    tags: ['time', '24-hour']
  },
  {
    id: 'time-hh:mm:ss',
    name: '时间 (HH:MM:SS)',
    nameKey: 'Time (HH:MM:SS)',
    description: '匹配带秒的24小时制时间格式',
    descriptionKey: 'Matches 24-hour format time with seconds',
    regex: '^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$',
    flags: [],
    category: 'dates',
    testStrings: ['14:30:45', '23:59:59', '24:00:00'],
    tags: ['time', '24-hour', 'seconds']
  },
  {
    id: 'username-simple',
    name: '简单用户名',
    nameKey: 'Simple Username',
    description: '匹配由字母、数字和下划线组成的用户名，4-20个字符',
    descriptionKey: 'Matches usernames with letters, numbers and underscores, 4-20 characters',
    regex: '^[a-zA-Z0-9_]{4,20}$',
    flags: [],
    category: 'usernames',
    testStrings: ['my_username', 'user123', 'ab'],
    tags: ['username', 'simple']
  },
  {
    id: 'username-complex',
    name: '复杂用户名',
    nameKey: 'Complex Username',
    description: '匹配以字母开头，包含字母、数字、下划线和连字符的用户名',
    descriptionKey: 'Matches usernames starting with letter, containing letters, numbers, underscores and hyphens',
    regex: '^[a-zA-Z][a-zA-Z0-9_-]{2,19}$',
    flags: [],
    category: 'usernames',
    testStrings: ['my-user_name', 'User123-name', '123start'],
    tags: ['username', 'complex']
  },
  {
    id: 'ipv4',
    name: 'IPv4地址',
    nameKey: 'IPv4 Address',
    description: '匹配IPv4地址格式',
    descriptionKey: 'Matches IPv4 address format',
    regex: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
    flags: [],
    category: 'ipv4',
    testStrings: ['192.168.1.1', '255.255.255.255', '256.0.0.1'],
    tags: ['ip', 'ipv4', 'network']
  },
  {
    id: 'ipv4-cidr',
    name: 'IPv4 CIDR',
    nameKey: 'IPv4 CIDR',
    description: '匹配带CIDR前缀的IPv4地址',
    descriptionKey: 'Matches IPv4 addresses with CIDR prefix',
    regex: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(\\/(3[0-2]|[12]?\\d))?$',
    flags: [],
    category: 'ipv4',
    testStrings: ['192.168.1.0/24', '10.0.0.0/8', '192.168.1.1/33'],
    tags: ['ip', 'ipv4', 'cidr', 'network']
  },
  {
    id: 'ipv6',
    name: 'IPv6地址',
    nameKey: 'IPv6 Address',
    description: '匹配IPv6地址格式',
    descriptionKey: 'Matches IPv6 address format',
    regex: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$',
    flags: ['i'],
    category: 'ipv6',
    testStrings: ['2001:0db8:85a3:0000:0000:8a2e:0370:7334', '::1', 'fe80::1'],
    tags: ['ip', 'ipv6', 'network']
  },
  {
    id: 'hex-color-6',
    name: '6位十六进制颜色',
    nameKey: '6-digit Hex Color',
    description: '匹配6位十六进制颜色代码',
    descriptionKey: 'Matches 6-digit hexadecimal color codes',
    regex: '^#?([0-9a-fA-F]{6})$',
    flags: ['i'],
    category: 'hex_color',
    testStrings: ['#FF5733', '33FF57', '#GGGGGG'],
    tags: ['color', 'hex']
  },
  {
    id: 'hex-color-3',
    name: '3位十六进制颜色',
    nameKey: '3-digit Hex Color',
    description: '匹配3位十六进制颜色代码',
    descriptionKey: 'Matches 3-digit hexadecimal color codes',
    regex: '^#?([0-9a-fA-F]{3})$',
    flags: ['i'],
    category: 'hex_color',
    testStrings: ['#F53', 'f53', '#GGH'],
    tags: ['color', 'hex', 'short']
  },
  {
    id: 'hex-color-rgba',
    name: 'RGBA颜色',
    nameKey: 'RGBA Color',
    description: '匹配CSS rgba()颜色格式',
    descriptionKey: 'Matches CSS rgba() color format',
    regex: '^rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*(?:,\\s*(0?\\.?\\d+|1))?\\s*\\)$',
    flags: ['i'],
    category: 'hex_color',
    testStrings: ['rgba(255, 87, 51, 0.5)', 'rgb(255, 87, 51)', 'rgba(300, 0, 0, 1)'],
    tags: ['color', 'rgba', 'css']
  },
  {
    id: 'html-tag-open',
    name: 'HTML开始标签',
    nameKey: 'HTML Opening Tag',
    description: '匹配HTML开始标签',
    descriptionKey: 'Matches HTML opening tags',
    regex: '^<[a-zA-Z][a-zA-Z0-9]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9_.:-]*(?:\\s*=\\s*(?:\'[^\']*\'|"[^"]*"|[^\\s>]+))?)*\\s*\\/?>$',
    flags: ['i'],
    category: 'html_tags',
    testStrings: ['<div class="container">', '<img src="test.png"/>', '<>'],
    tags: ['html', 'tag', 'opening']
  },
  {
    id: 'html-tag-close',
    name: 'HTML结束标签',
    nameKey: 'HTML Closing Tag',
    description: '匹配HTML结束标签',
    descriptionKey: 'Matches HTML closing tags',
    regex: '^</[a-zA-Z][a-zA-Z0-9]*\\s*>$',
    flags: ['i'],
    category: 'html_tags',
    testStrings: ['</div>', '</span>', '<div>'],
    tags: ['html', 'tag', 'closing']
  },
  {
    id: 'html-comment',
    name: 'HTML注释',
    nameKey: 'HTML Comment',
    description: '匹配HTML注释',
    descriptionKey: 'Matches HTML comments',
    regex: '^<!--[\\s\\S]*?-->$',
    flags: [],
    category: 'html_tags',
    testStrings: ['<!-- This is a comment -->', '<!-- Multi-line\ncomment -->'],
    tags: ['html', 'comment']
  },
  {
    id: 'whitespace-leading',
    name: '前导空白',
    nameKey: 'Leading Whitespace',
    description: '匹配行首的空白字符',
    descriptionKey: 'Matches leading whitespace characters',
    regex: '^[ \\t]+',
    flags: ['gm'],
    category: 'whitespace',
    testStrings: ['  leading spaces', '\ttab indent', 'no leading'],
    tags: ['whitespace', 'leading']
  },
  {
    id: 'whitespace-trailing',
    name: '尾随空白',
    nameKey: 'Trailing Whitespace',
    description: '匹配行尾的空白字符',
    descriptionKey: 'Matches trailing whitespace characters',
    regex: '[ \\t]+$',
    flags: ['gm'],
    category: 'whitespace',
    testStrings: ['trailing spaces  ', 'tab indent\t', 'no trailing'],
    tags: ['whitespace', 'trailing']
  },
  {
    id: 'whitespace-multiple',
    name: '多个空格',
    nameKey: 'Multiple Spaces',
    description: '匹配多个连续的空格',
    descriptionKey: 'Matches multiple consecutive spaces',
    regex: ' {2,}',
    flags: ['g'],
    category: 'whitespace',
    testStrings: ['multiple  spaces', 'single space', 'three   spaces'],
    tags: ['whitespace', 'multiple']
  },
  {
    id: 'uuid',
    name: 'UUID',
    nameKey: 'UUID',
    description: '匹配通用唯一标识符（UUID）',
    descriptionKey: 'Matches Universally Unique Identifiers (UUID)',
    regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
    flags: ['i'],
    category: 'other',
    testStrings: ['550e8400-e29b-41d4-a716-446655440000', '00000000-0000-0000-0000-000000000000'],
    tags: ['uuid', 'guid', 'identifier']
  },
  {
    id: 'credit-card',
    name: '信用卡号',
    nameKey: 'Credit Card Number',
    description: '匹配常见信用卡号格式（Visa, Mastercard, Amex等）',
    descriptionKey: 'Matches common credit card number formats (Visa, Mastercard, Amex, etc.)',
    regex: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12})$',
    flags: [],
    category: 'other',
    testStrings: ['4111111111111111', '5500000000000004', '378282246310005'],
    tags: ['credit-card', 'payment', 'luhn']
  },
  {
    id: 'mac-address',
    name: 'MAC地址',
    nameKey: 'MAC Address',
    description: '匹配网络设备MAC地址',
    descriptionKey: 'Matches network device MAC addresses',
    regex: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
    flags: [],
    category: 'other',
    testStrings: ['00:1A:2B:3C:4D:5E', '00-1A-2B-3C-4D-5E', '001A2B3C4D5E'],
    tags: ['mac', 'network', 'hardware']
  },
  {
    id: 'base64',
    name: 'Base64编码',
    nameKey: 'Base64 Encoded',
    description: '匹配Base64编码的字符串',
    descriptionKey: 'Matches Base64 encoded strings',
    regex: '^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$',
    flags: [],
    category: 'other',
    testStrings: ['SGVsbG8=', 'dGVzdA==', 'invalid!'],
    tags: ['base64', 'encoding']
  },
  {
    id: 'social-security-us',
    name: '美国SSN',
    nameKey: 'US Social Security Number',
    description: '匹配美国社会安全号码',
    descriptionKey: 'Matches US Social Security Numbers',
    regex: '^\\d{3}-?\\d{2}-?\\d{4}$',
    flags: [],
    category: 'other',
    testStrings: ['123-45-6789', '123456789', '1234-56-789'],
    tags: ['ssn', 'us', 'identification']
  }
]

export const regexCategories: { key: RegexCategory; labelKey: string; icon: string }[] = [
  { key: 'phone', labelKey: 'Phone Numbers', icon: 'phone' },
  { key: 'email', labelKey: 'Email Addresses', icon: 'email' },
  { key: 'id_card', labelKey: 'ID Cards', icon: 'id-card' },
  { key: 'url', labelKey: 'URLs & Domains', icon: 'link' },
  { key: 'password', labelKey: 'Passwords', icon: 'lock' },
  { key: 'numbers', labelKey: 'Numbers', icon: 'hash' },
  { key: 'dates', labelKey: 'Dates & Times', icon: 'calendar' },
  { key: 'usernames', labelKey: 'Usernames', icon: 'user' },
  { key: 'ipv4', labelKey: 'IPv4 Addresses', icon: 'globe' },
  { key: 'ipv6', labelKey: 'IPv6 Addresses', icon: 'globe-simple' },
  { key: 'hex_color', labelKey: 'Colors', icon: 'palette' },
  { key: 'html_tags', labelKey: 'HTML Tags', icon: 'code' },
  { key: 'whitespace', labelKey: 'Whitespace', icon: 'space' },
  { key: 'other', labelKey: 'Other', icon: 'dots-three' }
]

export function getRegexByCategory(category: RegexCategory): RegexLibraryItem[] {
  return regexLibrary.filter(item => item.category === category)
}

export function searchRegexLibrary(query: string): RegexLibraryItem[] {
  const lowerQuery = query.toLowerCase()
  return regexLibrary.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    item.regex.toLowerCase().includes(lowerQuery)
  )
}

export function getRegexById(id: string): RegexLibraryItem | undefined {
  return regexLibrary.find(item => item.id === id)
}
