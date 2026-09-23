
## Local setup

Use Node.js 20 or later and npm. From the repository directory:

```powershell
npm ci
Copy-Item .env.example .env
npm run build
npm start
```

On macOS/Linux, use `cp .env.example .env` for the copy step.
The example `DATABASE_URL` lets the production build complete without a running
database. To browse or upload saved ships, set it to a PostgreSQL database with
the `ships` table described in `src/server/db/schema.ts`.

`npm run check` runs ESLint and TypeScript checks. Ship data regression checks run
with `node --import tsx --test tests/shipey.test.ts`.

TODO:   
- [x] Redo the data schema (again...)
  - Dont upload entire shipey LOL
  - Upload stats as JSON file for querying
- [x] Ship Uploading
- [ ] Ship Searching
- [ ] Ship Stats
- [ ] Website Visual changes
- [ ] Optimizations
