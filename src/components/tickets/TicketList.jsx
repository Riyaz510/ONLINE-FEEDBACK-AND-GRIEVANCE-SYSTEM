import { useState, useMemo } from 'react'
import { Search, Filter, SortDesc } from 'lucide-react'
import { Input, Select } from '../ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { TicketCard } from './TicketCard'
import { CATEGORIES, STATUS, getPriorityRank } from '../../lib/utils'

export function TicketList({ 
  title, 
  tickets, 
  users = [], 
  currentUser, 
  onUpdate, 
  showOwner = true 
}) {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    sortBy: "newest"
  })

  const filteredTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      const searchMatch = !filters.search || 
        [ticket.title, ticket.description].join(" ")
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      
      const categoryMatch = filters.category === "all" || ticket.category === filters.category
      const statusMatch = filters.status === "all" || ticket.status === filters.status
      
      return searchMatch && categoryMatch && statusMatch
    })

    // Sort tickets
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at)
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at)
        case "priority":
          return getPriorityRank(b.priority) - getPriorityRank(a.priority)
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [tickets, filters])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {filteredTickets.length} of {tickets.length} tickets
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:flex">
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="min-w-0"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </Select>
              
              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="min-w-0"
              >
                <option value="all">All Status</option>
                {STATUS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Select>
              
              <Select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="min-w-0"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
                <option value="title">By Title</option>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              users={users}
              currentUser={currentUser}
              onUpdate={onUpdate}
              showOwner={showOwner}
            />
          ))}
          
          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <SortDesc className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-600">
                {tickets.length === 0 
                  ? "No tickets have been created yet." 
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}