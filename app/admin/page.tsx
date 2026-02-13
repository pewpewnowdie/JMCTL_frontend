"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, Tag, Users, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AdminDashboard() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage projects, releases, and users</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                <CardTitle>Projects</CardTitle>
              </div>
              <CardDescription>
                Create and manage projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/projects">
                <Button className="w-full">Manage Projects</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Releases Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <CardTitle>Releases</CardTitle>
              </div>
              <CardDescription>
                Create and manage releases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/releases">
                <Button className="w-full">Manage Releases</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Users</CardTitle>
              </div>
              <CardDescription>
                View and manage users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/projects?action=create">
              <Button variant="outline" className="w-full justify-start">
                <FolderOpen className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </Link>
            <Link href="/admin/releases?action=create">
              <Button variant="outline" className="w-full justify-start">
                <Tag className="mr-2 h-4 w-4" />
                Create New Release
              </Button>
            </Link>
          </div>
        </div>

        {/* Link to main dashboard */}
        <div className="mt-8 pt-8 border-t">
          <Link href="/">
            <Button variant="ghost">
              ← Back to Main Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}