# Khushbu Beauty Parlour - Admin Panel

## Current State
A full beauty parlor website with hero, services grid, bridal packages, booking form, about/testimonials, and footer. Backend has bookAppointment, getAllBookings, getBookingsByCustomerName APIs. No admin area exists.

## Requested Changes (Diff)

### Add
- `/admin` route: Admin login page with username/password form (hardcoded credentials: admin/khushbu123)
- Admin dashboard page (only visible after login)
- Dashboard shows: total bookings count, recent bookings list
- Services management section in dashboard: list all services with name, Hindi name, description, icon fields — editable inline, save to localStorage
- Logout button in admin header

### Modify
- App.tsx: Add routing so `/admin` shows admin panel, root `/` shows existing website

### Remove
- Nothing removed from existing website

## Implementation Plan
1. Add React Router (already in project or use hash-based routing with useState)
2. Create AdminLogin component with form validation
3. Create AdminDashboard component with:
   - Stats cards (total bookings, services count)
   - Recent bookings table from getAllBookings API
   - Services editor: list of services with editable fields, save button
4. Store admin session in sessionStorage, services edits in localStorage
5. Wire routing in App.tsx: show admin panel when path is /admin
