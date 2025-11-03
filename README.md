# Communitere Ecosystem Map

A database-driven web application for mapping and managing community organizations across the NGO ecosystem.

## Tech Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **UI Library:** NextUI (formerly HeroUI) + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Maps:** React-Leaflet + Leaflet
- **State Management:** React Context (can be extended with Redux/Zustand)

## Setup Instructions

### 1. Clone or Download the Repository

```bash
cd ecosystem-map
npm install
```

### 2. Create a Supabase Account and Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project (select your preferred region)
4. Wait for the project to be provisioned

### 3. Create the Database Table

In Supabase Dashboard, go to SQL Editor and run:

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  organization TEXT NOT NULL,
  type TEXT,
  location TEXT,
  description TEXT,
  services TEXT,
  contact TEXT,
  website TEXT,
  scope TEXT,
  founded TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create an index for faster searches
CREATE INDEX idx_organizations_category ON organizations(category);
CREATE INDEX idx_organizations_location ON organizations(location);
CREATE INDEX idx_organizations_organization ON organizations(organization);
```

### 4. Get Your Supabase Credentials

1. In Supabase Dashboard, click "Settings" → "API"
2. Copy your:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Set Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Map View:** Interactive map showing all organizations by location
- **List View:** Searchable grid of organization cards
- **Search & Filter:** Find organizations by name, category, location, or scope
- **Organization Details:** Modal view with full organization information
- **Responsive Design:** Works on desktop, tablet, and mobile devices

## Next Steps

### Migrating Data

The HTML file contains 69 organizations from your original prototype. To import them:

1. Export organizations as CSV from the HTML
2. Use Supabase's Table Editor to import data, or
3. Use the API to bulk insert data

### Admin Panel (Future)

Once data migration is complete, we'll build a user-friendly admin panel for:
- Adding new organizations
- Editing existing entries
- Deleting organizations
- Bulk import/export

## Deployment

### To GitHub

```bash
git init
git add .
git commit -m "Initial commit: Ecosystem Map MVP"
git remote add origin https://github.com/yourusername/ecosystem-map.git
git branch -M main
git push -u origin main
```

### To Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Project Structure

```
ecosystem-map/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Next.js pages & API routes
│   ├── lib/             # Utilities (Supabase client, helpers)
│   ├── styles/          # Global CSS and tailwind
│   ├── types/           # TypeScript types
│   └── assets/          # Images, fonts, etc.
├── public/              # Static files
├── .env.local           # Environment variables (local only)
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Support

For issues or questions, check the documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextUI Docs](https://nextui.org/docs)

## License

MIT
