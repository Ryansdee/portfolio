export interface ContactRequest {
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