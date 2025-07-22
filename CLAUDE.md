# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Activities Journal web application called "Rob's Activities Journal" (formerly a cooking app) - a static HTML/CSS/JavaScript application with Netlify serverless functions that allows users to create and save celebration cards for activities and achievements. The app includes photo uploads, supportive messages, optional Bible verses, and activity documentation.

## Architecture

- **Frontend**: Vanilla HTML/CSS/JavaScript static site
- **Backend**: Netlify serverless functions (TypeScript)
- **Database**: PostgreSQL via Netlify/Neon integration with Drizzle ORM
- **Hosting**: Netlify (configured via netlify.toml)

### Key Components

- `index.html` - Main application interface
- `script.js` - Core frontend logic and UI interactions
- `styles.css` - Application styling
- `netlify/functions/` - Serverless API endpoints
- `db/` - Database schema and connection setup

## Development Commands

```bash
# Local development server
npm run dev    # Starts http-server on port 8888

# Database operations
npm run db:generate    # Generate Drizzle migrations
npm run db:migrate     # Run database migrations

# Build (no build process required - static site)
npm run build    # Echo message - no actual build step needed

# Tests (not implemented)
npm run test    # Currently returns error - no test framework configured
```

## Database Schema

The application uses a single `celebrations` table with these fields:
- `id` (auto-generated primary key)
- `clientName` (optional varchar)
- `supportiveMessage` (required text)
- `activityDetails` (optional text)
- `documents` (optional JSON string)
- `bibleVerse` & `bibleReference` (optional text)
- `photoUrl` (base64 data URL)
- `createdAt` (timestamp)
- `createdBy` (optional varchar)

## Netlify Functions

- `save-celebration.ts` - Saves celebration data to database with automatic table creation/migration
- `get-celebrations.ts` - Retrieves celebration history
- `get-quote.ts` - Fetches inspirational quotes
- `migrate-database.ts` - Database migration endpoint

## Key Features

1. **Photo Upload**: Drag-and-drop support with preview and size validation
2. **Bible Verses**: Optional inspirational verses with regeneration capability
3. **Documents**: Support for uploading activity-related documents
4. **Print Functionality**: Optimized celebration card printing
5. **Inspirational Quotes**: Dynamic header quotes from external API with fallbacks
6. **Database Persistence**: Automatic saving of celebrations to PostgreSQL

## Environment Setup

Requires `NETLIFY_DATABASE_URL` environment variable for database connection.

## Development Notes

- Uses Drizzle ORM with PostgreSQL
- Database schema automatically creates missing tables/columns
- Extensive error handling with user-friendly fallbacks
- Client-side validation and character counting
- Keyboard shortcuts (Ctrl+Enter to generate, Ctrl+P to print)
- Responsive design with smooth animations