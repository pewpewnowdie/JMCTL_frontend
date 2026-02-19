"use client"

import * as React from "react"
import { mockPytestResults, mockRuns } from "@/lib/mock-data"

export function Dashboard() {
  const [activeTab, setActiveTab] = React.useState<"load-test" | "pytest">("load-test")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const selectedLoadTest = selectedId ? mockRuns.find(r => r.id === selectedId) : null
  const selectedPytest = selectedId ? mockPytestResults.find(p => p.id === selectedId) : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold">Test Results Hub</h1>
          <p className="text-slate-400 text-sm mt-1">Load Tests & Pytest Results</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("load-test")}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === "load-test"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Load Tests
            </button>
            <button
              onClick={() => setActiveTab("pytest")}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === "pytest"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Pytest
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Panel */}
          <div className="lg:col-span-1 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <h2 className="font-semibold text-lg">Results</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeTab === "load-test" ? (
                // Load Test Results List
                <div className="divide-y divide-slate-800">
                  {mockRuns.map((run) => (
                    <button
                      key={run.id}
                      onClick={() => setSelectedId(run.id)}
                      className={`w-full text-left p-4 transition border-l-2 ${
                        selectedId === run.id
                          ? "bg-slate-800 border-l-blue-500"
                          : "border-l-transparent hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="font-medium text-sm truncate">{run.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{run.project_key}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            run.run_status === "passed" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-xs">{run.run_status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                // Pytest Results List
                <div className="divide-y divide-slate-800">
                  {mockPytestResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => setSelectedId(result.id)}
                      className={`w-full text-left p-4 transition border-l-2 ${
                        selectedId === result.id
                          ? "bg-slate-800 border-l-blue-500"
                          : "border-l-transparent hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="font-medium text-sm truncate">{result.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{result.project_key}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            result.test_status === "passed"
                              ? "bg-green-500"
                              : result.test_status === "failed"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <span className="text-xs">{result.test_status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {activeTab === "load-test" ? (
              selectedLoadTest ? (
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedLoadTest.name}</h2>
                    <p className="text-slate-400 mt-1">{selectedLoadTest.project_key} / {selectedLoadTest.release}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800 rounded p-4">
                      <div className="text-xs text-slate-400">Avg Response Time</div>
                      <div className="text-xl font-bold mt-1">{selectedLoadTest.avg_response_time}</div>
                    </div>
                    <div className="bg-slate-800 rounded p-4">
                      <div className="text-xs text-slate-400">Error Rate</div>
                      <div className="text-xl font-bold mt-1">{selectedLoadTest.error_rate}</div>
                    </div>
                    <div className="bg-slate-800 rounded p-4">
                      <div className="text-xs text-slate-400">Throughput</div>
                      <div className="text-xl font-bold mt-1">{selectedLoadTest.throughput}</div>
                    </div>
                    <div className="bg-slate-800 rounded p-4">
                      <div className="text-xs text-slate-400">Virtual Users</div>
                      <div className="text-xl font-bold mt-1">{selectedLoadTest.v_users}</div>
                    </div>
                    <div className="bg-slate-800 rounded p-4">
                      <div className="text-xs text-slate-400">Duration</div>
                      <div className="text-xl font-bold mt-1">{selectedLoadTest.duration}</div>
                    </div>
                    <div className="bg-slate-800 rounded p-4">
                      <div className="text-xs text-slate-400">Status</div>
                      <div className="text-sm font-bold mt-1 capitalize">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            selectedLoadTest.run_status === "passed" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {selectedLoadTest.run_status}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded p-4">
                    <div className="text-sm text-slate-400">Started At</div>
                    <div className="text-sm mt-1">
                      {new Date(selectedLoadTest.started_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-12 text-center">
                  <p className="text-slate-400">Select a load test to view details</p>
                </div>
              )
            ) : selectedPytest ? (
              <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPytest.name}</h2>
                  <p className="text-slate-400 mt-1">{selectedPytest.project_key} / {selectedPytest.release}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-800 rounded p-4">
                    <div className="text-xs text-slate-400">Total Tests</div>
                    <div className="text-xl font-bold mt-1">{selectedPytest.total_tests}</div>
                  </div>
                  <div className="bg-green-900/30 rounded p-4 border border-green-800">
                    <div className="text-xs text-green-400">Passed</div>
                    <div className="text-xl font-bold mt-1 text-green-400">{selectedPytest.passed_tests}</div>
                  </div>
                  <div className="bg-red-900/30 rounded p-4 border border-red-800">
                    <div className="text-xs text-red-400">Failed</div>
                    <div className="text-xl font-bold mt-1 text-red-400">{selectedPytest.failed_tests}</div>
                  </div>
                  <div className="bg-yellow-900/30 rounded p-4 border border-yellow-800">
                    <div className="text-xs text-yellow-400">Skipped</div>
                    <div className="text-xl font-bold mt-1 text-yellow-400">{selectedPytest.skipped_tests}</div>
                  </div>
                  <div className="bg-blue-900/30 rounded p-4 border border-blue-800">
                    <div className="text-xs text-blue-400">Success Rate</div>
                    <div className="text-xl font-bold mt-1 text-blue-400">{selectedPytest.success_rate.toFixed(2)}%</div>
                  </div>
                  <div className="bg-slate-800 rounded p-4">
                    <div className="text-xs text-slate-400">Duration</div>
                    <div className="text-xl font-bold mt-1">{selectedPytest.duration}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Test Cases ({selectedPytest.test_cases.length})</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {selectedPytest.test_cases.map((testCase, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded border ${
                          testCase.status === "passed"
                            ? "bg-green-900/20 border-green-800"
                            : testCase.status === "failed"
                              ? "bg-red-900/20 border-red-800"
                              : "bg-yellow-900/20 border-yellow-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-mono text-sm">{testCase.name}</div>
                            {testCase.error && (
                              <div className="text-xs text-slate-400 mt-1 italic">{testCase.error}</div>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{testCase.duration}s</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg border border-slate-800 p-12 text-center">
                <p className="text-slate-400">Select a pytest result to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
