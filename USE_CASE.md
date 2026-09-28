# Webhooks Use Case

**Branch:** `feature/webhooks`
**Status:** Planning document; endpoint processing is not implemented yet.

## Goal

Receive Stripe events reliably so asynchronous payment, subscription, and account changes are reflected in the application.

## Primary workflow

1. Configure an endpoint for only the event types the application needs.
2. Verify each request signature against the raw request body and the endpoint secret.
3. Record the event ID idempotently, enqueue processing, and return a successful response promptly.
4. Apply the event to application state with handlers that tolerate retries and out-of-order delivery.
5. Inspect failed attempts and replay events after correcting the underlying issue.

## Important scenarios

- Invalid signature, malformed payload, and unexpected event type.
- Duplicate delivery, delayed delivery, and events arriving out of order.
- Slow or temporarily unavailable downstream services.
- Retry exhaustion, alerting, and safe manual replay.
- Endpoint-secret rotation and environment-specific configuration.

## Scope

Prioritize signature verification, durable event handling, idempotency, observability, and replay. Never treat an unverified client redirect as proof of a Stripe event.