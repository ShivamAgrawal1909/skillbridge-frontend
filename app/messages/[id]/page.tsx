'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '@/components/layout/Navbar'
import { getMessages, sendMessage } from '@/lib/api/messages'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send } from 'lucide-react'

export default function ConversationPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user])

  const { data: messages } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => getMessages(id as string),
    enabled: !!user && !!id,
    refetchInterval: 3000, // poll every 3 seconds
  })

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessage(id as string, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', id] })
      setContent('')
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    sendMutation.mutate(content.trim())
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-20">

        <div className="py-4 flex items-center gap-3 border-b border-slate-200">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-slate-800">Conversation</h1>
        </div>

        <div className="flex-1 py-4 space-y-3 overflow-y-auto min-h-96">
          {messages?.length === 0 && (
            <p className="text-center text-slate-400 py-8">No messages yet — say hello!</p>
          )}
          {messages?.map((msg) => {
            const isMe = msg.sender_id === user?.id
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-blue-800 text-white rounded-br-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                }`}>
                  {msg.content}
                  <div className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="py-4 flex gap-3 border-t border-slate-200">
          <Input
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900"
            disabled={sendMutation.isPending || !content.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}