# Load Test Dashboard - Frontend

A Next.js-based dashboard for viewing and analyzing load test results across projects and releases.

## Features

- ✅ **User Authentication**: Login and registration pages with JWT token management
- 📊 **Project Management**: Browse projects, releases, and test runs
- 🎯 **Real-time Data**: Integrated with backend APIs for live data
- 🔍 **Search & Filter**: Search across projects, releases, and test runs
- 📈 **Detailed Reports**: View comprehensive test metrics and results
- 🌙 **Dark Mode**: Built-in dark theme support

## API Integration

This frontend integrates with the following backend endpoints:

### Authentication
- `POST /auth/register` - Register a new user
  - Payload: `{ "username": string, "password": string }`
  - Response: `{ "status": "created" }`

- `POST /auth/login` - Login user
  - Payload: `{ "username": string, "password": string }`
  - Response: `{ "access_token": string }`

### Data Endpoints
- `GET /projects` - Get all projects
  - Response: `[{ "project_key": string, "name": string }, ...]`

- `GET /releases?project=<project_key>` - Get releases for a project
  - Response: `[{ "id": string, "name": string, "created_at": string }, ...]`

- `GET /releases/<release_id>` - Get runs in a release
  - Response: `[{ "id": string, "name": string, "status": string, ... }, ...]`

- `GET /runs/<run_id>` - Get single run details
  - Response: `{ "id": string, "name": string, ... }`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with auth provider
│   ├── page.tsx            # Main dashboard page (protected)
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Registration page
├── components/
│   ├── dashboard.tsx       # Main dashboard component
│   ├── app-sidebar.tsx     # Sidebar with project tree
│   ├── protected-route.tsx # Route protection wrapper
│   ├── report-detail.tsx   # Detailed run view
│   ├── report-list.tsx     # List of runs in release
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── api-client.ts       # API client for backend communication
│   ├── auth-context.tsx    # Authentication context provider
│   ├── mock-data.ts        # Type definitions and utilities
│   └── utils.ts            # Utility functions
```

## Key Files

### API Client (`lib/api-client.ts`)
Handles all API communication with automatic token management:
- Automatically adds JWT token to requests
- Handles 401 errors and redirects to login
- Provides typed API methods

### Auth Context (`lib/auth-context.tsx`)
Manages authentication state across the app:
- Login/logout functionality
- Token persistence in localStorage
- Protected route handling

### Dashboard (`components/dashboard.tsx`)
Main component that:
- Fetches projects, releases, and runs from API
- Builds hierarchical tree structure
- Manages selected run state
- Displays detailed metrics

## Authentication Flow

1. User visits the app
2. If not authenticated, redirected to `/login`
3. User enters credentials
4. On successful login, JWT token is stored in localStorage
5. All subsequent API calls include the token
6. If token expires (401), user is redirected back to login

## Data Flow

1. **Initial Load**: Dashboard fetches all projects
2. **For Each Project**: Fetches releases using project key
3. **For Each Release**: Fetches runs using release ID
4. **Build Tree**: Constructs hierarchical structure for sidebar
5. **User Selection**: When user clicks a run, details are displayed

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000` |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Toast Notifications**: Sonner

## Development Notes

### Adding New API Endpoints

To add new API endpoints, update `lib/api-client.ts`:

```typescript
export const api = {
  // ... existing endpoints
  
  myNewEndpoint: {
    getData: async () => {
      return fetchWithAuth('/my-endpoint')
    }
  }
}
```

### Customizing the Dashboard

The dashboard is built with shadcn/ui components. To customize:

1. Components are in `components/ui/`
2. Tailwind config is in `tailwind.config.ts`
3. Global styles are in `app/globals.css`

### Error Handling

All API errors are caught and displayed using toast notifications:
- Network errors
- Authentication errors (401)
- Server errors (500)

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend allows requests from `http://localhost:3000`:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Authentication Not Working
1. Check that `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Verify the backend is running
3. Check browser console for errors
4. Ensure localStorage is not disabled

### No Data Showing
1. Verify API endpoints are returning data
2. Check browser network tab for failed requests
3. Ensure token is valid (not expired)
4. Check console for error messages

## License

MIT
