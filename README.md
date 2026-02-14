Smart Bookmark
=================

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

**Live Link:** [StashMark](https://your-app.vercel.app)
    

Tech Stack
-------------

### Frontend

*   **Next.js 16 (App Router)**
    
*   **TypeScript**
    
*   **Tailwind CSS**
    
*   **Prebuilt animated components using Three.js, Motion, etc**
    

### Backend / Services

*   **Supabase**
    
    *   Auth (Google OAuth)
        
    *   Postgres Database
        
    *   Realtime subscriptions
        
    *   Row Level Security (RLS)
        

### Deployment

*   **Vercel**
    

Features
----------

### Authentication

*   Google OAuth via Supabase
    
*   Production-mode OAuth (no test-user restriction)
    
*   Protected dashboard routes using middleware
    
*   Secure session handling
    

### Bookmark Management

*   Add, Edit, Delete and view bookmarks
    
*   Toast notifications for all CRUD actions
    

### Real-Time Sync

*   Supabase Realtime subscriptions
    
*   Sync database changes across multiple browser tabs
    
*   Duplicate event prevention
    

### UI & UX

*   Responsive layout (mobile + desktop)
    
*   Dynamic favicon rendering
    
*   Fallback to letter avatar when favicon unavailable
    
*   Animated hero background (Three.js shader-based)
    
*   Custom empty state UI
    
*   Loading and error boundaries (App Router)
    

Environment Variables
------------------------

Create a .env.local file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key 
```

Running Locally
------------------

```Plain text 
git clone https://github.com/your-username/smart-bookmark.git  
cd smart-bookmark  
npm install  
npm run dev 
```

Visit:

```Plain text 
http://localhost:3000
```

Deployment Notes
-------------------

Deployment was done using Vercel.

After deployment:

1.  Updated Supabase:
    
    *   Site URL
        
    *   Redirect URLs
        
2.  Updated Google OAuth:
    
    *   Production publishing enabled
        
    *   Added Vercel domain to Authorized Origins
        

Database Schema
------------------

**Bookmarks**
```Plain text 
id          uuid (primary key)
title       text
url         text
user_id     uuid (foreign key → auth.users)
created_at  timestamp
```

Challenges and Solutions
========================

1> Supabase Integration in App Router
------------------------------------------------------------------

**Problem**

One of the most challenging parts of the project was understanding how Supabase authentication works within the Next.js App Router architecture.

Unlike traditional client-only setups, App Router requires:

*   A **server-side Supabase client** (for Server Components and authenticated actions)
    
*   A **browser-side Supabase client** (for realtime and client interactions)
    

Initially, I struggled with:

*   Why multiple clients were necessary
    
*   Why cookies had to be manually handled
    
*   Why a single exported Supabase instance could not be reused everywhere
    
*   How middleware/proxy interacts with authentication

**Solution**

The breakthrough came from clearly separating responsibilities:

*   A server client that reads session data from cookies using next/headers
    
*   A client client for browser-side realtime and interaction logic
    
*   Proper route protection using middleware/proxy to validate sessions
    

Understanding this distinction was key:

> The browser client manages session persistence, realtime behavior and UI interaction while the server client reads the session from cookies on every request for authenticated data fetching.
    


2> Designing Realtime Without Duplicates or Stale Data
-------------------------------------------------------

**Problem**

Implementing Supabase Realtime correctly was more complex than expected.

The main challenges were:

*   Structuring the correct channel subscription
    
*   Avoiding duplicate entries when inserts occur
    
*   Ensuring updates replace the correct bookmark
    
*   Preventing stale UI state when multiple tabs are open
    

**Solution**

I designed the subscription around deterministic state updates:

*   Subscribed specifically to the bookmarks table
    
*   Used bookmark.id as the single source of truth
    

For each event type:

*   **INSERT** → append only if the ID does not already exist
    
*   **UPDATE** → replace the matching bookmark by ID
    
*   **DELETE** → remove by ID
    

3> Favicon Fallback Edge Cases
-------------------------------

**Problem**

Displaying site favicons reliably turned out to be trickier than expected.

Using Google’s favicon endpoint sometimes returned:

*   A fallback globe image instead of an actual favicon
    
*   Cached responses that made failure detection unreliable
    

This led to unpredictable behavior where:

*   Sometimes the intended fallback appeared
    
*   Other times Google’s default globe was displayed instead
    

**Solution**

Instead of relying purely on onError, I implemented controlled fallback logic:

*   Attempt to load the favicon normally
    
*   Detect invalid or undesirable responses
    
*   Replace with an avatar using the first letter of the domain
    

This approach ensured a consistent, intentional UI even when favicon resolution failed.
    

Future Improvements
----------------------

*   Folder-based bookmark organization
    
*   Search functionality
    
*   Bookmark preview metadata