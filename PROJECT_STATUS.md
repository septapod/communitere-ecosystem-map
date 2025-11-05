# Communitere Ecosystem Map - Project Status

**Last Updated:** November 4, 2025, 12:30 PM
**Status:** ⚠️ **BROKEN - BUILD FAILING ON VERCEL**

---

## Current Issue

### Build Status: FAILED ❌

The Vercel deployment is **still failing** due to continued TypeScript type mismatches with NextUI components. Multiple component prop names were incorrect in the original codebase.

**Latest Error (Commit c63f10b):**
```
Type error: Property 'activeKey' does not exist on type 'IntrinsicAttributes & TabsProps<object>'.
```

### Fixes Applied (But More Issues Remain)

1. ✅ **Downgraded React 18** (Commit 2e6c78e)
   - React: 19.2.0 → 18.3.1
   - react-leaflet: 5.0.0 → 4.2.1
   - @types/react: 19.2.2 → 18.3.12

2. ✅ **Fixed Supabase .distinct() Error** (Commit 1a29eaa)
   - Replaced unsupported `.distinct()` method
   - Implemented JavaScript Set-based deduplication

3. ✅ **Fixed Select Components** (Commit 86926e7)
   - Category and Scope filters
   - Added wrapper functions for SharedSelection type handling

4. ✅ **Fixed Tabs Component Props** (Commit c63f10b)
   - Changed `activeKey` → `selectedKey`
   - Added type casting for onSelectionChange

### Problem Pattern Identified

The codebase appears to have been generated with **incorrect NextUI component API assumptions**. Component prop names don't match NextUI 2.6.11's actual API:

- ❌ Select: `onSelectionChange` expects `SharedSelection` type, not direct state setter
- ❌ Tabs: Uses `selectedKey` not `activeKey`
- ❌ Likely more mismatches exist in other components

---

## Architecture

### Current Stack
- **Framework:** Next.js 16.0.1 with Turbopack
- **React:** 18.3.1
- **UI Library:** NextUI 2.6.11 (deprecated, migration recommended)
- **Database:** Supabase PostgreSQL
- **Mapping:** React-Leaflet 4.2.1 + Leaflet 1.9.4
- **Styling:** Tailwind CSS 4.1.16
- **State Management:** React Hooks
- **TypeScript:** 5.9.3 (strict mode enabled on Vercel)

### Key Files
- `/src/pages/index.tsx` - Main dashboard with filters and tabs
- `/src/pages/_app.tsx` - App wrapper with NextUIProvider
- `/src/components/OrganizationList.tsx` - List view component
- `/src/components/MapView.tsx` - Map view component
- `/src/lib/supabase.ts` - Database queries
- `/src/types/index.ts` - TypeScript interfaces

---

## What's Working

✅ Local development environment runs without errors
✅ Database connection to Supabase
✅ Data fetching logic
✅ Basic UI layout renders
✅ Filter logic implemented

## What's Broken

❌ **Vercel production build fails** on TypeScript compilation
❌ Multiple NextUI component prop mismatches
❌ Cannot deploy to production
❌ List of errors likely to continue as more components are hit

---

## Root Cause Analysis

The codebase was likely generated without proper testing of NextUI component APIs. Specifically:

1. **NextUI 2.6.11 deprecation warnings** - This version is old and deprecated
2. **React 18 compatibility** - NextUI wasn't designed for React 18's stricter types
3. **Component API mismatches** - Multiple components use wrong prop names
4. **TypeScript strict mode on Vercel** - Catches type errors that local dev misses

---

## Recommended Solutions

### Option 1: Replace NextUI with HTML + Tailwind (RECOMMENDED)
- **Time:** 2-3 hours
- **Effort:** Rewrite UI layer with semantic HTML and Tailwind classes
- **Benefit:** Eliminates all NextUI type issues, simpler maintenance
- **Trade-off:** Loss of polished component library features

