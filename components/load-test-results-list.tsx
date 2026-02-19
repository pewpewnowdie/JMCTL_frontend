"use client"

import { Run } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

interface LoadTestResultsListProps {
  runs: Run[]
  selectedRunId: string | null
  onSelectRun: (id: string) => void
}

export function LoadTestResultsList({ runs, selectedRunId, onSelectRun }: LoadTestResultsListProps) {
  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No load test results available</p>
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
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
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

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Load Test Results</h2>
          <p className="text-sm text-muted-foreground">
            {runs.length} test {runs.length === 1 ? "result" : "results"} found
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {runs.map((run) => (
          <Card
            key={run.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRunId === run.id ? "ring-2 ring-primary" : ""
            } ${getStatusColor(run.run_status)}`}
            onClick={() => onSelectRun(run.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(run.run_status)}
                    <CardTitle className="text-base">{run.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">{run.script_name}</CardDescription>
                </div>
                <Badge variant={run.run_status === "passed" ? "default" : run.run_status === "warning" ? "secondary" : "destructive"}>
                  {run.run_status.charAt(0).toUpperCase() + run.run_status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">{run.duration}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Avg Response</p>
                  <p className="text-sm font-semibold">{run.avg_response_time}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Error Rate</p>
                  <p className="text-sm font-semibold text-red-600">{run.error_rate}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Throughput</p>
                  <p className="text-sm font-semibold">{run.throughput}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Virtual Users</p>
                  <p className="text-sm font-semibold">{run.v_users}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Started by {run.started_by}</span>
                <span>{new Date(run.started_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
