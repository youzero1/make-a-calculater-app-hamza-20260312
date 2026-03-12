# Calculator App

A fullstack calculator application built with Next.js, TypeScript, and SQLite. Features a red-themed UI design.

## Features

- Basic arithmetic operations: +, -, ×, ÷
- Calculation history stored in SQLite database
- Red-themed responsive UI
- REST API for history management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite via TypeORM + better-sqlite3
- **Container**: Docker + Docker Compose

## Getting Started

### Local Development

```bash
cd calculator-app
npm i
mkdir -p data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
cd calculator-app
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET /api/history` — Retrieve past calculations
- `POST /api/history` — Save a new calculation
  - Body: `{ expression: string, result: string }`

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/calculator.db` | Path to SQLite database file |
| `NEXT_PUBLIC_APP_TITLE` | `Calculator` | App title displayed in UI |
