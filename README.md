# StaticWebApp_PlugEventsTools

A static web app hosting tools and utilities for [Plug.Events](https://plug.events), deployed as an Azure Static Web App. All pages are plain HTML/CSS/JS with no build step required.

## Pages

### `index.html` — Menu
The landing page. It auto-discovers available tools by reading `tools/manifest.json` and renders a button for each one. Falls back to a directory listing or a hardcoded list if the manifest is unavailable.

### `tools/CalendarExport.html` — Calendar Export
Export events for a given Plug.Events umbrella as **JSON** or **CSV**. Users enter an umbrella name and a date range; the tool fetches matching events from the backend API and offers the result as a download. Useful for importing events into calendars or spreadsheets.

### `tools/Notifications.html` — Event Notifications
Subscribe to a recurring email digest of upcoming events. Users configure:
- **Umbrella** — filters which events are included (only events linked to this umbrella).
- **Every (weeks) + Send on** — together set the schedule. For example, choosing 2 weeks and Wednesday sends an email every 2 weeks on Wednesday, listing all events in that 2-week window.
- **Location** (optional) — a town or address used to add driving distances to each event in the email. Does not filter events by location; any nearby place works just as well as an exact address.

Subscription and unsubscribe calls are handled via Azure Logic Apps (endpoints configured in `scripts/config.js`).

### `pages/unsubscribe.html` — Unsubscribe
Handles unsubscribe links included in every notification email. Reads a token from the URL, calls the unsubscribe endpoint, and confirms removal of all stored data.

## Project structure

```
index.html                  # Menu / tool launcher
pages/
  unsubscribe.html          # Unsubscribe landing page (linked from emails)
scripts/
  config.js                 # API endpoint configuration (backend + Logic App URLs)
  footer.js                 # Shared footer component
  umbrella-validate.js      # Validates umbrella names against the backend API
styles/
  site.css                  # Shared stylesheet (loaded async; critical CSS is inlined per page)
tools/
  CalendarExport.html       # Export umbrella events as JSON or CSV
  Notifications.html        # Subscribe to periodic event notification emails
  manifest.json             # List of tools for the index page to discover
```

## Backend

The tools rely on a backend API at `plugeventsbackend.balfolkworkshop.com` for event data and umbrella validation. Subscribe/unsubscribe actions call Azure Logic App HTTP triggers. Endpoint URLs are centralised in `scripts/config.js`.

## Deployment

The app has no build step — static files are served directly. Deploy to Azure Static Web Apps via the standard GitHub Actions workflow or `az staticwebapp` CLI.

```bash
npm run build   # no-op, confirms there is nothing to compile
```

