// Types matching the actual backend API responses

export interface Project {
  project_key: string
  name: string
}

export interface Release {
  id: string
  name: string
  created_at: string
}

export interface Run {
  id: string
  name: string
  run_status: "passed" | "failed" | "warning"
  started_by: string
  started_at: string
  release: string // release ID (FK)
  report_url: string
  script_name: string
  duration: string
  v_users: number
  avg_response_time: string
  error_rate: string
  throughput: string
  project_key: string
}

/** Sidebar tree structure (built client-side from API data) */
export interface ReleaseNode {
  release: Release
  runs: Run[]
}

export interface ProjectTree {
  project: Project
  releases: ReleaseNode[]
}

/** Build the sidebar tree from flat lists */
export function buildProjectTree(
  projects: Project[],
  releases: Release[],
  runs: Run[],
  releasesByProject: Record<string, Release[]>
): ProjectTree[] {
  return projects.map((project) => {
    const projectReleases = (
      releasesByProject[project.project_key] ?? []
    ).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const releaseNodes: ReleaseNode[] = projectReleases.map((release) => {
      const releaseRuns = runs
        .filter(
          (r) =>
            r.release === release.id &&
            r.project_key === project.project_key
        )
        .sort(
          (a, b) =>
            new Date(b.started_at).getTime() -
            new Date(a.started_at).getTime()
        )
      return { release, runs: releaseRuns }
    })

    return { project, releases: releaseNodes }
  })
}

// -------------------------------------------------------------------
// Mock data – mirrors your FastAPI responses
// -------------------------------------------------------------------

export const mockProjects: Project[] = [
  { project_key: "payment-gateway", name: "Payment Gateway" },
  { project_key: "user-auth", name: "User Auth Service" },
  { project_key: "product-catalog", name: "Product Catalog" },
  { project_key: "notification-svc", name: "Notification Service" },
  { project_key: "order-mgmt", name: "Order Management" },
]

export const mockReleasesByProject: Record<string, Release[]> = {
  "payment-gateway": [
    { id: "rel-1-1", name: "Release 3.2.0", created_at: "2026-02-05" },
    { id: "rel-1-2", name: "Release 3.1.0", created_at: "2026-01-15" },
    { id: "rel-1-3", name: "Release 3.0.0", created_at: "2025-12-20" },
  ],
  "user-auth": [
    { id: "rel-2-1", name: "Release 2.5.0", created_at: "2026-02-08" },
    { id: "rel-2-2", name: "Release 2.4.1", created_at: "2026-01-22" },
  ],
  "product-catalog": [
    { id: "rel-3-1", name: "Release 1.8.0", created_at: "2026-02-01" },
    { id: "rel-3-2", name: "Release 1.7.2", created_at: "2026-01-10" },
  ],
  "notification-svc": [
    { id: "rel-4-1", name: "Release 4.0.0", created_at: "2026-01-28" },
  ],
  "order-mgmt": [
    { id: "rel-5-1", name: "Release 5.1.0", created_at: "2026-02-09" },
  ],
}

// Flatten releases for lookup
export const mockReleases: Release[] = Object.values(
  mockReleasesByProject
).flat()

