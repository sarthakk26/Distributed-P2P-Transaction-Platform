import type {Config} from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
    dir: './'
});

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
    // Handle module aliases (this matches your tsconfig paths)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    // If you need to map the @repo packages specifically for Jest:
    '^@repo/db$': '<rootDir>/../../packages/db/src/index.ts', 
  },
}

export default createJestConfig(config);