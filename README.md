# 🛠️ Maintenance Reminder Dashboard

A modern, production-ready **Maintenance Reminder Dashboard** to manage assets, schedule maintenance, track history, send automated reminders, and generate corporate-grade reports (PDF / Excel).

Designed for **small–medium teams** managing machines, servers, UPS, AC units, generators, etc.

---

## ✨ Features

### Core
- Asset management (Create / Update / Delete)
- Maintenance scheduling
- Automatic **next due date** calculation
- Status detection:
  - ✅ OK
  - ⚠️ Due Soon
  - ❌ Overdue
- Role-based access (Admin / Viewer)
- Google OAuth login
- Secure sessions

### Maintenance Records
- Complete maintenance
- Reschedule with remarks
- Full maintenance history
- Auto-capture **Updated By (logged-in user email)**

### Email Automation
- Automated reminder emails
- Vercel Cron based scheduling
- Resend email delivery

### Reports (PDF & Excel)
- Overdue / Due Soon snapshot
- Maintenance records report
- Completed maintenance per month
- Corporate PDF layout with:
  - Company logo
  - Header metadata
  - Page numbers
  - Clean tables

### UI / UX
- Modern glassmorphism UI
- Dark theme dashboard
- Responsive design
- Clean, accessible layouts

---

## 🧱 Tech Stack

### Frontend
- **Next.js 16 (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **Supabase (PostgreSQL)**

### Authentication
- **Auth.js (NextAuth v5)**
- Google OAuth Provider

### Emails & Automation
- **Resend** – transactional emails
- **Vercel Cron** – scheduled reminders

### Reporting
- **PDFKit** – PDF generation
- **ExcelJS** – Excel export

### Deployment
- **Vercel**
- **Supabase Cloud**

---

## 📁 Folder Structure

```text
maintenance_app/
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
│
├─ public/
│  └─ company-logo.png
│
├─ src/
│  ├─ app/
│  │  ├─ (auth)/
│  │  │  └─ signin/
│  │  │
│  │  ├─ admin/
│  │  │  ├─ assets/
│  │  │  ├─ records/
│  │  │  └─ reports/
│  │  │
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  ├─ cron/
│  │  │  │  └─ reminders/
│  │  │  └─ reports/
│  │  │     └─ [report]/
│  │  │
│  │  └─ dashboard/
│  │
│  ├─ components/
│  │  ├─ modals/
│  │  ├─ tables/
│  │  └─ ui/
│  │
│  ├─ lib/
│  │  ├─ prisma.ts
│  │  ├─ maintenance.ts
│  │  ├─ pdfReport.ts
│  │  └─ guards.ts
│  │
│  └─ auth.ts
│
├─ .env.example
├─ next.config.ts
├─ package.json
└─ README.md

---

## 🗄️ Database Models (Simplified)

### Asset

```ts
Asset {
  id
  assetId
  name
  category
  location
  lastMaintenance
  frequencyDays
  assignedTo
  notes
}
```

### MaintenanceRecord

```ts
MaintenanceRecord {
  id
  assetId
  action        // COMPLETED | RESCHEDULED
  performedAt
  scheduledFor
  remark
  updatedByEmail
}
```

---

## 🔐 Authentication & Roles

- Google OAuth login using Auth.js
- Role-based access (Admin / Viewer)
- Admin-only routes protected via server-side guards
- Sessions handled securely using HttpOnly cookies

---

## ⏱️ Cron Jobs (Automated Reminders)

### Daily Reminder Job

- Implemented using **Vercel Cron**
- Endpoint: `/api/cron/reminders`
- Authentication via `x-vercel-cron` header
- Optional `CRON_SECRET` for manual execution/testing

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

## 📊 Reports

The system supports downloadable **PDF and Excel** reports.

### Available Reports
- Maintenance Status (Overdue / Due Soon)
- Maintenance Records (Completed / Rescheduled)
- Completed Maintenance per Month

### PDF Features
- Corporate header with company logo
- Report metadata (Report No, Prepared By, Period)
- Clean table layouts
- Page numbers on every page
- Print-ready formatting

---

## 📧 Email System

- Provider: **Resend**
- HTML email templates
- Automatic batching to avoid rate limits
- Used for maintenance reminders and alerts

---

## ⚙️ Environment Variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

RESEND_API_KEY=...

CRON_SECRET=optional-secret

COMPANY_NAME=Your Company Name
COMPANY_ADDRESS=Company address
COMPANY_CONTACT=email | phone
```

---

## 🚀 Local Development

```bash
npm install
npx prisma migrate dev
npm run dev
```

---

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Import project into Vercel
3. Configure environment variables
4. Deploy the project
5. Run database migrations if required:

```bash
npx prisma migrate deploy
```

---

## 🔒 Security Considerations

- All sensitive operations handled server-side
- No secrets exposed to client
- Cron endpoints protected
- Database access restricted via Prisma ORM

---

## 🧭 Future Enhancements

- Asset analytics by category
- SLA breach tracking
- Team-based permissions
- CSV import/export
- Mobile-friendly PWA

---

## 📄 License

MIT (or internal organizational use)

---

## 👤 Author

Built for real-world maintenance and operations management.
