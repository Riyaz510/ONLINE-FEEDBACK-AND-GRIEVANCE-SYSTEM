import { useState } from 'react'
import { Calendar, User, Paperclip, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Select } from '../ui/Input'
import { Card } from '../ui/Card'
import { getCategoryLabel, getCategoryIcon, STATUS, PRIORITY } from '../../lib/utils'

export function TicketCard({ ticket, users, currentUser, onUpdate, showOwner }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async (updates) => {
    setUpdating(true)
    try {
      await onUpdate(ticket.id, updates)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      open: "danger",
      in_progress: "warning", 
      resolved: "success",
      closed: "default"
    }
    return colors[status] || "default"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: "default",
      medium: "primary",
      high: "warning",
      urgent: "danger"
    }
    return colors[priority] || "default"
  }

  const createdBy = users.find(u => u.id === ticket.created_by)
  const assignee = users.find(u => u.id === ticket.assignee_id)

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusColor(ticket.status)}>
                {STATUS.find(s => s.id === ticket.status)?.label}
              </Badge>
              <Badge variant={getPriorityColor(ticket.priority)}>
                {PRIORITY.find(p => p.id === ticket.priority)?.label}
              </Badge>
              <span className="text-sm text-gray-500">
                {getCategoryIcon(ticket.category)} {getCategoryLabel(ticket.category)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {ticket.title}
            </h3>
            
            <p className={`text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
              {ticket.description}
            </p>
            
            {ticket.description.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="mt-2 p-0 h-auto"
              >
                {expanded ? (
                  <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Show more <ChevronDown className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            )}
          </div>
          
          {currentUser.role === 'admin' && (
            <div className="flex flex-col gap-2 min-w-0 sm:min-w-48">
              <Select
                value={ticket.status}
                onChange={(e) => handleUpdate({ status: e.target.value })}
                disabled={updating}
                className="text-sm"
              >
                {STATUS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Select>
              
              <Select
                value={ticket.assignee_id || ""}
                onChange={(e) => handleUpdate({ assignee_id: e.target.value || null })}
                disabled={updating}
                className="text-sm"
              >
                <option value="">Unassigned</option>
                {users.filter(u => u.role === 'admin').map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
          </div>
          
          {showOwner && createdBy && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By {createdBy.name}</span>
            </div>
          )}
          
          {assignee && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Assigned to {assignee.name}</span>
            </div>
          )}
          
          {ticket.attachment && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-4 w-4" />
              <a 
                href={ticket.attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {ticket.attachment.name}
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{ticket.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>
    </Card>
  )
}