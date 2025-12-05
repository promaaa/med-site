# Medical Appointment Booking System

A web application that allows patients to book appointments online with their doctor.

The site provides a public interface for booking and a complete admin panel for the practitioner.

### Main Features

**For patients:**
- Online appointment booking with date and time slot selection
- Email booking confirmation
- Automatic reminder 24 hours before the appointment
- Cancellation via a unique link sent by email

**For the doctor (admin panel):**
- Overview of today's and upcoming appointments
- Interactive calendar (week/month view)
- Availability and closure days management
- Attendance statistics
- Optional Google Calendar sync
- Configuration of working hours, lunch break and appointment reasons

### Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Emails**: Resend
- **Calendar**: Google Calendar API (optional)

---

## Table of Contents

1. [Installation](#installation)
2. [Database Configuration](#database-configuration)
3. [Email Configuration with Resend](#email-configuration-with-resend)
4. [Creating the Admin Account](#creating-the-admin-account)
5. [Google Calendar Configuration](#google-calendar-configuration)
6. [Running the Application](#running-the-application)
7. [Project Structure](#project-structure)

---

## Installation

```bash
git clone <repo>
cd med-site
npm install
cp .env.example .env
```

---

## Database Configuration

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE med_site;
   ```
3. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/med_site"
   ```

### Option B: Cloud Service (Neon, Supabase, etc.)

1. Create a PostgreSQL database on your preferred service
2. Copy the connection URL to `.env`

### Schema Initialization

```bash
npx prisma generate
npx prisma db push
```

---

## Email Configuration with Resend

Emails are used for:
- Appointment confirmation
- Automatic reminders (24h before)
- Cancellation confirmation

### Setup Steps

1. Create an account at https://resend.com

2. In the Resend dashboard, go to "API Keys" and create a new key

3. Copy the key to `.env`:
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

4. (Optional) To use your own sending domain:
   - Go to "Domains" on Resend
   - Add your domain
   - Configure the required DNS records
   - Update the sender address in `src/lib/email.ts`

### Testing Emails

In development, emails are sent but may land in spam. Check your spam folder or use a verified domain for production.

---

## Creating the Admin Account

The admin panel requires an authenticated account.

```bash
npm run create:admin
```

The script will ask for:
- Administrator email
- Password (minimum 8 characters)

These credentials will be used to log in at `/admin`.

### NextAuth Configuration

Generate a secret for sessions:

```bash
openssl rand -base64 32
```

Add to `.env`:
```
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="the_generated_secret"
```

In production, replace `NEXTAUTH_URL` with your site's URL.

---

## Google Calendar Configuration

Google Calendar sync is optional. It allows:
- Automatic event creation in the doctor's calendar
- Event deletion on appointment cancellation

### Step 1: Create a Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create a new project (e.g., "Medical Office")
3. Select this project

### Step 2: Enable Google Calendar API

1. Menu > APIs & Services > Library
2. Search for "Google Calendar API"
3. Click "Enable"

### Step 3: Create a Service Account

1. Menu > APIs & Services > Credentials
2. Click "Create Credentials" > "Service Account"
3. Name: "calendar-sync" (or any name)
4. Click "Create and Continue" then "Done"

### Step 4: Generate the JSON Key

1. Click on the created service account
2. "Keys" tab > "Add Key" > "Create new key"
3. Format: JSON
4. The file downloads automatically

### Step 5: Share the Calendar

1. Open Google Calendar (calendar.google.com)
2. Right-click on the target calendar > "Settings and sharing"
3. Section "Share with specific people"
4. Add the service account email (format: `xxx@xxx.iam.gserviceaccount.com`)
5. Permission: "Make changes to events"

### Step 6: Configure in the Application

1. Log in to `/admin`
2. Go to "Settings" > "Calendar" tab
3. Paste the downloaded JSON file content
4. Enter the calendar ID (visible in Google Calendar settings, or "primary" for the main calendar)
5. Save

### Verification

```bash
npm run test:calendar
```

This script tests the connection and displays upcoming events.

---

## Running the Application

### Development

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

### Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── about/                # About page
│   ├── services/             # Services page
│   ├── contact/              # Contact page
│   ├── book/                 # Appointment booking
│   │   ├── page.tsx          # Booking form
│   │   └── confirmation/     # Confirmation page
│   ├── cancel/[token]/       # Cancellation via unique link
│   ├── admin/                # Admin panel
│   │   ├── page.tsx          # Dashboard
│   │   ├── calendar/         # Calendar view
│   │   ├── availability/     # Availability management
│   │   ├── stats/            # Statistics
│   │   └── settings/         # Settings
│   └── api/                  # API routes
│       ├── auth/             # NextAuth authentication
│       └── admin/            # Admin API (stats, settings, export)
│
├── components/
│   ├── ui/                   # UI components (button, input, calendar...)
│   ├── BookingFlow.tsx       # Booking flow
│   ├── PageHeader.tsx        # Page header
│   ├── Footer.tsx            # Footer
│   └── ...
│
├── lib/
│   ├── prisma.ts             # Prisma client
│   ├── email.ts              # Email sending via Resend
│   ├── google-calendar.ts    # Google Calendar integration
│   ├── holidays.ts           # French public holidays
│   └── reminders.ts          # Reminder system
│
└── middleware.ts             # /admin route protection
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run in production |
| `npm run create:admin` | Create an admin account |
| `npm run test:calendar` | Test Google Calendar connection |
| `npm run check:config` | Check configuration |

---

## Customization

### Modify Office Information

Office information (name, address, phone) is defined in:
- `src/app/layout.tsx` (SEO and metadata)
- `src/components/Footer.tsx`
- `src/app/contact/page.tsx`
- `src/lib/email.ts` (email templates)

### Modify Default Hours

Hours can be configured in the admin panel > Settings, or by modifying the default values in `prisma/schema.prisma`.

### Modify Appointment Reasons

Reasons are configurable in the admin panel > Settings > "Reasons" tab.