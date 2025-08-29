import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Textarea, Select } from '../ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'
import { CATEGORIES, PRIORITY } from '../../lib/utils'

export function TicketForm({ onSubmit, currentUser }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0].id,
    priority: PRIORITY[1].id,
    attachment: null,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return

    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
        attachment: form.attachment,
        created_by: currentUser.id,
      }
      await onSubmit(payload)
      setForm({ 
        title: "", 
        description: "", 
        category: CATEGORIES[0].id,
        priority: PRIORITY[1].id,
        attachment: null 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return setForm({ ...form, attachment: null })
    
    // Create object URL for preview
    const url = URL.createObjectURL(file)
    setForm({ 
      ...form, 
      attachment: { 
        name: file.name, 
        url,
        size: file.size,
        type: file.type
      } 
    })
  }

  const removeAttachment = () => {
    if (form.attachment?.url) {
      URL.revokeObjectURL(form.attachment.url)
    }
    setForm({ ...form, attachment: null })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Grievance</CardTitle>
        <CardDescription>
          Provide detailed information about your feedback or concern
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Brief summary of the issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide detailed information about the issue, including steps to reproduce, expected vs actual behavior, and any relevant context..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {PRIORITY.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment (Optional)
            </label>
            {!form.attachment ? (
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload file</p>
                    <p className="text-xs text-gray-500">PDF, DOC, TXT, or images up to 10MB</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{form.attachment.name}</p>
                    <p className="text-xs text-gray-500">
                      {(form.attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeAttachment}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !form.title.trim() || !form.description.trim()}
          >
            {loading ? "Submitting..." : "Submit Grievance"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}