# SkillBridge — Digital Services Marketplace Frontend

A modern **Next.js** frontend for **SkillBridge**, a digital services marketplace that connects businesses with verified freelancers. The application provides responsive interfaces for clients, providers, and administrators while integrating securely with the SkillBridge REST API.

---

# Tech Stack

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| Framework        | Next.js 14 (App Router)              |
| Language         | TypeScript                           |
| Styling          | Tailwind CSS                         |
| UI Components    | shadcn/ui                            |
| Animations       | Framer Motion                        |
| State Management | Zustand                              |
| Data Fetching    | TanStack Query (React Query) + Axios |
| Forms            | React Hook Form + Zod                |
| Deployment       | Vercel                               |

---

# Architecture

```text
Browser
    │
    ▼
Next.js App Router
    │
    ▼
Application Layer
├── Authentication
├── Provider Directory
├── Client Dashboard
├── Provider Dashboard
├── Messaging
├── Request Management
└── Admin Panel
    │
    ▼
API Layer
(Axios + React Query)
    │
    ▼
SkillBridge FastAPI Backend
```

---

# Project Structure (High Level)

```text
skillbridge-frontend/
├── app/
│   ├── (auth)/             # Login & Registration
│   ├── dashboard/          # Client & Provider dashboards
│   ├── providers/          # Provider directory
│   ├── requests/           # Service requests
│   ├── messages/           # Messaging pages
│   ├── admin/              # Admin dashboard
│   └── layout.tsx
│
├── components/
│   ├── landing/
│   ├── providers/
│   ├── dashboard/
│   ├── shared/
│   └── layout/
│
├── lib/
│   ├── api/
│   ├── store/
│   ├── types/
│   └── utils/
│
├── public/
├── styles/
└── README.md
```

---

# Platform Overview

The frontend delivers separate user experiences for businesses, service providers, and administrators.

Clients can discover providers, create service requests, review proposals, hire freelancers, exchange messages, and manage their projects.

Providers can manage professional profiles, browse client opportunities, submit proposals, communicate with clients, and monitor their activity.

Administrators have access to moderation tools for approving providers, monitoring platform activity, and managing users.

---

# Authentication & Security

The frontend follows security practices that complement the backend authentication system.

### Authentication

* JWT Access Token stored only in memory using Zustand
* Automatic session restoration through httpOnly refresh cookie
* Silent token refresh on authentication expiry
* Protected route handling
* Role-based route access

### Security Features

* No JWT storage in localStorage
* Zod validation on every form
* DOMPurify sanitization for rendered HTML
* Axios interceptors for authentication handling
* Generic error responses for server failures

### Error Handling

* 401 → Silent refresh and request retry
* 429 → Rate-limit notification with temporary submit lock
* 500 → Generic user-friendly error message

---

# Client Features

Clients can:

* Register and sign in
* Browse verified providers
* Filter providers by category, location, and pricing
* View provider profiles
* Create service requests
* Review received proposals
* Accept provider proposals
* Exchange messages
* Manage account information

---

# Provider Features

Providers can:

* Register professional accounts
* Build public profiles
* Add skills and expertise
* Browse open service requests
* Submit proposals
* Communicate with clients
* Track project activity
* Receive client reviews

---

# Admin Features

Administrators can:

* Review pending provider applications
* Approve or reject providers
* Suspend accounts
* View platform analytics
* Monitor marketplace activity

---

# User Interface Features

The frontend focuses on responsiveness and user experience.

Highlights include:

* Responsive layouts for desktop, tablet, and mobile
* Animated page transitions using Framer Motion
* Skeleton loading states
* Toast notifications
* Accessible form components
* Mobile navigation menu
* Consistent design system using shadcn/ui

---

# Pages

| Route                 | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `/`                   | Landing page with hero, categories, statistics, and call-to-action |
| `/login`              | User authentication                                                |
| `/register`           | Multi-step account registration                                    |
| `/providers`          | Provider directory with filters                                    |
| `/providers/[id]`     | Public provider profile                                            |
| `/dashboard/client`   | Client dashboard                                                   |
| `/dashboard/provider` | Provider dashboard                                                 |
| `/requests/new`       | Create service request                                             |
| `/requests/[id]`      | Request details and proposals                                      |
| `/messages`           | Conversations list                                                 |
| `/messages/[id]`      | Messaging interface                                                |
| `/profile/edit`       | Profile management                                                 |
| `/admin`              | Administrative dashboard                                           |

---

# State Management

The application uses **Zustand** for lightweight global state management.

Current responsibilities include:

* Authentication state
* Current user session
* Access token storage
* Session restoration

Server data is managed separately using **TanStack Query**, providing:

* Automatic caching
* Background refetching
* Request deduplication
* Optimistic UI updates

---

# API Integration

Frontend communication with the backend is handled through Axios.

Features include:

* Centralized API client
* Automatic Authorization header injection
* Refresh token handling
* Request retry after token refresh
* Consistent error handling

---

# Running Locally

Clone the repository:

```bash
git clone https://github.com/ShivamAgrawal1909/skillbridge-frontend
cd skillbridge-frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.local.example .env.local
```

Configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

Ensure the backend API is running before starting the frontend.

---

# Environment Variables

| Variable              | Purpose                  |
| --------------------- | ------------------------ |
| `NEXT_PUBLIC_API_URL` | Backend API URL          |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL |

Example:

```env
NEXT_PUBLIC_API_URL=https://skillbridge-api-gevg.onrender.com
NEXT_PUBLIC_APP_URL=https://skillbridge-frontend-ivory.vercel.app
```

---

# Deployment

The frontend is deployed on **Vercel** and communicates with the SkillBridge FastAPI backend hosted on Render.

Production deployment includes:

* Automatic GitHub deployments
* Optimized Next.js production build
* Static asset optimization
* Environment-based configuration

---

# Future Enhancements

Planned improvements include:

* Real-time WebSocket messaging
* Push notifications
* Dark mode
* Progressive Web App (PWA) support
* Internationalization (i18n)
* Image optimization using CDN storage

---

# License

This project is intended for educational, learning, and portfolio purposes.