export const mockRuns: Run[] = [
  // Payment Gateway — 3.2.0
  {
    id: "run-1-1-1",
    name: "Checkout Flow - Peak Load",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-02-05T14:32:00Z",
    release: "rel-1-1",
    report_url: "#",
    script_name: "checkout_peak_load.jmx",
    duration: "15m 32s",
    v_users: 500,
    avg_response_time: "245ms",
    error_rate: "0.12%",
    throughput: "1,250 req/s",
    project_key: "payment-gateway",
  },
  {
    id: "run-1-1-2",
    name: "Payment Processing - Stress Test",
    run_status: "warning",
    started_by: "john.doe",
    started_at: "2026-02-05T15:10:00Z",
    release: "rel-1-1",
    report_url: "#",
    script_name: "payment_stress.jmx",
    duration: "30m 10s",
    v_users: 1000,
    avg_response_time: "890ms",
    error_rate: "2.5%",
    throughput: "820 req/s",
    project_key: "payment-gateway",
  },
  {
    id: "run-1-1-3",
    name: "Refund API - Soak Test",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-02-05T18:00:00Z",
    release: "rel-1-1",
    report_url: "#",
    script_name: "refund_soak.jmx",
    duration: "2h 0m",
    v_users: 200,
    avg_response_time: "180ms",
    error_rate: "0.05%",
    throughput: "450 req/s",
    project_key: "payment-gateway",
  },
  // Payment Gateway — 3.1.0
  {
    id: "run-1-2-1",
    name: "Checkout Flow - Baseline",
    run_status: "passed",
    started_by: "jane.smith",
    started_at: "2026-01-15T10:00:00Z",
    release: "rel-1-2",
    report_url: "#",
    script_name: "checkout_baseline.jmx",
    duration: "10m 0s",
    v_users: 300,
    avg_response_time: "210ms",
    error_rate: "0.08%",
    throughput: "980 req/s",
    project_key: "payment-gateway",
  },
  {
    id: "run-1-2-2",
    name: "Payment Processing - Endurance",
    run_status: "failed",
    started_by: "ci-pipeline",
    started_at: "2026-01-15T12:30:00Z",
    release: "rel-1-2",
    report_url: "#",
    script_name: "payment_endurance.jmx",
    duration: "1h 45m",
    v_users: 800,
    avg_response_time: "1,450ms",
    error_rate: "8.2%",
    throughput: "340 req/s",
    project_key: "payment-gateway",
  },
  // Payment Gateway — 3.0.0
  {
    id: "run-1-3-1",
    name: "Full Regression Suite",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2025-12-20T09:00:00Z",
    release: "rel-1-3",
    report_url: "#",
    script_name: "full_regression.jmx",
    duration: "45m 0s",
    v_users: 500,
    avg_response_time: "320ms",
    error_rate: "0.3%",
    throughput: "1,100 req/s",
    project_key: "payment-gateway",
  },
  // User Auth Service — 2.5.0
  {
    id: "run-2-1-1",
    name: "Login Flow - Spike Test",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-02-08T11:00:00Z",
    release: "rel-2-1",
    report_url: "#",
    script_name: "login_spike.k6.js",
    duration: "8m 15s",
    v_users: 2000,
    avg_response_time: "125ms",
    error_rate: "0.02%",
    throughput: "3,200 req/s",
    project_key: "user-auth",
  },
  {
    id: "run-2-1-2",
    name: "OAuth Token - Load Test",
    run_status: "passed",
    started_by: "mike.chen",
    started_at: "2026-02-08T12:00:00Z",
    release: "rel-2-1",
    report_url: "#",
    script_name: "oauth_token_load.k6.js",
    duration: "20m 0s",
    v_users: 500,
    avg_response_time: "95ms",
    error_rate: "0.01%",
    throughput: "1,800 req/s",
    project_key: "user-auth",
  },
  {
    id: "run-2-1-3",
    name: "Session Management - Stress",
    run_status: "failed",
    started_by: "ci-pipeline",
    started_at: "2026-02-08T13:30:00Z",
    release: "rel-2-1",
    report_url: "#",
    script_name: "session_stress.k6.js",
    duration: "25m 42s",
    v_users: 3000,
    avg_response_time: "2,100ms",
    error_rate: "12.4%",
    throughput: "890 req/s",
    project_key: "user-auth",
  },
  // User Auth Service — 2.4.1
  {
    id: "run-2-2-1",
    name: "Login Flow - Baseline",
    run_status: "passed",
    started_by: "jane.smith",
    started_at: "2026-01-22T10:00:00Z",
    release: "rel-2-2",
    report_url: "#",
    script_name: "login_baseline.k6.js",
    duration: "10m 0s",
    v_users: 1000,
    avg_response_time: "110ms",
    error_rate: "0.03%",
    throughput: "2,500 req/s",
    project_key: "user-auth",
  },
  // Product Catalog — 1.8.0
  {
    id: "run-3-1-1",
    name: "Search API - Load Test",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-02-01T09:00:00Z",
    release: "rel-3-1",
    report_url: "#",
    script_name: "search_load.gatling.scala",
    duration: "12m 0s",
    v_users: 800,
    avg_response_time: "78ms",
    error_rate: "0.01%",
    throughput: "4,500 req/s",
    project_key: "product-catalog",
  },
  {
    id: "run-3-1-2",
    name: "Product Detail - Spike",
    run_status: "warning",
    started_by: "alex.wong",
    started_at: "2026-02-01T10:30:00Z",
    release: "rel-3-1",
    report_url: "#",
    script_name: "product_detail_spike.gatling.scala",
    duration: "5m 30s",
    v_users: 5000,
    avg_response_time: "650ms",
    error_rate: "1.8%",
    throughput: "6,200 req/s",
    project_key: "product-catalog",
  },
  // Product Catalog — 1.7.2
  {
    id: "run-3-2-1",
    name: "Category Browse - Endurance",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-01-10T08:00:00Z",
    release: "rel-3-2",
    report_url: "#",
    script_name: "category_endurance.gatling.scala",
    duration: "3h 0m",
    v_users: 300,
    avg_response_time: "145ms",
    error_rate: "0.08%",
    throughput: "1,200 req/s",
    project_key: "product-catalog",
  },
  {
    id: "run-3-2-2",
    name: "Search Autocomplete - Load",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-01-10T11:00:00Z",
    release: "rel-3-2",
    report_url: "#",
    script_name: "search_autocomplete.gatling.scala",
    duration: "15m 0s",
    v_users: 600,
    avg_response_time: "42ms",
    error_rate: "0.0%",
    throughput: "8,900 req/s",
    project_key: "product-catalog",
  },
  // Notification Service — 4.0.0
  {
    id: "run-4-1-1",
    name: "Push Notification - Burst Test",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-01-28T14:00:00Z",
    release: "rel-4-1",
    report_url: "#",
    script_name: "push_burst.jmx",
    duration: "6m 45s",
    v_users: 10000,
    avg_response_time: "35ms",
    error_rate: "0.005%",
    throughput: "15,000 req/s",
    project_key: "notification-svc",
  },
  {
    id: "run-4-1-2",
    name: "Email Queue - Soak Test",
    run_status: "warning",
    started_by: "john.doe",
    started_at: "2026-01-28T18:00:00Z",
    release: "rel-4-1",
    report_url: "#",
    script_name: "email_soak.jmx",
    duration: "4h 0m",
    v_users: 500,
    avg_response_time: "520ms",
    error_rate: "1.2%",
    throughput: "780 req/s",
    project_key: "notification-svc",
  },
  // Order Management — 5.1.0
  {
    id: "run-5-1-1",
    name: "Order Creation - Peak Load",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-02-09T10:00:00Z",
    release: "rel-5-1",
    report_url: "#",
    script_name: "order_create_peak.jmx",
    duration: "20m 0s",
    v_users: 1500,
    avg_response_time: "310ms",
    error_rate: "0.15%",
    throughput: "2,100 req/s",
    project_key: "order-mgmt",
  },
  {
    id: "run-5-1-2",
    name: "Order Tracking - Stress Test",
    run_status: "failed",
    started_by: "jane.smith",
    started_at: "2026-02-09T11:30:00Z",
    release: "rel-5-1",
    report_url: "#",
    script_name: "order_tracking_stress.jmx",
    duration: "18m 22s",
    v_users: 2500,
    avg_response_time: "3,200ms",
    error_rate: "15.6%",
    throughput: "520 req/s",
    project_key: "order-mgmt",
  },
  {
    id: "run-5-1-3",
    name: "Inventory Sync - Load Test",
    run_status: "passed",
    started_by: "ci-pipeline",
    started_at: "2026-02-09T13:00:00Z",
    release: "rel-5-1",
    report_url: "#",
    script_name: "inventory_sync_load.jmx",
    duration: "25m 0s",
    v_users: 400,
    avg_response_time: "190ms",
    error_rate: "0.07%",
    throughput: "1,400 req/s",
    project_key: "order-mgmt",
  },
]
