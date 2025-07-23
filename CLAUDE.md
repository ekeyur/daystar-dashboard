# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js dashboard application for Daystar's campaign management system. The dashboard displays real-time campaign metrics including pledge counts, amounts, and geographic breakdowns (US, CA, INTL) with live vs web contribution tracking.

## Commands

### Development

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Key URLs

- Main dashboard: http://localhost:3000

## Architecture

### Core Technologies

- **Next.js 15** with App Router
- **React 19** with client components
- **SWR** for data fetching and caching
- **Axios** for HTTP requests
- **Material-UI Charts** (@mui/x-charts) for pie charts
- **Tailwind CSS + DaisyUI** for styling (corporate theme)

### Authentication Flow

- Uses Salesforce OAuth2 client credentials flow
- Auth context (`src/contexts/authcontext.js`) manages tokens in sessionStorage
- Auto-login on app load and 401 errors
- API requests include Bearer token via axios interceptors

### Data Flow

1. **Authentication**: `/api/auth-token` route gets Salesforce access token
2. **Data Fetching**: `useDashboardData` hook fetches from `/api/live-ticker-data` every 5 seconds
3. **Data Processing**: Utility functions in `src/utils/index.js` format raw data for tables
4. **Real-time Updates**: SWR handles auto-refresh with keepPreviousData for smooth updates

### Key Components Structure

- **Root Layout** (`src/app/layout.js`): Wraps app with AuthProvider and SWRConfig
- **Main Page** (`src/app/page.js`): Dashboard with ticker table, campaign table, and pie chart
- **Header** (`src/components/Header.js`): Navigation component
- **AnimatedValue** (`src/components/AnimatedValue.js`): Handles smooth value transitions

### API Routes

- `/api/auth-token` - Salesforce OAuth2 token endpoint
- `/api/live-ticker-data` - Dashboard data proxy to Salesforce

### Environment Variables Required

- `SALESFORCE_CLIENT_ID` - Salesforce connected app client ID
- `SALESFORCE_CLIENT_SECRET` - Salesforce connected app secret
- `SALESFORCE_INSTANCE_URL` - Salesforce org instance URL
- `NEXT_PUBLIC_BASE_URL` - Base URL for API calls

### Data Structure

The dashboard expects Salesforce data with these key fields:

- `tickTitle`, `tickSubtitle` - Main display titles
- `tickMatrixRowHeader` - Appeal names array
- `tickPledgeCount[US|CA|INTL]collection` - Pledge counts by region
- `tickWebPercent` - Web contribution percentage
- `campHeaders`, `campCount[US|CA|INTL]` - Campaign breakdown data
- `summary[NonWeb|Web][Count|Total]` - Live vs web summary metrics

### Development Notes

- Uses `"use client"` directive for client-side components
- Real-time updates every 5 seconds via SWR
- Responsive design with mobile-first approach
- Number formatting with toLocaleString() for currency and counts
- Pie chart toggles between count and amount views via URL param
