"use client"

import * as React from "react"
import { adminApi } from "@/lib/admin-api-client"
import type { AdminProject, AdminUser } from "@/lib/admin-types"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Users, Loader2, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<AdminProject[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)

  // Form state
  const [projectKey, setProjectKey] = React.useState("")
  const [projectName, setProjectName] = React.useState("")

  // User management state
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null)
  const [projectUsers, setProjectUsers] = React.useState<AdminUser[]>([])
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false)

  // Fetch projects
  React.useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const data = await adminApi.projects.getAll()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectKey || !projectName) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsCreating(true)
      await adminApi.projects.create(projectKey, projectName)
      toast.success("Project created successfully")
      setProjectKey("")
      setProjectName("")
      setIsCreateDialogOpen(false)
      fetchProjects()
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project")
    } finally {
      setIsCreating(false)
    }
  }

  const handleViewUsers = async (project_key: string) => {
    try {
      setSelectedProject(project_key)
      setIsLoadingUsers(true)
      setIsUserDialogOpen(true)
      const users = await adminApi.projects.getUsers(project_key)
      setProjectUsers(users)
    } catch (error) {
      console.error("Error fetching project users:", error)
      toast.error("Failed to load project users")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="text-sm text-muted-foreground">Manage your projects</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">Back to Admin</Button>
              </Link>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project to the system
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project_key">Project Key</Label>
                      <Input
                        id="project_key"
                        placeholder="e.g., payment-gateway"
                        value={projectKey}
                        onChange={(e) => setProjectKey(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Use lowercase with hyphens (e.g., my-project)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project_name">Project Name</Label>
                      <Input
                        id="project_name"
                        placeholder="e.g., Payment Gateway"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
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
                        Create Project
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
            <CardTitle>All Projects</CardTitle>
            <CardDescription>
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No projects found. Create your first project!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.project_key}>
                      <TableCell className="font-mono text-sm">
                        {project.project_key}
                      </TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUsers(project.project_key)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Manage Users
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* User Management Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Users</DialogTitle>
            <DialogDescription>
              Manage users for project: {selectedProject}
            </DialogDescription>
          </DialogHeader>
          {isLoadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {projectUsers.length} user{projectUsers.length !== 1 ? 's' : ''}
                </p>
                <Link href={`/admin/projects/${selectedProject}/add-user`}>
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </Link>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Handle remove user
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}