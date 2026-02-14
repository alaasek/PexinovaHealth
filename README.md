# Pexinova Health

Monorepo containing the healthcare ecosystem including a Node.js backend and multiple React Native frontend applications.

## Getting Started

### Installation

Install dependencies in all workspaces:

```powershell
npm install
npm --prefix backend install
npm --prefix frontend/nova install
npm --prefix frontend/pexils install
npm --prefix starhealth install
```

### Running the Project

Run all services concurrently:
```powershell
npm run start:all
```

Specific run commands:
- Backend: `npm run backend`
- Pexils (Integrated App): `npm run frontend:pexils`
- Nova: `npm run frontend:nova`
- StarHealth: `npm run frontend:starhealth`

## Project Structure

- `/backend`: Node.js server (Express, TypeScript, MongoDB)
- `/frontend/pexils`: Integrated mobile app (Nova Game + Health History + Stats)
- `/frontend/nova`: Medication tracker game
- `/starhealth`: Healthcare management application

## Troubleshooting

### TypeScript Errors
If types are missing in the backend:
```powershell
cd backend
npm install @types/express @types/cors @types/node --save-dev
```

### Icons / Metro Resolution
If icons fail to load in frontend:
```powershell
cd frontend/pexils
npm install @expo/vector-icons
npx expo start --clear
```

### Database
Requires MongoDB running at `mongodb://127.0.0.1:27017/`.
