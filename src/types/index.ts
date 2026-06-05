export interface ContactRequest {
  service: string
  id?: string
  firstName: string
  lastName: string
  email: string
  plan: string
  budget: string
  description: string
  createdAt?: string
  status?: "new" | "read" | "in_progress" | "quote_sent" | "done"
  token?: string
  adminReply?: string
  adminReplyAt?: string
  clientMessages?: ClientMessage[]
}

export interface ClientMessage {
  content: string
  sentAt: string
}

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  url?: string
}

export interface PricingPlan {
  id: string
  label: string
  name: string
  price: string
  from: string
  features: string[]
  featured?: boolean
}

export interface QuoteItem {
  title: string
  description: string
  unitPrice: number
  quantity: number
}

export interface Quote {
  id?: string
  quoteNumber: string       // "DEV-2026-001"
  requestId: string
  clientName: string
  clientEmail: string
  items: QuoteItem[]
  subtotal: number
  vatRate: number           // 0.21
  vatAmount: number
  total: number
  status: "draft" | "sent" | "accepted" | "rejected"
  createdAt?: string
  sentAt?: string
  token: string
}