"use client"

import * as React from "react"
import { adminApi } from "@/lib/admin-api-client"
import type { AdminRelease, AdminProject } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Loader2, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"

export default function ReleasesPage() {
  const [releases, setReleases] = React.useState<AdminRelease[]>([])
  const [projects, setProjects] = React.useState<AdminProject[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)

  // Form state
  const [selectedProjectKey, setSelectedProjectKey] = React.useState("")
  const [releaseName, setReleaseName] = React.useState("")

  // Fetch data
  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [releasesData, projectsData] = await Promise.all([
        adminApi.releases.getAll(),
        adminApi.projects.getAll(),
      ])
      setReleases(releasesData)
      setProjects(projectsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProjectKey || !releaseName) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsCreating(true)
      await adminApi.releases.create(selectedProjectKey, releaseName)
      toast.success("Release created successfully")
      setSelectedProjectKey("")
      setReleaseName("")
      setIsCreateDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error("Error creating release:", error)
      toast.error("Failed to create release")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Releases</h1>
              <p className="text-sm text-muted-foreground">Manage your releases</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">Back to Admin</Button>
              </Link>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Release
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Release</DialogTitle>
                    <DialogDescription>
                      Add a new release to a project
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateRelease} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">Project</Label>
                      <Select
                        value={selectedProjectKey}
                        onValueChange={setSelectedProjectKey}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.project_key} value={project.project_key}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="release_name">Release Name</Label>
                      <Input
                        id="release_name"
                        placeholder="e.g., v1.0.0 or Release 2024-01"
                        value={releaseName}
                        onChange={(e) => setReleaseName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Release
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Releases</CardTitle>
            <CardDescription>
              {releases.length} release{releases.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : releases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No releases found. Create your first release!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Release ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {releases.map((release) => (
                    <TableRow key={release.id}>
                      <TableCell className="font-mono text-sm">
                        {release.id}
                      </TableCell>
                      <TableCell>{release.name}</TableCell>
                      <TableCell>
                        {format(new Date(release.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/releases/${release.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Runs
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}