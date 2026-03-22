# Khushbu Beauty Parlour

## Current State
Booking form collects name, phone, service, date and submits to the backend canister.

## Requested Changes (Diff)

### Add
- After form validation, open WhatsApp with a pre-filled message containing all booking details (name, phone, service, date) sent to admin number 7693899623.

### Modify
- `BookingSection` handleSubmit: after validation success, open `https://wa.me/917693899623?text=...` with booking details, then also save to backend as before.

### Remove
- Nothing removed.

## Implementation Plan
1. In `BookingSection.handleSubmit`, after validation passes, build a WhatsApp URL with the booking details.
2. Open the WhatsApp URL in a new tab.
3. Continue to call `mutate` to save the booking to backend as well.
