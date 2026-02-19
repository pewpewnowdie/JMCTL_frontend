# Test Results Frontend - Load Test & Pytest Integration

This frontend application displays comprehensive test results including load test metrics and pytest outcomes.

## Features

### Load Test Results
- **Dashboard Tab**: View all load test runs organized by project and release
- **Detailed Views**: Click on any test run to see:
  - Key metrics (response time, error rate, throughput, virtual users)
  - Response time trends over test duration
  - Error distribution and success rates
  - Endpoint-level performance breakdown
- **Status Indicators**: Color-coded badges showing passed, failed, or warning states

### Pytest Results
- **Dashboard Tab**: Browse pytest test suites with success rates
- **Detailed Views**: Click on any pytest result to see:
  - Overall test statistics (passed, failed, skipped)
  - Success rate progress visualization
  - Failed test details with error messages
  - Slowest tests by execution time
  - Test distribution pie charts
- **Test-level Details**: View individual test execution times and status

### Analytics & Reports
- **Reports Page** (`/reports`): Comprehensive analytics dashboard featuring:
  - Overall statistics for both load tests and pytest results
  - Response time distribution charts
  - Project performance matrix
  - Weekly trend analysis
  - Comparative metrics across projects

## Project Structure

```
components/
├── dashboard.tsx              # Main dashboard with tabs
├── load-test-results-list.tsx # Load test results list view
├── load-test-detail.tsx       # Load test detailed view with charts
├── pytest-results-list.tsx    # Pytest results list view
├── pytest-detail.tsx          # Pytest detailed view with charts
└── analytics-dashboard.tsx    # Analytics and trending dashboard

app/
├── page.tsx                   # Dashboard home
├── reports/page.tsx           # Analytics reports page
├── load-test/[id]/page.tsx   # Individual load test detail page
└── pytest/[id]/page.tsx      # Individual pytest detail page

lib/
└── mock-data.ts               # Mock data with types for both load test and pytest
```

## Mock Data Structure

### Load Test (Run)
- `id`: Unique identifier
- `name`: Test name
- `run_status`: "passed" | "failed" | "warning"
- `duration`: Test duration
- `avg_response_time`: Average response time
- `error_rate`: Percentage of failed requests
- `throughput`: Requests per second
- `v_users`: Virtual user count
- `started_at`: Timestamp
- `project_key`: Project identifier

### Pytest (PytestResult)
- `id`: Unique identifier
- `name`: Test suite name
- `test_status`: "passed" | "failed" | "warning"
- `total_tests`: Total number of tests
- `passed_tests`: Number of passing tests
- `failed_tests`: Number of failing tests
- `success_rate`: Percentage of successful tests
- `test_cases`: Array of individual test details
- `started_at`: Timestamp
- `project_key`: Project identifier

## API Integration

Currently, the frontend uses mock data. To integrate with real APIs:

1. **Update `lib/api-client.ts`** to add endpoints for pytest results:
   ```typescript
   api.pytest.getAll()
   api.pytest.getById(id: string)
   api.pytest.getByProject(projectKey: string)
   ```

2. **Replace mock data loading** in `components/dashboard.tsx`:
   - Replace `mockPytestResults` with API calls
   - Maintain the same data structure

3. **Update detail pages** (`app/load-test/[id]/page.tsx` and `app/pytest/[id]/page.tsx`):
   - Fetch individual results from API
   - Handle loading and error states

## Charts & Visualizations

Built using Recharts with shadcn/ui components:
- **Line Charts**: Response time trends, success rate trends
- **Bar Charts**: Test statistics, project comparisons
- **Pie Charts**: Test result distribution
- **Scatter Charts**: Project performance matrix

## Customization

### Colors & Styling
- Status colors (passed: green, failed: red, warning: yellow)
- Uses Tailwind CSS with shadcn/ui components
- Theme-aware with light/dark mode support

### Adding New Metrics
1. Add fields to `PytestResult` or `Run` interface in `mock-data.ts`
2. Update corresponding detail component
3. Add new chart if needed

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Environment Variables

Dummy APIs are currently used. Update these when connecting to real endpoints:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_API_KEY`: API authentication key (if needed)

## Future Enhancements

- Real-time test result updates via WebSocket
- Test result comparisons between runs
- Performance regression detection
- Custom report generation
- Result filtering and search capabilities
- Export reports to PDF/CSV
