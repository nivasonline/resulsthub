# ResultHub

A modern university/college Result Management System — students search results
instantly with a hall ticket or registration number; admins manage students,
bulk-import Excel sheets, publish/hide results, and view analytics from a
dashboard.

**Stack:** React 19 + Vite + Tailwind CSS v4 (frontend) · Node.js + Express +
Sequelize + MySQL (backend) · JWT auth · Recharts · jsPDF.

---

## 1. Prerequisites

- Node.js 18+ and npm
- MySQL 8+ running locally (or a hosted instance)

## 2. Database setup

Create the database (tables are created automatically by Sequelize on first run):

```sql
CREATE DATABASE resulthub;
```

## 3. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in your real MySQL credentials and a long random
`JWT_SECRET`. Then:

```bash
npm install
npm run dev
```

This starts the API on `http://localhost:5000` and auto-creates all tables
(`students`, `subjects`, `admins`) via `sequelize.sync({ alter: true })` in
development.

**Create your first admin account** (reads `ADMIN_SEED_USERNAME` /
`ADMIN_SEED_PASSWORD` from `.env`, defaults to `admin` / `ChangeMe123!`):

```bash
npm run seed
```

Log in with those credentials at `/admin/login` in the frontend, then change
the password from Settings once that endpoint is wired up (see note below).

## 4. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`.

## 5. Importing results via Excel

From **Admin → Upload Results**, upload an `.xlsx`/`.xls` file with one row
per subject. Rows sharing the same `hallTicket` are grouped into a single
student record automatically. Expected columns (case-insensitive header row):

```
hallTicket | registrationNumber | name | fatherName | motherName |
department | semester | section | email | phone |
subjectName | internalMarks | externalMarks | credits
```

A student with 5 subjects = 5 rows, one per subject, all sharing the same
`hallTicket`. Results are imported as **hidden** by default — publish them
from the Students table once you're ready for students to see them.

## 6. Project structure

```
ResultHub/
├── backend/
│   ├── config/        → Sequelize/MySQL connection
│   ├── controllers/    → route handlers
│   ├── middleware/     → auth, error handling, rate limiting, uploads, validation
│   ├── models/         → Admin, Student, Subject (+ associations)
│   ├── routes/         → authRoutes, resultRoutes, adminRoutes
│   ├── services/       → business logic (auth, results, Excel import)
│   ├── utils/          → grade calculator, JWT helpers, ApiError, asyncHandler
│   ├── database/seed.js → creates the first admin account
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/        → Button, Input, Card, Modal, Table, Pagination, etc.
        │   ├── common/    → Navbar, Footer, ProtectedRoute
        │   ├── dashboard/ → Sidebar, Topbar, StatCard
        │   └── forms/     → StudentForm
        ├── context/       → AuthContext, ToastContext
        ├── hooks/         → useFetch, useDebounce, useLocalStorage
        ├── services/      → axios API layer (one file per resource)
        ├── layouts/       → MainLayout (public), AdminLayout (dashboard)
        ├── pages/         → one component per route
        └── utils/         → pdfGenerator.js
```

## 7. API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/login` | — | Admin login, returns JWT |
| GET | `/api/admin/me` | JWT | Current admin profile |
| GET | `/api/results/:hallTicket` | — | Published result by hall ticket |
| GET | `/api/results/reg/:registrationNumber` | — | Published result by reg. number |
| GET | `/api/admin/students` | JWT | Paginated/searchable student list |
| GET | `/api/admin/students/:id` | JWT | Single student with subjects |
| POST | `/api/admin/student` | JWT | Create student (+ subjects) |
| PUT | `/api/admin/student/:id` | JWT | Update student (+ replace subjects) |
| DELETE | `/api/admin/student/:id` | JWT | Delete student (cascades subjects) |
| PATCH | `/api/admin/student/:id/publish` | JWT | Publish/hide one result |
| PATCH | `/api/admin/students/publish-bulk` | JWT | Publish/hide many at once |
| POST | `/api/admin/upload` | JWT | Excel import (multipart, field: `file`) |
| GET | `/api/admin/analytics/overview` | JWT | Dashboard summary numbers |
| GET | `/api/admin/analytics/department-stats` | JWT | Student count by department |
| GET | `/api/admin/analytics/semester-stats` | JWT | Student count by semester |
| GET | `/api/admin/analytics/toppers` | JWT | Ranked list by SGPA |

## 8. Known follow-ups before production

- The **Settings → Change Password** form is UI-only; wire it to a new
  `PATCH /api/admin/change-password` route (hash + verify with bcrypt) before
  relying on it.
- Grade thresholds live in `backend/utils/gradeCalculator.js` — adjust
  `GRADE_SCALE` and `PASS_THRESHOLD` to match your university's actual
  grading policy before going live.
- Photo upload for student profiles isn't wired up yet (`photoUrl` field
  exists on the model but there's no upload route) — add a Multer route
  similar to the Excel upload if you want it.
- In production, prefer running explicit Sequelize migrations instead of
  `sequelize.sync({ alter: true })`.

## 9. Deployment

- **Frontend → Vercel**: import the `frontend/` folder as the project root,
  set `VITE_API_BASE_URL` to your deployed backend URL in Vercel's
  environment variables.
- **Backend → Render**: deploy `backend/` as a Web Service, set the same
  environment variables as `.env.example`, and point `CLIENT_URL` at your
  deployed Vercel URL (for CORS).
- **Database**: any managed MySQL instance (PlanetScale, Railway, Render
  MySQL, RDS) — just update `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD`.
"# resulsthub" 
