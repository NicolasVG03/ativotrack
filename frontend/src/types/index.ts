export interface NavLink {
  label: string
  href: string
}

export interface FeatureCard {
  icon: IconName
  title: string
  body: string
  wide?: boolean
}

export interface PricingPlan {
  tag?: string
  price: string
  period: string
  label: string
  features: string[]
  cta: string
  isPro: boolean
}

export interface FAQItem {
  question: string
  answer: string
}

export type IconName =
  | 'dashboard' | 'expenses' | 'reports' | 'logout'
  | 'plus' | 'edit' | 'trash' | 'search'
  | 'chevronDown' | 'chevronLeft' | 'menu' | 'x'
  | 'user' | 'trendUp' | 'trendDown' | 'shield' | 'zap'
  | 'google' | 'check' | 'award' | 'star'
  | 'arrowRight' | 'pieChart' | 'wallet' | 'sparkle'
  | 'filter' | 'fileText'
