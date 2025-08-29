import clsx from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export const uid = () => Math.random().toString(36).slice(2, 10)
export const nowISO = () => new Date().toISOString()

export const CATEGORIES = [
  { id: "general", label: "General Feedback", icon: "💬", color: "blue" },
  { id: "academic", label: "Academic", icon: "📚", color: "green" },
  { id: "facilities", label: "Facilities", icon: "🏢", color: "orange" },
  { id: "technical", label: "Technical", icon: "💻", color: "purple" },
  { id: "hr", label: "Human Resources", icon: "👥", color: "pink" },
  { id: "finance", label: "Finance", icon: "💰", color: "yellow" },
]

export const PRIORITY = [
  { id: "low", label: "Low", color: "slate" },
  { id: "medium", label: "Medium", color: "blue" },
  { id: "high", label: "High", color: "orange" },
  { id: "urgent", label: "Urgent", color: "red" },
]

export const STATUS = [
  { id: "open", label: "Open", color: "red" },
  { id: "in_progress", label: "In Progress", color: "yellow" },
  { id: "resolved", label: "Resolved", color: "green" },
  { id: "closed", label: "Closed", color: "gray" },
]

export function getCategoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label || id
}

export function getCategoryIcon(id) {
  return CATEGORIES.find(c => c.id === id)?.icon || "📝"
}

export function getPriorityRank(priority) {
  const ranks = { low: 1, medium: 2, high: 3, urgent: 4 }
  return ranks[priority] || 1
}