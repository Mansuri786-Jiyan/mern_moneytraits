# Backend (Express, JavaScript)

## Run locally

1. Create environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Start production-style server:

```bash
npm run start
```

## Optional legacy server

The project also keeps a legacy minimal server entrypoint:

```bash
npm run dev:legacy
npm run start:legacy
```

## Default local API

- Base URL: http://localhost:8010
- Root check: GET /
- API base path: /api
