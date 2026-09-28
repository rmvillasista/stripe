# Subscriptions Use Case

**Branch:** `feature/subscriptions`
**Status:** Planning document; recurring billing is not implemented yet.

## Goal

Create and manage recurring plans while keeping subscription and invoice state synchronized with Stripe.

## Primary workflow

1. A customer selects a plan and reviews the renewal interval and price.
2. The server creates the Stripe Customer and Subscription using configured Price IDs.
3. The customer adds a payment method and completes any required authentication.
4. Verified subscription and invoice webhooks update the application’s access and billing state.
5. The customer can review the current plan, next renewal, invoices, and available plan changes.

## Important scenarios

- Free trials, trial conversion, and trial cancellation.
- Successful renewals, payment failures, retries, and past-due status.
- Plan upgrades or downgrades, with proration explained before confirmation.
- Cancellation at period end and immediate cancellation.
- Duplicate webhook delivery and out-of-order events.

## Scope

Cover plan selection, recurring invoice lifecycle, and customer self-service. Stripe remains authoritative for billing status; application access is updated from verified events.