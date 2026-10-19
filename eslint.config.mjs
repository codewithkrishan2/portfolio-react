// eslint-config-next 16 ships native flat config, so no FlatCompat shim.
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescriptConfig from 'eslint-config-next/typescript'

const config = [
  ...coreWebVitals,
  ...typescriptConfig,
  {
    ignores: ['out/**', '.next/**', 'node_modules/**', 'assets/**'],
  },
]

export default config
