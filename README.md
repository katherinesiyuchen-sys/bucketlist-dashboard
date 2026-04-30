# Bucketlist Dashboard

A fullstack web application that allows users to create, track, and complete personal goals, with progress tracking and achievement badges.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database & Auth:** Supabase

---

## Features

- User authentication (Supabase)
- Create, edit, and delete goals
- Mark goals as completed
- Track progress with completion stats
- Earn achievement badges based on completed goals

---

## Project Structure

```

project3/
├── client/        # React frontend
├── server/        # Express backend
├── supabase/      # Database schema
└── README.md

````

---

## ⚙️ Setup

### 1. Supabase

1. Go to https://supabase.com
2. Create a new project
3. Get your:
   - Project URL
   - Anon public key
   - Service role key (for backend)

---

### 2. Backend (Server)

```bash
cd server
npm install
````

Create a `.env` file in `server/`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
```

Run the server:

```bash
npm run dev
```

---

### 3. Frontend (Client)

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Run the frontend:

```bash
npm run dev
```

---

## Authentication

This app uses Supabase Auth. Protected routes use middleware that:

* Reads the JWT from the `Authorization` header
* Verifies it with Supabase
* Attaches the user to `req.user`

---

## API Routes

### Auth

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| POST   | /api/auth/login | Log in user      |
| GET    | /api/auth/me    | Get current user |

### Goals

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | /api/goals              | Get all goals          |
| POST   | /api/goals              | Create a goal          |
| GET    | /api/goals/:id          | Get a goal             |
| PATCH  | /api/goals/:id          | Update a goal          |
| DELETE | /api/goals/:id          | Delete a goal          |
| PATCH  | /api/goals/:id/complete | Mark goal as completed |

### Badges

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| GET    | /api/badges | Get earned badges |

---

## Badge System

Badges are awarded based on completed goals:

* **First Dream** → 1 goal completed
* **Second Dream** → 2 goals completed
* **Five Dreams** → 5 goals completed
* **Dream Chaser** → 10 goals completed

---

## Future Improvements

* Add goal categories and filters
* Add due dates and reminders
* Improve UI/UX design
* Deploy app (Vercel + backend hosting)

---

