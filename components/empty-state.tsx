"use client"

import { Activity, ArrowLeft } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Activity className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          Select a Report
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Choose a load test report from the sidebar to view its results and metrics.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Browse the project tree on the left</span>
      </div>
    </div>
  )
}
