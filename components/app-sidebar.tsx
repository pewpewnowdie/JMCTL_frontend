"use client"

import * as React from "react"
import {
  ChevronRight,
  FolderOpen,
  Tag,
  FileText,
  Search,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogOut,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Run, ProjectTree } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function getStatusIcon(status: Run["run_status"]) {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
    case "failed":
      return <XCircle className="h-3 w-3 text-destructive shrink-0" />
    case "warning":
      return <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
  }
}

interface AppSidebarProps {
  tree: ProjectTree[]
  selectedRunId: string | null
  onSelectRun: (runId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function AppSidebar({
  tree,
  selectedRunId,
  onSelectRun,
  searchQuery,
  onSearchChange,
}: AppSidebarProps) {
  const { logout } = useAuth()

  const filteredTree = React.useMemo(() => {
    if (!searchQuery.trim()) return tree

    const q = searchQuery.toLowerCase()
    return tree
      .map((node) => {
        const matchesProject = node.project.name.toLowerCase().includes(q)
        const filteredReleases = node.releases
          .map((releaseNode) => {
            const matchesRelease = releaseNode.release.name
              .toLowerCase()
              .includes(q)
            const filteredRuns = releaseNode.runs.filter(
              (run) =>
                run.name.toLowerCase().includes(q) ||
                run.script_name.toLowerCase().includes(q)
            )
            if (matchesRelease || matchesProject) return releaseNode
            if (filteredRuns.length > 0) {
              return { ...releaseNode, runs: filteredRuns }
            }
            return null
          })
          .filter(Boolean) as typeof node.releases

        if (matchesProject || filteredReleases.length > 0) {
          return matchesProject
            ? node
            : { ...node, releases: filteredReleases }
        }
        return null
      })
      .filter(Boolean) as ProjectTree[]
  }, [tree, searchQuery])

  return (
    <Sidebar>
      <SidebarHeader className="gap-3 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Load Test Hub
            </span>
            <span className="text-xs text-muted-foreground">
              Result Dashboard
            </span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput
            placeholder="Search projects, releases..."
            className="pl-8 h-8 text-xs"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Projects
          </SidebarGroupLabel>
          <SidebarMenu>
            {filteredTree.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No results found
              </div>
            )}
            {filteredTree.map((node) => {
              const totalRuns = node.releases.reduce(
                (acc, rn) => acc + rn.runs.length,
                0
              )
              return (
                <Collapsible
                  key={node.project.project_key}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="font-medium">
                        <FolderOpen className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{node.project.name}</span>
                        <Badge
                          variant="secondary"
                          className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-secondary text-muted-foreground"
                        >
                          {totalRuns}
                        </Badge>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-3 border-l border-sidebar-border pl-2">
                        {node.releases.map((releaseNode) => (
                          <Collapsible
                            key={releaseNode.release.id}
                            defaultOpen
                            className="group/release"
                          >
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                size="sm"
                                className="text-muted-foreground hover:text-sidebar-foreground"
                              >
                                <Tag className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">
                                  {releaseNode.release.name}
                                </span>
                                <span className="ml-auto text-[10px] text-muted-foreground">
                                  {releaseNode.runs.length}
                                </span>
                                <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/release:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-3 border-l border-sidebar-border pl-1">
                                {releaseNode.runs.map((run) => (
                                  <SidebarMenuButton
                                    key={run.id}
                                    size="sm"
                                    isActive={selectedRunId === run.id}
                                    onClick={() => onSelectRun(run.id)}
                                    className="text-xs text-muted-foreground hover:text-sidebar-foreground"
                                  >
                                    {getStatusIcon(run.run_status)}
                                    <FileText className="h-3 w-3 shrink-0" />
                                    <span className="truncate">
                                      {run.name}
                                    </span>
                                  </SidebarMenuButton>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
