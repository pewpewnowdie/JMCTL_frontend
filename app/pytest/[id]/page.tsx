import { Metadata } from "next"
import { PytestDetail } from "@/components/pytest-detail"
import { ProtectedRoute } from "@/components/protected-route"
import { mockPytestResults } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PytestPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PytestPageProps): Promise<Metadata> {
  const result = mockPytestResults.find(r => r.id === params.id)
  return {
    title: result ? `${result.name} | Pytest Results` : "Pytest | Results Hub",
    description: result ? `View detailed results for ${result.name}` : "View pytest results",
  }
}

export async function generateStaticParams() {
  return mockPytestResults.map(result => ({
    id: result.id,
  }))
}

export default function PytestPage({ params }: PytestPageProps) {
  const result = mockPytestResults.find(r => r.id === params.id)

  if (!result) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-destructive">Pytest result not found</h1>
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
          <PytestDetail resultId={params.id} />
        </div>
      </main>
    </ProtectedRoute>
  )
}
