# Gymondo Workouts App

A simple workout application built with Next.js and NestJS in a Turborepo monorepo structure. The app displays a list of workouts with filtering by month and category, pagination, and individual workout detail pages.

## 📋 Table of Contents

- [📸 Screenshots](#-screenshots)
- [🏗️ Architecture](#️-architecture)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Environment Setup](#3-environment-setup)
  - [4. Database Setup](#4-database-setup)
  - [5. Start the Development Server](#5-start-the-development-server)
- [📝 Available Scripts](#-available-scripts)
- [🗂️ Project Structure](#️-project-structure)
- [🚦 Features](#-features)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [📄 License](#-license)
- [👤 Author](#-author)
- [🎯 Quick Start Summary](#-quick-start-summary)

## 📸 Screenshots

### Main Workouts Page

![Workouts List](./screenshots/workouts-list.png)
_Main page showing workout list with month and category filters, and pagination_

### Individual Workout Detail

![Workout Detail](./screenshots/workout-detail.png)
_Individual workout page with detailed information_

## 🏗️ Architecture

- **Frontend**: Next.js (React)
- **Backend**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (version 18 or higher)

   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **pnpm** (version 8.15.5 or compatible)

   ```bash
   npm install -g pnpm@8.15.5
   ```

   - Verify installation: `pnpm --version`

3. **Docker** and **Docker Compose**

   - Download from [docker.com](https://www.docker.com/get-started)
   - Verify installation: `docker --version` and `docker-compose --version`

4. **Turbo CLI** (will be installed automatically as dev dependency)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:mhmdsbr/gymondo-workouts-app.git
cd gymondo-workouts-app
```

### 2. Install Dependencies

Install all dependencies for the monorepo:

```bash
pnpm install
```

This will install dependencies for all workspaces (apps and packages) defined in the root `package.json`.

### 3. Environment Setup

Create environment files for your applications:

#### For the API (apps/api/.env)

```bash
cd apps/api
cp .env.example .env
```

Make sure that the `.env` file in `apps/api` has the following content:

```env
# Database
DATABASE_URL="postgresql://workouts_user:workouts_password@localhost:5432/workouts_db"

# Application
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3001
```

#### For the Frontend (apps/web/.env.local)

```bash
cd ../web
cp .env.example .env.local
```

Make sure the `.env.local` file in `apps/web` has the following content:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api/workouts
```

### 4. Database Setup

#### Start PostgreSQL Database

From the root directory, start the PostgreSQL database using Docker Compose:

```bash
pnpm run db:up
```

This will:

- Pull the PostgreSQL 15 Alpine image
- Create a container named `workouts_db`
- Set up the database with the configured credentials
- Make it available on `localhost:5432`

Note: You can end the container by running:

```bash
pnpm run db:down
```

#### Initialize Database Schema and Data

Set up Prisma schema, apply migrations, and seed the database:

```bash
pnpm run db:setup
```

This command will:

- Generate Prisma client
- Push schema to database
- Seed the database with initial data

### 5. Start the Development Server

Run both frontend and backend in development mode:

```bash
pnpm run dev
```

This will start:

- **Backend API**: on `http://localhost:3000`
- **Frontend**: on `http://localhost:3001`

## 📝 Available Scripts

### Root Level Scripts

| Script              | Description                           |
| ------------------- | ------------------------------------- |
| `pnpm run dev`      | Start all apps in development mode    |
| `pnpm run build`    | Build all apps for production         |
| `pnpm run start`    | Run the app from Build files          |
| `pnpm run test`     | Run tests across all workspaces       |
| `pnpm run test:e2e` | Run end-to-end tests (see note below) |
| `pnpm run format`   | Format code using Prettier            |

Important Note on E2E Tests: As the e2e test is only written for the frontend to run end-to-end test:
First, ensure the development servers are running: pnpm run dev
In a new terminal, navigate to the frontend: cd apps/web
Run the E2E tests: pnpm run test:e2e

### Database Scripts

| Script               | Description                                      |
| -------------------- | ------------------------------------------------ |
| `pnpm run db:up`     | Start PostgreSQL container                       |
| `pnpm run db:down`   | Stop PostgreSQL container                        |
| `pnpm run db:setup`  | Generate Prisma client, push schema, and seed DB |
| `pnpm run db:studio` | Open Prisma Studio for database management       |

## 🗂️ Project Structure

```
gymondo-workouts-app/
├── apps/
│   ├── api/          # NestJS backend application
│   └── web/          # Next.js frontend application
├── packages/         # Shared packages
│   ├── eslint-config/
|   ├── jest-config/
│   └── typescript-config/
├── turbo.json
└── package.json
```

## 🚦 Features

- **Workout Listing**: Browse all available workouts
- **Month Filtering**: Filter workouts by month
- **Category Filtering**: Filter workouts by category
- **Pagination**: Navigate through workout results
- **Workout Details**: View detailed information for individual workouts

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill process using port 5432 (PostgreSQL)
   sudo lsof -ti:5432 | xargs kill -9

   # Kill process using port 3000/3001 (Apps)
   sudo lsof -ti:3000 | xargs kill -9
   sudo lsof -ti:3001 | xargs kill -9

   # This could be the most common issue you might face so make sure the ports are free with any ways you know wether by running the above commands or finding the apps which are processing and stop them.
   ```

2. **Docker Issues**

   ```bash
   # Stop all containers
   docker stop $(docker ps -aq)

   # Remove all containers
   docker rm $(docker ps -aq)

   # Restart Docker service (Linux/Mac)
   sudo systemctl restart docker

   # Or simply use Docker desktop to use GUI to do the above commands
   ```

3. **pnpm Issues**

   ```bash
   # Clear pnpm cache
   pnpm store prune

   # Reinstall dependencies
   rm -rf node_modules
   pnpm install
   ```

4. **Database Connection Issues**
   - Ensure PostgreSQL container is running: `docker ps`
   - Check database URL in environment files
   - Verify database credentials match Docker Compose configuration

### Logs and Debugging

- **View container logs**: `docker logs workouts_db`
- **Check container status**: `docker ps -a`
- **Turborepo cache**: Clear with `turbo prune`

## 📄 License

This project is UNLICENSED.

## 👤 Author

Mohammad Saber

---

## 🎯 Quick Start Summary

```bash
# 1. Install dependencies
pnpm install

# 2. Start database
pnpm run db:up

# 3. Setup database
pnpm run db:setup

# 4. Start development servers
pnpm run dev
```

Your app should now be running at:

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Database: localhost:5432
