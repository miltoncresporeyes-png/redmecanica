# RedMecanica

RedMecanica is a platform for automotive services. This repository contains the React/Vite frontend, the Node.js API, shared TypeScript types, and the mobile application.

## Requirements

- Node.js 20 or later
- npm

## Local Development

1. Copy `frontend/.env.example` and `backend/.env.example` to local environment files, then configure their values.
2. Install dependencies with `npm install`.
3. Start the frontend with `npm run dev -w frontend`.
4. Start the API with `npm run dev -w backend`.

## Production Build

Build the static frontend with:

```bash
npm run build:frontend
```

The generated site is placed in `frontend/dist`. Configure Hostinger's Git deployment with the repository root as its root directory, `npm run build:frontend` as the build command, and `frontend/dist` as the output directory.

The backend is deployed separately. See `DEPLOY.md` for deployment details.
