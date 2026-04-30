# Bucketlist Dashboard

## Setup

### 1. Firebase
- Create a project at console.firebase.google.com
- Enable **Authentication → Email/Password**
- Enable **Firestore Database**
- Download a service account key (Project Settings → Service Accounts → Generate new private key)

### 2. Server
```bash
cd server
npm install
```
Fill in `server/.env` with your Firebase service account values.
```bash
npm run dev   # runs on port 3000
```

### 3. Client
```bash
cd client
npm install
```
Fill in `client/.env` with your Firebase web config values and API-Ninjas key.
```bash
npm run dev   # runs on port 5173
```

## Routes
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Verify JWT, create user doc |
| GET | /api/auth/me | Get current user |
| GET | /api/goals | List all goals |
| POST | /api/goals | Create goal |
| GET | /api/goals/:id | Get one goal |
| PATCH | /api/goals/:id | Update goal |
| DELETE | /api/goals/:id | Delete goal |
| PATCH | /api/goals/:id/complete | Mark complete |
| GET | /api/badges | Get badges + earned status |
