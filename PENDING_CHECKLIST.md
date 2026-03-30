# RedBox Admin Pending Checklist

Last updated: 2026-03-26

## Done

- [x] Featured dishes GET integration added to the website home page specialties section.
- [x] Homepage CMS GET integration added for:
  - [x] Home Page Manager sections
  - [x] Banners
  - [x] Testimonials
- [x] Gallery Manager removed from the admin sidebar.
- [x] Franchise list `401` likely fixed by aligning admin token handling to `authToken`.
- [x] Settings/account route mismatches fixed for:
  - [x] Roles
  - [x] Permissions
  - [x] SEO Settings
  - [x] Website Settings method usage
- [x] Missing backend detail GET routes added for:
  - [x] Users
  - [x] Roles
  - [x] Permissions
  - [x] SEO pages
- [x] Delivery platform backend create fixed to use the correct serializer.
- [x] Delivery platform backend detail/update/delete routes added.
- [x] Branch detail backend prefetch bug fixed.
- [x] Branch admin API client updated to send `FormData` correctly for create/update.
- [x] Branch delivery-link submit flow changed from Dunzo to WhatsApp in admin payload logic.

## Fixed But Unverified

- [ ] Branch create API `400` is fixed in code, but still needs live admin testing.
- [ ] Branch single view API needs live admin testing.
- [ ] Branch edit/update API needs live admin testing.
- [ ] Delivery Platforms admin flow needs live testing:
  - [ ] list
  - [ ] create
  - [ ] detail
  - [ ] update
  - [ ] delete
- [ ] Franchise list API needs live admin testing to confirm the `401` is gone.
- [ ] Website Settings page needs live testing.
- [ ] SEO Settings page needs live testing.
- [ ] Users page needs live testing.
- [ ] Roles page needs live testing.
- [ ] Permissions page needs live testing.

## Still Open

- [ ] Branch Facilities module needs verification and fixes if needed.
- [ ] Branch Reviews module needs verification and fixes if needed.
- [ ] Event Catering needs end-to-end verification so website submissions show in admin.
- [ ] Remaining legacy Dunzo UI text in admin should be cleaned up fully.
- [ ] Full admin runtime pass is still pending after the recent API fixes.
