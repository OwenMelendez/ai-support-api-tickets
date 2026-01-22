// src/hooks/useTickets.ts
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export interface Ticket {
  id: string
  created_at: string
  description: string
  category: string | null
  sentiment: string | null
  processed: boolean
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeTickets = async () => {
      // Fetch inicial de tickets
      setLoading(true)
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tickets:', error)
      } else {
        setTickets(data || [])
      }
      setLoading(false)

      // Suscripción a cambios en tiempo real
      const channel = supabase
        .channel('tickets-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tickets' },
          (payload) => {
            console.log('Change received!', payload)
            
            if (payload.eventType === 'INSERT') {
              setTickets((current) => [payload.new as Ticket, ...current])
            } else if (payload.eventType === 'UPDATE') {
              setTickets((current) =>
                current.map((ticket) =>
                  ticket.id === payload.new.id ? (payload.new as Ticket) : ticket
                )
              )
            } else if (payload.eventType === 'DELETE') {
              setTickets((current) =>
                current.filter((ticket) => ticket.id !== payload.old.id)
              )
            }
          }
        )
        .subscribe()

      return channel
    }

    const channelPromise = initializeTickets()

    return () => {
      channelPromise.then((channel) => {
        supabase.removeChannel(channel)
      })
    }
  }, [])

  return { tickets, loading }
}