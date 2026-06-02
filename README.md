# Minimalist — Infrastructure & CI/CD

Full-stack monorepo with a Next.js frontend, Spring Boot backend, PostgreSQL database, and a Jenkins CI pipeline running automated Playwright E2E tests — all orchestrated with Docker Compose.

---

## Project Structure

```
minimalist/
├── web-app/               # Next.js 16 frontend (pnpm)
│   ├── e2e/               # Playwright E2E tests
│   └── playwright.config.ts
├── back-app/              # Spring Boot 3 + Java 21 backend
├── docker-compose.yml     # All services: db, backend, frontend, Jenkins
├── Dockerfile.Jenkins     # Jenkins image with Docker CLI installed
└── Jenkinsfile            # CI pipeline definition
```

---

## Services

| Service           | Container           | Port  | Description              |
|-------------------|---------------------|-------|--------------------------|
| PostgreSQL 16     | `minimalist_db`     | 5432  | Database                 |
| Spring Boot API   | `minimalist_back`   | 8080  | REST backend             |
| Next.js App       | `minimalist_web`    | 3000  | Frontend                 |
| Jenkins           | `minimalist_jenkins`| 8090  | CI server                |

All services share the `minimalist_net` bridge network, so they communicate by container name (e.g. `minimalist_back:8080`).

---

## How the CI Pipeline Works

### Architecture

```
Jenkins container
  └── Docker CLI  ──── /var/run/docker.sock ──── Host Docker Daemon
                                                       ├── minimalist_web  (3000)
                                                       ├── minimalist_back (8080)
                                                       └── minimalist_db   (5432)
```

Jenkins uses **Docker-outside-of-Docker (DooD)**: the host Docker socket is mounted into the Jenkins container. This lets Jenkins spawn agent containers (e.g. the Playwright runner) that join the same `minimalist_net` network and communicate directly with the running application containers.

### Pipeline Stages (`Jenkinsfile`)

```
Checkout → Install pnpm → Install Dependencies → Install Playwright → Build → Run E2E Tests
```

1. **Checkout** — pulls source code from SCM.
2. **Install pnpm** — installs pnpm 11 globally inside the Playwright agent.
3. **Install Dependencies** — runs `pnpm install --frozen-lockfile` in `web-app/`.
4. **Install Playwright Browsers** — downloads Chromium with system dependencies.
5. **Build** — runs `pnpm build` to validate the Next.js build.
6. **Run E2E Tests** — runs `pnpm exec playwright test` against the live `minimalist_web` container.

After every run (pass or fail), the HTML report is published via the **HTML Publisher** Jenkins plugin and raw artifacts are archived.

### Playwright Agent

The Playwright tests run inside a `mcr.microsoft.com/playwright` container spawned by Jenkins:

```groovy
agent {
    docker {
        image 'mcr.microsoft.com/playwright:v1.52.0-noble'
        args '--ipc=host -u root --network minimalist_net'
    }
}
```

`--network minimalist_net` connects the agent to the same network as `minimalist_web`, so tests reach the frontend at `http://minimalist_web:3000`.

### Base URL Resolution

| Environment | BASE_URL                      |
|-------------|-------------------------------|
| Local dev   | `http://localhost:3000`       |
| CI (Docker) | `http://minimalist_web:3000`  |

The `playwright.config.ts` reads `process.env.BASE_URL` — the Jenkinsfile sets it to the Docker container URL automatically.

---

## Setup & Running

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose plugin)
- Git

### 1. Clone the repository

```bash
git clone <repo-url>
cd minimalist
```

### 2. Start all services

```bash
docker compose up --build
```

This builds and starts PostgreSQL, the Spring Boot API, the Next.js app, and Jenkins in order. The backend waits for the database health check before starting.

| URL                   | Service          |
|-----------------------|------------------|
| http://localhost:3000 | Frontend (Next.js) |
| http://localhost:8080 | Backend (API)    |
| http://localhost:8090 | Jenkins          |

### 3. First-time Jenkins setup

1. Open http://localhost:8090
2. Get the initial admin password:
   ```bash
   docker exec minimalist_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Install suggested plugins — make sure **Docker Pipeline** and **HTML Publisher** are included.
4. Create your admin user.

### 4. Create the Pipeline job

1. New Item → **Pipeline** → name it (e.g. `minimalist-ci`)
2. Under **Pipeline**, set **Definition** to `Pipeline script from SCM`
3. Set SCM to Git and point to your repository
4. Script Path: `Jenkinsfile`
5. Save and click **Build Now**

---

## Running E2E Tests Locally

Make sure the frontend is running first (`docker compose up web-app` or `pnpm dev`), then:

```bash
cd web-app
pnpm install
pnpm exec playwright install chromium
pnpm test:e2e
```

To run against the Docker stack instead of localhost:

```bash
BASE_URL=http://localhost:3000 pnpm test:e2e
```

View the HTML report after a run:

```bash
pnpm exec playwright show-report
```

---

## Writing E2E Tests

Tests live in `web-app/e2e/`. Example:

```ts
// web-app/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Minimalist/);
});
```

Run a single test file:

```bash
pnpm exec playwright test e2e/home.spec.ts
```

Run in headed mode (visible browser) for debugging:

```bash
pnpm exec playwright test --headed
```

---

## Stopping Services

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (wipes database and Jenkins data)
docker compose down -v
```
