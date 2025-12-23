# Journaling App - Echos of Ink
A full stack journaling web application that lets users securely create, edit, search, and manage personal journal entries. Built with a modern API-driven backend, a responsive frontend UI, and designed for production deployment with Docker and cloud infrastructure. This project is deployed on AWS.

## Tech Stack
### **Backend**
- Python
- FastAPI
- SQLAlchemy ORM
- JWT authentication with access + refresh tokens
- SQLite for local development
- PostgreSQL for production

### **Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

### **Infrastructure**
- Docker
- Docker Compose
- AWS EC2
- Reverse proxy with HTTPS

## Features
- User registration and login
- JWT access + refresh tokens (HttpOnly cookies)
- Create, edit, delete, and view journal entries
- Search across journal entries
- Responsive UI with dark mode
- Calendar view for entries

## Getting Started
### Local Development
#### **Backend**
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`

#### **Frontend**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Environment Variables
You can configure the app using `.env` files (do not commit secrets). Common variables:

**Backend**
- `SECRET_KEY`
- `APP_ENV` (use `prod` in production)
- `DATABASE` (optional; full DB URL)
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `DB_HOST`, `DB_PORT`



### Production Deployment (Docker)
This project is deployed on AWS EC2 using Docker Compose behind an HTTPS reverse proxy.

1. Create a `.env` file at the repo root with production values.
2. Build and start services:
   - `docker compose up -d --build`
3. Ensure ports 80/443 are open on the EC2 instance security group.
4. Configure your reverse proxy (e.g., Nginx) to route:
   - `/` -> frontend container
   - `/auth` and API routes -> backend container

## Why This Project Exists
This project was built to demonstrate real-world full-stack engineering skills, including:
- Designing a scalable API.
- Handling authentication securely.
- Building a modern frontend.
- Containerizing applications with Docker.
- Production cloud deployment (AWS).

It is intended as a portfolio project and a foundation for future feature expansion.

## Author
Hazem Alsagheer
