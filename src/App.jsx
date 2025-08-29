import React from 'react'
import { AuthScreen } from './components/auth/AuthScreen'
import { Header } from './components/layout/Header'
import { Hero } from './components/layout/Hero'
import { TicketForm } from './components/tickets/TicketForm'
import { TicketList } from './components/tickets/TicketList'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { useAuth } from './hooks/useAuth'
import { useTickets } from './hooks/useTickets'
import { useUsers } from './hooks/useUsers'

export default function App() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth()
  const { tickets, loading: ticketsLoading, createTicket, updateTicket } = useTickets()
  const { users, loading: usersLoading } = useUsers()

  const handleRegister = async (userData) => {
    try {
      await signUp(userData)
    } catch (error) {
      alert(error.message || 'Registration failed')
    }
  }

  const handleLogin = async (credentials) => {
    try {
      await signIn(credentials)
    } catch (error) {
      alert(error.message || 'Login failed')
    }
  }

  const handleCreateTicket = async (ticketData) => {
    try {
      await createTicket(ticketData)
    } catch (error) {
      alert(error.message || 'Failed to create ticket')
    }
  }

  const handleUpdateTicket = async (id, updates) => {
    try {
      await updateTicket(id, updates)
    } catch (error) {
      alert(error.message || 'Failed to update ticket')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthScreen 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        usersCount={users.length} 
      />
    )
  }

  const stats = {
    totalTickets: tickets.length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: "< 24h"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={user} onLogout={signOut} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Hero stats={stats} />
        
        {user.role === 'admin' ? (
          <AdminDashboard
            tickets={tickets}
            users={users}
            currentUser={user}
            onUpdate={handleUpdateTicket}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TicketForm onSubmit={handleCreateTicket} currentUser={user} />
            </div>
            <div className="lg:col-span-2">
              <TicketList
                title="My Tickets"
                tickets={tickets.filter(t => t.created_by === user.id)}
                users={users}
                currentUser={user}
                onUpdate={handleUpdateTicket}
                showOwner={false}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}