# Green Calculator App

A fullstack calculator built with Next.js, TypeScript, TypeORM, and SQLite — featuring a green-themed UI.

## Features

- 🟢 Green-themed responsive UI
- ✅ Full arithmetic operations: +, −, ×, ÷
- 🗄️ Calculation history stored in SQLite via TypeORM
- 📜 Toggleable history panel
- 🐳 Docker & Docker Compose support

## Local Development

```bash
cd calculator-app
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker Deployment

```bash
docker-compose up --build
```

## API Endpoints

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| GET    | /api/calculations    | Get last 50 calculations       |
| POST   | /api/calculations    | Save a new calculation         |

### POST Body
```json
{
  "expression": "5 + 3",
  "result": "8"
}
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: SQLite + TypeORM + better-sqlite3
- **Deployment**: Docker, Docker Compose
