"use client"

import { Run, PytestResult, mockRuns, mockPytestResults } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

export function AnalyticsDashboard() {
  // Calculate stats for load tests
  const loadTestStats = {
    total: mockRuns.length,
    passed: mockRuns.filter(r => r.run_status === "passed").length,
    failed: mockRuns.filter(r => r.run_status === "failed").length,
    warning: mockRuns.filter(r => r.run_status === "warning").length,
    avgErrorRate: (mockRuns.reduce((sum, r) => sum + parseFloat(r.error_rate), 0) / mockRuns.length).toFixed(2),
  }

  // Calculate stats for pytest
  const pytestStats = {
    total: mockPytestResults.length,
    passed: mockPytestResults.filter(r => r.test_status === "passed").length,
    failed: mockPytestResults.filter(r => r.test_status === "failed").length,
    avgSuccessRate: (mockPytestResults.reduce((sum, r) => sum + r.success_rate, 0) / mockPytestResults.length).toFixed(1),
  }

  // Prepare chart data for trends
  const trendData = [
    { day: "Mon", loadTestErrors: 0.5, pytestSuccess: 98.5 },
    { day: "Tue", loadTestErrors: 0.8, pytestSuccess: 97.2 },
    { day: "Wed", loadTestErrors: 1.2, pytestSuccess: 96.8 },
    { day: "Thu", loadTestErrors: 0.9, pytestSuccess: 98.1 },
    { day: "Fri", loadTestErrors: 1.5, pytestSuccess: 95.3 },
    { day: "Sat", loadTestErrors: 1.1, pytestSuccess: 96.9 },
    { day: "Sun", loadTestErrors: 0.6, pytestSuccess: 99.2 },
  ]

  const responseTimeData = [
    { time: "00:00", avg: 45, p95: 120, p99: 200 },
    { time: "04:00", avg: 38, p95: 95, p99: 150 },
    { time: "08:00", avg: 52, p95: 145, p99: 250 },
    { time: "12:00", avg: 78, p95: 240, p99: 450 },
    { time: "16:00", avg: 85, p95: 260, p99: 500 },
    { time: "20:00", avg: 65, p95: 180, p99: 320 },
  ]

  const projectPerformance = [
    { project: "Payment Gateway", errorRate: 0.5, testPassing: 98 },
    { project: "User Auth", errorRate: 2.0, testPassing: 95 },
    { project: "Product Catalog", errorRate: 0.01, testPassing: 100 },
    { project: "Notification Svc", errorRate: 1.2, testPassing: 88 },
    { project: "Order Mgmt", errorRate: 2.5, testPassing: 89 },
  ]

  const StatCard = ({ label, value, change, isUp }: { label: string; value: string; change?: string; isUp?: boolean }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-red-600" : "text-green-600"}`}>
              {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Load Test Stats */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Load Test Results</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <StatCard label="Total Tests" value={loadTestStats.total.toString()} />
              <StatCard label="Passed" value={loadTestStats.passed.toString()} />
              <StatCard label="Failed" value={loadTestStats.failed.toString()} />
              <StatCard label="Warnings" value={loadTestStats.warning.toString()} />
              <StatCard label="Avg Error Rate" value={`${loadTestStats.avgErrorRate}%`} change="+0.2%" isUp={true} />
            </div>
          </div>

          {/* Pytest Stats */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Pytest Results</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Suites" value={pytestStats.total.toString()} />
              <StatCard label="Passed" value={pytestStats.passed.toString()} />
              <StatCard label="Failed" value={pytestStats.failed.toString()} />
              <StatCard label="Avg Success Rate" value={`${pytestStats.avgSuccessRate}%`} change="-1.2%" isUp={false} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Response Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Response Time Distribution</CardTitle>
              <CardDescription>Average, P95, and P99 response times across the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: "Response Time (ms)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg" stroke="#3b82f6" name="Average" />
                  <Line type="monotone" dataKey="p95" stroke="#f59e0b" name="P95" />
                  <Line type="monotone" dataKey="p99" stroke="#ef4444" name="P99" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Performance Scatter */}
          <Card>
            <CardHeader>
              <CardTitle>Project Performance Matrix</CardTitle>
              <CardDescription>Error rate vs test passing rate by project</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="errorRate" name="Error Rate (%)" type="number" />
                  <YAxis dataKey="testPassing" name="Test Passing (%)" type="number" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Projects" data={projectPerformance} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Weekly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Test Trends</CardTitle>
              <CardDescription>Load test error rate and pytest success rate over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" label={{ value: "Error Rate (%)", angle: -90, position: "insideLeft" }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: "Success Rate (%)", angle: 90, position: "insideRight" }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="loadTestErrors" stroke="#ef4444" name="Load Test Error Rate" />
                  <Line yAxisId="right" type="monotone" dataKey="pytestSuccess" stroke="#10b981" name="Pytest Success Rate" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Performance Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Project Test Performance</CardTitle>
              <CardDescription>Comparison of test results by project</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="project" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="testPassing" fill="#10b981" name="Test Passing Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
