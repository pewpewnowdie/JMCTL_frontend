export interface AdminProject {
  id?: string
  project_key: string
  name: string
}

export interface AdminRelease {
  id: string
  name: string
  created_at: string
  project_key?: string
}

export interface AdminUser {
  id: string
  username: string
  role: string
  is_active: boolean
  created_at: string
}

export interface AdminRun {
  id: string
  name: string
  status: string
  started_at: string
  started_by: string
  release: string
  ended_at: string
  report_url: string
  script_name: string
  run_status: "passed" | "failed" | "warning"
  duration: string
  v_users: number
  avg_response_time: string
  error_rate: string
  throughput: string
  project_key: string
}