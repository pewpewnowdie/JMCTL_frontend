import { Metadata } from "next"
import { LoadTestDetail } from "@/components/load-test-detail"
import { ProtectedRoute } from "@/components/protected-route"
import { mockRuns } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LoadTestPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: LoadTestPageProps): Promise<Metadata> {
  const run = mockRuns.find(r => r.id === params.id)
  return {
    title: run ? `${run.name} | Load Test Results` : "Load Test | Results Hub",
    description: run ? `View detailed results for ${run.name}` : "View load test results",
  }
}

export async function generateStaticParams() {
  return mockRuns.map(run => ({
    id: run.id,
  }))
}

export default function LoadTestPage({ params }: LoadTestPageProps) {
  const run = mockRuns.find(r => r.id === params.id)

  if (!run) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-destructive">Load test not found</h1>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <LoadTestDetail runId={params.id} />
        </div>
      </main>
    </ProtectedRoute>
  )
}
