import api from './client'
import { Conversation, Message } from '@/lib/types'

export async function getConversations() {
  const res = await api.get('/messages/conversations')
  return res.data as Conversation[]
}

export async function startConversation(provider_id: string, request_id?: string) {
  const res = await api.post('/messages/conversations', null, {
    params: { provider_id, request_id }
  })
  return res.data as Conversation
}

export async function getMessages(conversation_id: string, page = 1) {
  const res = await api.get(`/messages/conversations/${conversation_id}`, {
    params: { page }
  })
  return res.data as Message[]
}

export async function sendMessage(conversation_id: string, content: string) {
  const res = await api.post(`/messages/conversations/${conversation_id}`, { content })
  return res.data as Message
}