# Premier League Analytics Dashboard

Full-stack web application for exploring Premier League standings, saving favorite teams, writing notes, tracking historical snapshots, and viewing analytics.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL
- Authentication: JWT
- External data: football-data.org API

## Backend API Structure

The backend is organized around focused routers:

- `auth` for registration, login, and current-user access
- `favorites` for user-specific favorite teams
- `notes` for notes linked to favorite teams
- `snapshots` for historical team snapshots
- `analytics` for statistics and trend views

Shared database and authentication dependencies are centralized to keep router files smaller and more consistent.

## Recent Improvements

- Cleaned legacy code from backend CRUD, models, and schemas
- Standardized router dependency injection
- Improved HTTP status codes and error response consistency
