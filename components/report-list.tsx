"use client"

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  ExternalLink,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Run, Release, Project } from "@/lib/mock-data"

function StatusIcon({ status }: { status: Run["run_status"] }) {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-4 w-4 text-success" />
    case "failed":
      return <XCircle className="h-4 w-4 text-destructive" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />
  }
}

function StatusLabel({ status }: { status: Run["run_status"] }) {
  const labels = {
    passed: "Passed",
    failed: "Failed",
    warning: "Warning",
  }
  const colors = {
    passed: "text-success",
    failed: "text-destructive",
    warning: "text-warning",
  }
  return (
    <span className={`text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  )
}

interface ReportListProps {
  project: Project
  release: Release
  runs: Run[]
  selectedRunId: string | null
  onSelectRun: (runId: string) => void
}

export function ReportList({
  project,
  release,
  runs,
  selectedRunId,
  onSelectRun,
}: ReportListProps) {
  const passedCount = runs.filter((r) => r.run_status === "passed").length
  const failedCount = runs.filter((r) => r.run_status === "failed").length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{project.name}</span>
          <span>/</span>
          <span>{release.name}</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          All Runs in {release.name}
        </h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{runs.length} runs</span>
          <span>{passedCount} passed</span>
          <span>{failedCount} failed</span>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium">
                Status
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Run Name
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium hidden md:table-cell">
                Script
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Started By
                </div>
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Duration
                </div>
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  vUsers
                </div>
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium hidden sm:table-cell">
                Error Rate
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow
                key={run.id}
                className={`border-border cursor-pointer transition-colors ${
                  selectedRunId === run.id
                    ? "bg-accent"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => onSelectRun(run.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={run.run_status} />
                    <StatusLabel status={run.run_status} />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-sm text-foreground">
                  {run.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="font-mono text-xs text-muted-foreground">
                    {run.script_name}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {run.started_by}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground tabular-nums">
                  {run.duration}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground tabular-nums">
                  {run.v_users.toLocaleString()}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground tabular-nums">
                  {run.error_rate}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(run.report_url, "_blank")
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">Open report</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
