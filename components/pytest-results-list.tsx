"use client"

import { PytestResult } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface PytestResultsListProps {
  results: PytestResult[]
  selectedId: string | null
  onSelectResult: (id: string) => void
}

export function PytestResultsList({ results, selectedId, onSelectResult }: PytestResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No pytest results available</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-50 border-green-200"
      case "failed":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getProgressColor = (rate: number) => {
    if (rate >= 95) return "bg-green-500"
    if (rate >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pytest Results</h2>
          <p className="text-sm text-muted-foreground">
            {results.length} test suite {results.length === 1 ? "result" : "results"} found
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((result) => (
          <Card
            key={result.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedId === result.id ? "ring-2 ring-primary" : ""
            } ${getStatusColor(result.test_status)}`}
            onClick={() => onSelectResult(result.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.test_status)}
                    <CardTitle className="text-base">{result.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">{result.project_key}</CardDescription>
                </div>
                <Badge variant={result.test_status === "passed" ? "default" : result.test_status === "warning" ? "secondary" : "destructive"}>
                  {result.test_status.charAt(0).toUpperCase() + result.test_status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Success Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-sm font-semibold">{result.success_rate.toFixed(1)}%</p>
                  </div>
                  <Progress 
                    value={result.success_rate} 
                    className="h-2"
                  />
                </div>

                {/* Test Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total</p>
                    <p className="text-sm font-semibold">{result.total_tests}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Passed</p>
                    <p className="text-sm font-semibold text-green-600">{result.passed_tests}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Failed</p>
                    <p className="text-sm font-semibold text-red-600">{result.failed_tests}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold">{result.duration}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <span>Started by {result.started_by}</span>
                <span>{new Date(result.started_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
