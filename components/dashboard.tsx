"use client"

import * as React from "react"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { ReportDetail } from "@/components/report-detail"
import { ReportList } from "@/components/report-list"
import { EmptyState } from "@/components/empty-state"
import {
  mockProjects,
  mockReleases,
  mockReleasesByProject,
  mockRuns,
  buildProjectTree,
} from "@/lib/mock-data"

export function Dashboard() {
  const [selectedRunId, setSelectedRunId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const tree = React.useMemo(
    () =>
      buildProjectTree(
        mockProjects,
        mockReleases,
        mockRuns,
        mockReleasesByProject
      ),
    []
  )

  // Derive all context from the selected run
  const selectedRun = selectedRunId
    ? mockRuns.find((r) => r.id === selectedRunId) ?? null
    : null

  const selectedRelease = selectedRun
    ? mockReleases.find((rel) => rel.id === selectedRun.release) ?? null
    : null

  const selectedProject = selectedRun
    ? mockProjects.find((p) => p.project_key === selectedRun.project_key) ??
      null
    : null

  // All runs in the same release (for the table below)
  const releaseRuns = selectedRelease
    ? mockRuns.filter((r) => r.release === selectedRelease.id)
    : []

  return (
    <SidebarProvider>
      <AppSidebar
        tree={tree}
        selectedRunId={selectedRunId}
        onSelectRun={setSelectedRunId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <SidebarInset>
        {/* Top Bar */}
        <header className="flex h-12 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <Separator orientation="vertical" className="h-4 bg-border" />
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {selectedProject && selectedRelease && selectedRun ? (
              <>
                <span className="text-foreground">
                  {selectedProject.name}
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {selectedRelease.name}
                </span>
                <span>/</span>
                <span className="text-muted-foreground truncate max-w-[200px]">
                  {selectedRun.name}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">
                Select a run to view
              </span>
            )}
          </nav>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {selectedRun && selectedRelease && selectedProject ? (
            <div className="flex flex-col gap-8">
              <ReportDetail
                run={selectedRun}
                release={selectedRelease}
                project={selectedProject}
              />
              <Separator className="bg-border" />
              <ReportList
                project={selectedProject}
                release={selectedRelease}
                runs={releaseRuns}
                selectedRunId={selectedRunId}
                onSelectRun={setSelectedRunId}
              />
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
