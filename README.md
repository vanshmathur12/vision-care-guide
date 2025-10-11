# Healthcare EMR System

A modern, responsive Electronic Medical Records (EMR) system built with React, TypeScript, and Vite.

## Features

- **Authentication**: JWT-based authentication with sign up and sign in
- **Appointment Booking**: Search and book appointments with doctors
- **Appointment Management**: View and cancel appointments
- **Document Management**: Upload, view, download, and delete medical documents
- **Responsive Design**: Mobile-first design that works on all devices
- **Role-Based Access**: Support for Patient, Doctor, and Admin roles

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Data Fetching**: @tanstack/react-query + Axios
- **Validation**: Zod
- **Forms**: react-hook-form
- **Styling**: TailwindCSS
- **UI Components**: Radix UI + shadcn/ui
- **Notifications**: Sonner
- **Routing**: React Router

## Project info

**URL**: https://lovable.dev/projects/841ee49d-ad39-4f6e-a68e-8d66094d77f1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/841ee49d-ad39-4f6e-a68e-8d66094d77f1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Build

Build for production:

```bash
npm run build
```

## Backend API Integration

This frontend connects to an Express backend with the following endpoints:

### Auth (No authentication required)
- `POST /signup` - Create new user account
- `POST /signin` - Sign in and receive JWT token

### Catalog (No authentication required)
- `GET /doctors` - List all doctors (with optional filters)
- `GET /doctors/:id` - Get doctor details
- `GET /hospitals` - List all hospitals (with optional filters)
- `GET /hospitals/:id` - Get hospital details
- `GET /cities` - List all cities
- `GET /specializations` - List all specializations

### Appointments (Authentication required)
- `POST /book-appointment` - Book a new appointment
- `GET /my-appointments` - Get user's appointments
- `PATCH /cancel-appointment/:id` - Cancel an appointment

### Documents (Authentication required)
- `POST /upload-document` - Upload a medical document (multipart form with field name `document`)
- `GET /my-documents` - List user's documents
- `DELETE /documents/:id` - Delete a document
- `GET /documents/:id/download` - Download a document

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (Loading, Empty states)
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   ├── navigation/     # Navigation components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hooks
│   ├── useAppointments.ts  # Appointment management hooks
│   ├── useCatalog.ts   # Catalog data hooks
│   └── useDocuments.ts # Document management hooks
├── lib/
│   ├── api/            # API client layer
│   │   ├── http.ts     # Axios instance with interceptors
│   │   ├── types.ts    # Zod schemas and TypeScript types
│   │   ├── auth.ts     # Auth API functions
│   │   ├── catalog.ts  # Catalog API functions
│   │   ├── appointments.ts  # Appointments API functions
│   │   └── documents.ts     # Documents API functions
│   └── utils/          # Utility functions
│       ├── queryKeys.ts     # React Query key factory
│       └── download.ts      # File download utility
├── pages/              # Page components
│   ├── Auth.tsx        # Authentication page
│   ├── FindAndBook.tsx # Doctor search and booking
│   ├── MyAppointments.tsx  # User appointments
│   └── MyDocuments.tsx # Document management
└── main.tsx            # Application entry point
```

## Key Features

### Authentication Flow

1. User signs up or signs in via `/auth`
2. JWT token is stored in localStorage
3. Token is automatically attached to all API requests via Axios interceptor
4. On 401 response, user is redirected to login

### Appointment Booking Flow

1. Search for doctors by city, specialization, hospital, or name
2. Select a doctor and fill in appointment details
3. Receive confirmation with QR code and numeric code
4. View and manage appointments in My Appointments

### Document Management

1. Upload medical documents (PDF, PNG, JPG, JPEG)
2. Add optional descriptions
3. Download documents as needed
4. Delete documents with optimistic UI updates

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000/api)

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query
- Axios
- Zod

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/841ee49d-ad39-4f6e-a68e-8d66094d77f1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
