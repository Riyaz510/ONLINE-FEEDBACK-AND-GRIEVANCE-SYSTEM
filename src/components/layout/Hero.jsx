import { TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { Card } from '../ui/Card'

export function Hero({ stats }) {
  return (
    <section className="mb-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-teal-600 p-8 text-white">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
              Professional Grievance Management
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Submit, track, and resolve issues with complete transparency. 
              Built for organizations that value accountability and efficiency.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats?.totalTickets || 0}</div>
                <div className="text-xs text-blue-200">Total Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats?.resolvedTickets || 0}</div>
                <div className="text-xs text-blue-200">Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats?.avgResponseTime || "< 24h"}</div>
                <div className="text-xs text-blue-200">Avg Response</div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4">
            <Card className="bg-white/10 border-white/20 text-white">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-300" />
                  <div>
                    <h3 className="font-semibold">Smart Workflow</h3>
                    <p className="text-sm text-blue-100">Automated status tracking and priority management</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-300" />
                  <div>
                    <h3 className="font-semibold">Real-time Updates</h3>
                    <p className="text-sm text-blue-100">Get notified instantly when status changes</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}