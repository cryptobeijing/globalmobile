export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

export interface PhonePlan {
  id: string
  name: string
  price: number
  country: string
  countryCode: string
  flag: string
  data: string
  minutes: string
  sms: string
  features: string[]
  popular?: boolean
  color: string
} 