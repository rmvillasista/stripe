# Checkout Use Case

**Branch:** `feature/checkout`
**Status:** Planning document; the checkout flow is not implemented yet.

## Goal

Let a customer complete a purchase through a clear, secure Stripe Checkout journey from cart review to order confirmation.

## Primary workflow

1. The server validates the cart and creates a Checkout Session using trusted product prices.
2. The customer reviews the order and enters payment and billing details on the hosted or embedded checkout.
3. Stripe confirms the payment and returns the customer to the appropriate success or cancel page.
4. A verified webhook confirms fulfillment; the return-page redirect alone does not mark an order paid.

## Important scenarios

- Successful payment, declined payment, and abandoned or expired sessions.
- Clear display of totals, currency, taxes, shipping, and required customer details.
- Safe retries without duplicate orders or charges.
- Mobile-friendly form behavior and accessible validation messages.

## Scope

Focus on the customer purchase journey and Checkout Session lifecycle. Product pricing and order fulfillment remain server-authoritative; raw card details are never stored by the application.