### Option 2: Replace with Shadcn/ui or Radix UI
- **Time:** 3-4 hours
- **Effort:** Install headless component library, rebuild UI
- **Benefit:** Modern, TypeScript-first components, better documentation
- **Trade-off:** Learning curve for new library

### Option 3: Continue Patching NextUI Errors
- **Time:** Unpredictable (could be many more errors)
- **Effort:** High and repetitive
- **Benefit:** Keeps current UI design
- **Trade-off:** Unsustainable long-term, risk of new errors on each deploy

---

## Data Status

### Organizations Database
- **Status:** Ready to receive data
- **Current Records:** 0 (test data exists in script)
- **Schema:** 16 fields defined (name, location, category, scope, etc.)
- **Supabase RLS:** Configured for public read access

### Research Strategy
- **Documents:** DATA_DISCOVERY_STRATEGY.md, RESEARCH_SOURCES_GUIDE.md
- **Template:** RESEARCH_STARTER_TEMPLATE.csv
- **Scraper:** scrape-directories.py (Python automation script)
- **Target:** 300+ organizations by end of implementation

---

## Next Steps

### Immediate (To Get Build Working)
1. **Option:** Replace NextUI components OR continue patching errors
2. **If patching:** Find all remaining component prop mismatches
3. **Testing:** Verify build succeeds on Vercel
4. **Deployment:** Get app live

### Short-term (2-3 weeks)
1. Import organizations data
2. Test filters and search functionality
3. Verify map rendering with real data
4. User acceptance testing

### Medium-term (1 month+)
1. Implement self-submission form for organizations
2. Add admin verification workflow
3. Implement data refresh/update schedule
4. Optimize performance with real dataset

---

## GitHub Repository

**URL:** https://github.com/septapod/communitere-ecosystem-map
**Branch:** main
**Latest Commit:** c63f10b - "Fix NextUI Tabs component prop names"

### Recent Commits (This Session)
```
c63f10b - Fix NextUI Tabs component prop names
86926e7 - Fix NextUI Select TypeScript type mismatch
2e6c78e - Downgrade to React 18 for NextUI compatibility
1a29eaa - Fix Supabase .distinct() error - use JavaScript Set deduplication
```

---

## Deployment Status

### Vercel
- **Current Status:** Failed Build ❌
- **Last Attempt:** Nov 4, 2025, ~12:25 PM
- **Error:** TypeScript compilation failure
- **Auto-trigger:** Enabled (pushes to main trigger builds)

### Environment Variables
- ✅ NEXT_PUBLIC_SUPABASE_URL configured
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configured
- ✅ RLS policies allow public data access

---

## Known Limitations & Technical Debt

1. **NextUI Deprecation** - Library no longer maintained, should migrate
2. **React 18 Type Issues** - Strict mode reveals type mismatches
3. **Component API Errors** - Multiple prop name mismatches likely remain
4. **No Error Boundary** - Production errors could crash app
5. **Limited Data Validation** - Minimal client-side validation
6. **Manual Data Entry Process** - No automated data import workflow yet

---

## Decision Point

**As of now, we have TWO paths forward:**

### Path A: Replace UI Framework
- Clear out all NextUI components
- Rebuild UI with plain HTML + Tailwind CSS
- Gets app deployable quickly
- Simpler long-term maintenance

### Path B: Continue Debugging NextUI
- Fix remaining component prop mismatches one by one
- Keep polished UI design
- Higher risk of more errors appearing
- Time-intensive debugging process

**Recommendation:** Path A (Replace NextUI)
**Rationale:** NextUI is deprecated, causing multiple type issues, and the pattern of errors suggests more exist. Starting fresh with simpler components will be faster and more maintainable.

---

## Contact & Context

This project is part of the Communitere initiative to map mutual aid and community organizing ecosystems across the United States. The MVP aims to create a searchable, filterable database of organizations with map visualization.

**Last Updated By:** Claude Code
**Session Duration:** Multiple iterations spanning several hours
**Outstanding Issues:** 1 critical (build failure)
