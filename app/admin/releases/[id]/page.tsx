"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { adminApi } from "@/lib/admin-api-client"
import type { AdminRun } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"

export default function ReleaseRunsPage() {
  const params = useParams()
  const releaseId = params.id as string

  const [runs, setRuns] = React.useState<AdminRun[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchRuns()
  }, [releaseId])

  const fetchRuns = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.releases.getRuns(releaseId)
      setRuns(data)
    } catch (error) {
      console.error("Error fetching runs:", error)
      toast.error("Failed to load runs")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      passed: "default",
      failed: "destructive",
      warning: "secondary",
    }
    return (
      <Badge variant={variants[status] || "secondary"} className="flex items-center gap-1 w-fit">
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Release Runs</h1>
              <p className="text-sm text-muted-foreground">
                Release ID: {releaseId}
              </p>
            </div>
            <Link href="/admin/releases">
              <Button variant="outline">Back to Releases</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Runs</CardTitle>
            <CardDescription>
              {runs.length} run{runs.length !== 1 ? 's' : ''} in this release
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No runs found for this release
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Script</TableHead>
                      <TableHead>Started By</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>V-Users</TableHead>
                      <TableHead>Avg Response</TableHead>
                      <TableHead>Error Rate</TableHead>
                      <TableHead>Throughput</TableHead>
                      <TableHead>Started At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-medium">{run.name}</TableCell>
                        <TableCell>{getStatusBadge(run.run_status)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {run.script_name}
                        </TableCell>
                        <TableCell>{run.started_by}</TableCell>
                        <TableCell>{run.duration}</TableCell>
                        <TableCell>{run.v_users}</TableCell>
                        <TableCell>{run.avg_response_time}</TableCell>
                        <TableCell>{run.error_rate}</TableCell>
                        <TableCell>{run.throughput}</TableCell>
                        <TableCell>
                          {format(new Date(run.started_at), 'MMM dd, HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}