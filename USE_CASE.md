# Payments Use Case

**Branch:** `feature/payments`
**Status:** Planning document; payment flows are not implemented yet.

## Goal

Accept and track one-time customer payments through Stripe while keeping sensitive payment data out of the application server.

## Primary workflow

1. The server creates a PaymentIntent for a validated order amount and currency.
2. The client collects payment details with Stripe.js and confirms the payment.
3. The application reports the result to the customer and shows the current payment state.
4. A verified Stripe webhook updates the order record as the authoritative payment outcome.

## Important scenarios

- Successful payment and receipt confirmation.
- Additional authentication, such as 3D Secure, followed by success or cancellation.
- Declined payment with a clear retry path that does not create duplicate charges.
- Idempotent payment creation and safe handling of repeated webhook events.
- Payment lookup, refund initiation, and refund status tracking.

## Scope

Focus on the payment lifecycle and its server-side state transitions. Checkout page layout and subscription billing are documented on their own feature branches.