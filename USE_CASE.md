# Customer Management Use Case

**Branch:** `feature/customer-management`
**Status:** Planning document; customer-management screens are not implemented yet.

## Goal

Give authorized staff a reliable place to find a Stripe customer and understand their payment and billing history.

## Primary workflow

1. Search or paginate through customers using stable identifiers such as email or Stripe customer ID.
2. Open a customer profile with contact details and relevant billing metadata.
3. Review associated payment methods, payments, invoices, and subscriptions.
4. Make an authorized billing-detail change and confirm the result from Stripe.

## Important scenarios

- Duplicate or incomplete customer records and email changes.
- Customers with no payments, multiple subscriptions, or failed invoices.
- Deleted or unavailable Stripe records and API errors.
- Large customer lists requiring pagination and useful search filters.
- Role-based access to personal and billing information.

## Scope

Use Stripe customer IDs as stable references and retrieve sensitive billing data only when needed. Do not store raw card details or expose customer records across accounts.