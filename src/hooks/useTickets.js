import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('tickets')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tickets' },
        () => fetchTickets()
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          created_by_user:users!tickets_created_by_fkey(id, name, email),
          assignee_user:users!tickets_assignee_id_fkey(id, name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTicket = async (ticketData) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select()
        .single()

      if (error) throw error
      await fetchTickets() // Refresh the list
      return data
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  }

  const updateTicket = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      await fetchTickets() // Refresh the list
    } catch (error) {
      console.error('Error updating ticket:', error)
      throw error
    }
  }

  return {
    tickets,
    loading,
    createTicket,
    updateTicket,
    refetch: fetchTickets,
  }
}