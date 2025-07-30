export const DOMAIN = {
  API: import.meta.env.VITE_PUBLIC_ENV_DOMAIN_API || 'http://localhost:3000',
} as const

export type Domain = keyof typeof DOMAIN
