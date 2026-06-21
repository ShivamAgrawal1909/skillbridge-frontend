export interface User {
  id: string
  email: string
  full_name: string
  role: 'client' | 'provider' | 'admin'
  is_verified: boolean
}

export interface ProviderProfile {
  id: string
  user_id: string
  bio: string | null
  tagline: string | null
  hourly_rate: string | null
  years_experience: number | null
  location: string | null
  status: 'pending' | 'approved' | 'suspended'
  avg_rating: string
  total_reviews: number
  full_name: string | null
  skills: string[]
}

export interface ServiceRequest {
  id: string
  client_id: string
  category_id: string
  title: string
  description: string
  budget_min: string | null
  budget_max: string | null
  deadline: string | null
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
}

export interface Proposal {
  id: string
  request_id: string
  provider_id: string
  cover_letter: string
  proposed_amount: string
  delivery_days: number
  status: 'pending' | 'accepted' | 'rejected'
  provider_name: string | null
}

export interface Conversation {
  id: string
  client_id: string
  provider_id: string
  request_id: string | null
  unread_count: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface Review {
  id: string
  request_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon_url: string | null
}