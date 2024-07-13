import antfu from '@antfu/eslint-config'

export default antfu({ react: true, rules: {
  'react-refresh/only-export-components': 'off',
} })
