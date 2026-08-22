# BuddyDrop Driver App

React Native driver app built with Expo and TypeScript.

## Run locally

```bash
npm install
npm start
```

Then press `a` for Android, `i` for iOS on macOS, or `w` for Expo web.

## Current slice

The initial dashboard includes:

- Online/offline availability toggle
- Today's earnings, rating, and online time
- Active delivery route with pickup and drop-off
- Delivery progress through pickup, delivery, and completion
- Delivery details and job acceptance flow
- Earnings summary and driver profile sheets
- Upcoming jobs list with an empty state
- Meetings page with calendar filters and join-only access
- BuddyBot support chat
- Withdrawal requests for the full balance or a custom amount

The dashboard currently uses local mock data while driver API endpoints are finalized. The customer frontend uses the shared backend through `http://localhost:4400/api`.
