"use client"

import { PytestResult, mockPytestResults, TestCase } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

interface PytestDetailProps {
  resultId: string
}

export function PytestDetail({ resultId }: PytestDetailProps) {
  const result = mockPytestResults.find(r => r.id === resultId)

  if (!result) {
    return <div>Test result not found</div>
  }

  // Prepare chart data
  const testStats = [
    { name: "Passed", value: result.passed_tests, fill: "#10b981" },
    { name: "Failed", value: result.failed_tests, fill: "#ef4444" },
    { name: "Skipped", value: result.skipped_tests, fill: "#f59e0b" },
  ]

  const testDistribution = [
    { name: "Passed", value: result.passed_tests, fill: "#10b981" },
    { name: "Failed", value: result.failed_tests, fill: "#ef4444" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "skipped":
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const failedTests = result.test_cases.filter(t => t.status === "failed")
  const slowestTests = [...result.test_cases].sort((a, b) => b.duration - a.duration).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {getStatusIcon(result.test_status)}
          <div>
            <h1 className="text-2xl font-bold">{result.name}</h1>
            <p className="text-sm text-muted-foreground">{result.project_key}</p>
          </div>
        </div>
        <Badge variant={result.test_status === "passed" ? "default" : result.test_status === "warning" ? "secondary" : "destructive"}>
          {result.test_status.charAt(0).toUpperCase() + result.test_status.slice(1)}
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{result.total_tests}</p>
            <p className="text-xs text-muted-foreground mt-1">Test cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{result.success_rate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Passed tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{result.failed_tests}</p>
            <p className="text-xs text-muted-foreground mt-1">Failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{result.duration}</p>
            <p className="text-xs text-muted-foreground mt-1">Execution time</p>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Success Rate Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Pass Rate</p>
                <p className="text-sm font-semibold">{result.success_rate.toFixed(1)}%</p>
              </div>
              <Progress value={result.success_rate} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Passed</p>
                <p className="text-lg font-bold text-green-600">{result.passed_tests}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-lg font-bold text-red-600">{result.failed_tests}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Skipped</p>
                <p className="text-lg font-bold text-gray-600">{result.skipped_tests}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Test Execution Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{result.duration}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Started By</p>
              <p className="font-semibold">{result.started_by}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Started At</p>
              <p className="font-semibold">{new Date(result.started_at).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Release</p>
              <p className="font-semibold">{result.release}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Failures */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="failures">Failures</TabsTrigger>
          <TabsTrigger value="slowest">Slowest Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Test Result Distribution</CardTitle>
              <CardDescription>Breakdown of passed, failed, and skipped tests</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={testStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {testStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failures">
          <Card>
            <CardHeader>
              <CardTitle>Failed Tests</CardTitle>
              <CardDescription>{failedTests.length} test{failedTests.length !== 1 ? "s" : ""} failed</CardDescription>
            </CardHeader>
            <CardContent>
              {failedTests.length > 0 ? (
                <div className="space-y-3">
                  {failedTests.map((test, idx) => (
                    <div key={idx} className="border rounded-lg p-3 bg-red-50 border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{test.name}</p>
                          {test.error && (
                            <p className="text-xs text-red-700 mt-1">{test.error}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">Duration: {test.duration.toFixed(2)}s</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mr-2" />
                  <p className="text-sm text-muted-foreground">No failed tests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slowest">
          <Card>
            <CardHeader>
              <CardTitle>Slowest Tests</CardTitle>
              <CardDescription>Top 5 tests by execution time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slowestTests.map((test, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-2 flex-1">
                      <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{test.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getTestStatusIcon(test.status)}
                          <span className="text-xs text-muted-foreground capitalize">{test.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-right flex-shrink-0">{test.duration.toFixed(3)}s</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
