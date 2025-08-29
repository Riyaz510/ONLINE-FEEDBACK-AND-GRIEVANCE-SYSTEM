import { useMemo } from 'react'
import { BarChart3, Users, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { TicketList } from '../tickets/TicketList'
import { STATUS, CATEGORIES, getPriorityRank } from '../../lib/utils'

export function AdminDashboard({ tickets, users, onUpdate, currentUser }) {
  const stats = useMemo(() => {
    const total = tickets.length
    const byStatus = STATUS.reduce((acc, status) => {
      acc[status.id] = tickets.filter(t => t.status === status.id).length
      return acc
    }, {})
    
    const byCategory = CATEGORIES.reduce((acc, category) => {
      acc[category.id] = tickets.filter(t => t.category === category.id).length
      return acc
    }, {})
    
    const avgResolutionTime = calculateAvgResolutionTime(tickets)
    const highPriorityOpen = tickets.filter(t => 
      (t.priority === 'high' || t.priority === 'urgent') && 
      (t.status === 'open' || t.status === 'in_progress')
    ).length

    return {
      total,
      byStatus,
      byCategory,
      avgResolutionTime,
      highPriorityOpen
    }
  }, [tickets])

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
  }, [tickets])

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={stats.total}
          icon={<BarChart3 className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Open Tickets"
          value={stats.byStatus.open || 0}
          icon={<Clock className="h-5 w-5" />}
          color="red"
        />
        <StatCard
          title="Resolved"
          value={stats.byStatus.resolved || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="High Priority"
          value={stats.highPriorityOpen}
          icon={<Users className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {STATUS.map(status => (
                <div key={status.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${status.color}-500`} />
                    <span className="text-sm font-medium capitalize">
                      {status.label}
                    </span>
                  </div>
                  <Badge variant={status.color === 'red' ? 'danger' : status.color === 'green' ? 'success' : 'default'}>
                    {stats.byStatus[status.id] || 0}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CATEGORIES.map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                  <Badge>
                    {stats.byCategory[category.id] || 0}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <TicketList
        title="All Tickets"
        tickets={tickets}
        users={users}
        currentUser={currentUser}
        onUpdate={onUpdate}
        showOwner={true}
      />
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function calculateAvgResolutionTime(tickets) {
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')
  if (resolvedTickets.length === 0) return "N/A"
  
  const totalHours = resolvedTickets.reduce((sum, ticket) => {
    const created = new Date(ticket.created_at)
    const resolved = new Date(ticket.updated_at)
    return sum + (resolved - created) / (1000 * 60 * 60)
  }, 0)
  
  const avgHours = totalHours / resolvedTickets.length
  if (avgHours < 24) return `${Math.round(avgHours)}h`
  return `${Math.round(avgHours / 24)}d`
}