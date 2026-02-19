"use client"

import { Run, mockRuns } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface LoadTestDetailProps {
  runId: string
}

export function LoadTestDetail({ runId }: LoadTestDetailProps) {
  const run = mockRuns.find(r => r.id === runId)

  if (!run) {
    return <div>Test run not found</div>
  }

  // Parse numeric values from strings
  const avgResponseTime = parseFloat(run.avg_response_time)
  const errorRate = parseFloat(run.error_rate)
  const throughput = parseFloat(run.throughput.replace(/,/g, ""))
  const duration = parseInt(run.duration.match(/\d+/)?.[0] || "0")

  // Sample data for charts
  const responseTimeData = [
    { time: "0m", avg: avgResponseTime * 0.8 },
    { time: "5m", avg: avgResponseTime * 0.9 },
    { time: "10m", avg: avgResponseTime },
    { time: "15m", avg: avgResponseTime * 1.1 },
  ]

  const errorDistribution = [
    { name: "Success", value: 100 - errorRate, fill: "#10b981" },
    { name: "Errors", value: errorRate, fill: "#ef4444" },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {getStatusIcon(run.run_status)}
          <div>
            <h1 className="text-2xl font-bold">{run.name}</h1>
            <p className="text-sm text-muted-foreground">{run.script_name}</p>
          </div>
        </div>
        <Badge variant={run.run_status === "passed" ? "default" : run.run_status === "warning" ? "secondary" : "destructive"}>
          {run.run_status.charAt(0).toUpperCase() + run.run_status.slice(1)}
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{run.avg_response_time}</p>
            <p className="text-xs text-muted-foreground mt-1">Response latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{run.error_rate}</p>
            <p className="text-xs text-muted-foreground mt-1">Request failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{run.throughput}</p>
            <p className="text-xs text-muted-foreground mt-1">Requests per second</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Virtual Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{run.v_users}</p>
            <p className="text-xs text-muted-foreground mt-1">Concurrent load</p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{run.duration}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Started By</p>
              <p className="font-semibold">{run.started_by}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Started At</p>
              <p className="font-semibold">{new Date(run.started_at).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Script</p>
              <p className="font-semibold">{run.script_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="response-time" className="space-y-4">
        <TabsList>
          <TabsTrigger value="response-time">Response Time</TabsTrigger>
          <TabsTrigger value="errors">Error Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="response-time">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Over Time</CardTitle>
              <CardDescription>Average response time during test execution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg" stroke="#3b82f6" name="Avg Response Time (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Request Success Rate</CardTitle>
              <CardDescription>Distribution of successful vs failed requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={errorDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {errorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-xl font-bold text-green-600">{(100 - errorRate).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-xl font-bold text-red-600">{errorRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
