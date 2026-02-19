import { Metadata } from "next"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export const metadata: Metadata = {
  title: "Test Reports | Results Hub",
  description: "View detailed analytics and reports for load tests and pytest results",
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold">Test Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics for load test and pytest results with trending insights
            </p>
          </div>
          <AnalyticsDashboard />
        </div>
      </main>
    </ProtectedRoute>
  )
}
