# Billing frontend notes

The app treats payment providers as UI adapters only. The backend owns plan, amount, recipient, payment verification, and Pro entitlement writes.

Supported provider identifiers in frontend types:

- `x402`: planned near-term HTTP 402 stablecoin rail.
- `mpp`: planned Machine Payments Protocol / Stripe-Tempo style HTTP 402 flow.

Frontend rules:

- Do not grant, extend, or downgrade plans from the client.
- Do not store provider client secrets in URLs, localStorage, analytics, or logs.
- Keep provider-specific UI behind small isolated helpers once a real provider UI exists.
- If a provider is not available yet, show a quiet unavailable state instead of attempting a broken modal.
