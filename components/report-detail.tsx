"use client"

import React from "react"

import {
  ExternalLink,
  Clock,
  Users,
  Timer,
  AlertTriangle,
  Gauge,
  FileCode2,
  CheckCircle2,
  XCircle,
  CalendarDays,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Run, Release, Project } from "@/lib/mock-data"

function StatusBadge({ status }: { status: Run["run_status"] }) {
  const config = {
    passed: {
      label: "Passed",
      className: "bg-success/15 text-success border-success/30",
      icon: CheckCircle2,
    },
    failed: {
      label: "Failed",
      className: "bg-destructive/15 text-destructive border-destructive/30",
      icon: XCircle,
    },
    warning: {
      label: "Warning",
      className: "bg-warning/15 text-warning border-warning/30",
      icon: AlertTriangle,
    },
  }

  const { label, className, icon: Icon } = config[status]

  return (
    <Badge variant="outline" className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  description?: string
}

function MetricCard({ icon, label, value, description }: MetricCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-lg font-semibold text-foreground tabular-nums">
              {value}
            </span>
            {description && (
              <span className="text-[10px] text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ReportDetailProps {
  run: Run
  release: Release
  project: Project
}

export function ReportDetail({ run, release, project }: ReportDetailProps) {
  const formattedDate = new Date(run.started_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{project.name}</span>
            <span>/</span>
            <span>{release.name}</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground text-balance">
            {run.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={run.run_status} />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{run.started_by}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => window.open(run.report_url, "_blank")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Full Report
        </Button>
      </div>

      <Separator className="bg-border" />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          label="Duration"
          value={run.duration}
        />
        <MetricCard
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          label="Virtual Users"
          value={run.v_users.toLocaleString()}
        />
        <MetricCard
          icon={<Timer className="h-4 w-4 text-muted-foreground" />}
          label="Avg Response Time"
          value={run.avg_response_time}
        />
        <MetricCard
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          label="Error Rate"
          value={run.error_rate}
        />
        <MetricCard
          icon={<Gauge className="h-4 w-4 text-muted-foreground" />}
          label="Throughput"
          value={run.throughput}
        />
        <MetricCard
          icon={<FileCode2 className="h-4 w-4 text-muted-foreground" />}
          label="Script"
          value={run.script_name}
        />
      </div>

      {/* Run Info */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">
            Run Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Run ID</span>
              <span className="font-mono text-xs text-foreground">
                {run.id}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Project</span>
              <span className="text-foreground">{project.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Release</span>
              <span className="text-foreground">{release.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Started By</span>
              <span className="text-foreground">{run.started_by}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Started At</span>
              <span className="text-foreground">{formattedDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Script File
              </span>
              <span className="font-mono text-xs text-foreground">
                {run.script_name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
