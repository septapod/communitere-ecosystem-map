# Communitere Ecosystem Map - Setup Guide

## ✅ What's Complete

Your ecosystem map application has been created with all core MVP features:

- **Frontend:** Modern Next.js application with React 19 and TypeScript
- **UI:** Beautiful NextUI components styled with Tailwind CSS
- **Database Integration:** Supabase client configured and ready
- **Features:**
  - Interactive map view with organization markers
  - Searchable list view with organization cards
  - Search and filtering by category, scope, location
  - Detail modals showing full organization information
  - Responsive design for mobile/desktop
- **Git Repository:** Initialized with initial commit ready

## 🚀 Next Steps

### Step 1: Set Up Supabase (5-10 minutes)

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up or log in
   - Create a new project

2. **Create the Database Table**
   - In your Supabase project dashboard
   - Go to **SQL Editor** (left sidebar)
   - Create a new query and paste this SQL:

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

-- Create indexes for faster queries
CREATE INDEX idx_organizations_category ON organizations(category);
CREATE INDEX idx_organizations_location ON organizations(location);
CREATE INDEX idx_organizations_organization ON organizations(organization);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Allow public read access (optional - modify based on security needs)
CREATE POLICY "Enable read access for all users" ON organizations
  FOR SELECT USING (true);
```

3. **Get Your API Credentials**
   - Click **Settings** in the left sidebar
   - Go to **API**
   - Copy your:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Configure Environment Variables**
   - In your project root, copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials

### Step 2: Migrate Your Data (10-15 minutes)

You have 69 organizations in your HTML file. Here are three ways to import them:

**Option A: Using Supabase Table Editor (Easiest)**
1. Export your organizations data as CSV
2. In Supabase, go to **organizations** table
3. Click the **upload data** icon
4. Select your CSV file

**Option B: Using Python Script**
```python
import csv
from supabase import create_client

url = "YOUR_SUPABASE_URL"
key = "YOUR_ANON_KEY"
supabase = create_client(url, key)

with open('organizations.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        supabase.table('organizations').insert(row).execute()
```

**Option C: Bulk Insert via API**
I can help you create a script to import all organizations programmatically.

### Step 3: Add Geocoding (Optional but Recommended)

For the map to work properly, organizations need latitude/longitude. We have a few options:

1. **Automatic Geocoding:** I can create a script to geocode locations
2. **Manual Entry:** Edit coordinates in Supabase for key locations
3. **Default Mapping:** Currently uses USA center, can be customized per organization

### Step 4: Deploy to GitHub

1. **Create a GitHub Repository**
   - Go to https://github.com/new
   - Create a repository named `ecosystem-map`
   - Choose your organization/account

2. **Add GitHub Remote and Push**
```bash
cd /path/to/ecosystem-map
git remote add origin https://github.com/YOUR_USERNAME/ecosystem-map.git
git branch -M main
git push -u origin main
```

### Step 5: Deploy to Vercel

1. **Sign in to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Your Repository**
   - Click **New Project**
   - Select your GitHub repository
   - Vercel will detect it's a Next.js project

3. **Add Environment Variables**
   - In Vercel project settings
   - Go to **Environment Variables**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - Deploy!

## 🧪 Local Testing Before Deployment

### Running Locally

```bash
# Install dependencies (already done)
npm install

# Create .env.local with your Supabase credentials
# Copy from .env.local.example

# Start development server
npm run dev
```

Visit http://localhost:3000 in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 📝 Project Structure

```
ecosystem-map/
├── src/
│   ├── components/
│   │   ├── Map.tsx              # Leaflet map component
│   │   ├── MapView.tsx          # Map view wrapper
│   │   ├── OrganizationList.tsx # List and modal component
│   │   └── icons/
│   │       └── SearchIcon.tsx    # SVG icons
│   ├── pages/
│   │   ├── _app.tsx             # Next.js app wrapper
│   │   └── index.tsx            # Main page/home
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & queries
│   ├── styles/
│   │   └── globals.css          # Global Tailwind styles
│   └── types/
│       └── index.ts             # TypeScript definitions
├── public/                      # Static files
├── .env.local.example           # Environment variables template
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # Project documentation
```

## 🔧 Future Enhancements

After the MVP is working, we can add:

1. **Admin Panel**
   - Add/edit/delete organizations via web UI
   - Bulk import/export
   - User authentication

2. **Advanced Features**
   - Organization filtering by multiple criteria
   - Favorites/bookmarking
   - Export to PDF
   - Advanced search with autocomplete

3. **Geolocation**
   - Auto-detect user location
   - Show nearby organizations
   - Distance calculations

4. **Social Features**
   - Comments/reviews
   - Relationship mapping between organizations
   - Activity feed

## ⚠️ Important Notes

1. **Environment Variables:** Never commit `.env.local` - it's in `.gitignore`
2. **Supabase Security:** Start with read-only access, add write permissions for authenticated users later
3. **Map Coordinates:** Organizations without lat/lng will cluster at default US center
4. **API Keys:** Your `NEXT_PUBLIC_*` keys are public but limited to Supabase read access

## 📞 Support

If you encounter issues:

1. Check the console for error messages (F12 in browser)
2. Verify environment variables are set correctly
3. Ensure Supabase project is running
4. Check network tab for API calls

## 🎉 You're Ready!

The hardest part is done. Now it's just connecting your data and deploying. Follow the steps above and you'll have a live ecosystem map in about 30 minutes.

Good luck! 🚀
