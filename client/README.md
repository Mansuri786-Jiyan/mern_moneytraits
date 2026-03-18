# Client (React + Vite, JavaScript)

## Run locally

1. Create env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Start dev server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Environment variables

- `VITE_API_BASE_URL` — backend base URL (example: `http://localhost:8010`)

## Notes

- This client is JavaScript-only (`.js/.jsx`).
- Vite uses `vite.config.js`.
