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
import { api } from "@/lib/api-client"
import { Project, Release, Run, buildProjectTree } from "@/lib/mock-data"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export function Dashboard() {
  const [selectedRunId, setSelectedRunId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [projects, setProjects] = React.useState<Project[]>([])
  const [releases, setReleases] = React.useState<Release[]>([])
  const [runs, setRuns] = React.useState<Run[]>([])
  const [releasesByProject, setReleasesByProject] = React.useState<Record<string, Release[]>>({})
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch all data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch projects
        const projectsData: Project[] = await api.projects.getAll()
        setProjects(projectsData)

        // Fetch releases for each project
        const releasesByProjectMap: Record<string, Release[]> = {}
        const allReleases: Release[] = []
        const allRuns: Run[] = []

        for (const project of projectsData) {
          try {
            const projectReleases: Release[] = await api.releases.getByProject(project.project_key)
            releasesByProjectMap[project.project_key] = projectReleases
            allReleases.push(...projectReleases)

            // Fetch runs for each release
            for (const release of projectReleases) {
              try {
                const releaseRuns: Run[] = await api.releases.getRuns(release.id)
                allRuns.push(...releaseRuns)
              } catch (err) {
                console.error(`Error fetching runs for release ${release.id}:`, err)
              }
            }
          } catch (err) {
            console.error(`Error fetching releases for project ${project.project_key}:`, err)
          }
        }

        setReleasesByProject(releasesByProjectMap)
        setReleases(allReleases)
        setRuns(allRuns)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const tree = React.useMemo(
    () => buildProjectTree(projects, releases, runs, releasesByProject),
    [projects, releases, runs, releasesByProject]
  )

  // Derive all context from the selected run
  const selectedRun = selectedRunId
    ? runs.find((r) => r.id === selectedRunId) ?? null
    : null

  const selectedRelease = selectedRun
    ? releases.find((rel) => rel.id === selectedRun.release) ?? null
    : null

  const selectedProject = selectedRun
    ? projects.find((p) => p.project_key === selectedRun.project_key) ?? null
    : null

  // All runs in the same release (for the table below)
  const releaseRuns = selectedRelease
    ? runs.filter((r) => r.release === selectedRelease.id)
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    )
  }

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
