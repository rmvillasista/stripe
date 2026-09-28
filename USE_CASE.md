# Usage Dashboard Use Case

**Branch:** `feature/usage-dashboard`
**Status:** Dashboard prototype implemented with sample data; it is not connected to a Stripe account.

## Goal

Give an account administrator a quick view of Stripe product consumption and estimated billing for a selected period.

## User workflow

1. Choose Live or Test mode and a 7-, 30-, or 90-day date range.
2. Review API requests, webhook deliveries, processed data, and estimated cost.
3. Compare request volume with the included allowance and review product-level usage.
4. Check the next-invoice estimate and export the usage table as CSV.

## Dashboard scope

- Request-volume chart with dates and included-usage progress.
- Product usage rows with quantities, cost estimates, and limit status.
- Responsive layout for desktop and mobile.
- Sample values only. A production version needs authenticated Stripe data, loading and error states, and server-side authorization.