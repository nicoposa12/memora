# Web Photobooth SaaS — Full Development Prompt

## 1. Project Overview

Build a modern, production-ready **web-based photobooth SaaS platform** where people can use their own phone, tablet, laptop, or desktop camera directly from the browser to take photos.

The main idea is simple:

> **Create an event → Generate a QR code → Guests scan it → Guests use their own camera → Take photos → Customize them → Download or share them.**

The platform should feel fun, modern, fast, and easy to use. It should not feel like a complicated business management system.

The product should support both:

1. **Free users** who can try the basic photobooth experience.
2. **Paid users/event organizers** who can unlock premium templates, customization, branding, storage, and other advanced features.

The goal is to eventually turn this into a real SaaS startup that can be used for weddings, birthdays, graduations, school events, corporate events, parties, and other gatherings.

---

# 2. Product Vision

The platform should eliminate the need for guests to install a mobile application.

Everything should work directly in a modern browser.

Example user journey:

```text
Organizer creates an event
        ↓
Platform generates event QR code
        ↓
Organizer displays QR code
        ↓
Guest scans QR code
        ↓
Photobooth opens in browser
        ↓
Browser requests camera permission
        ↓
Guest takes photo
        ↓
Guest selects frame/template
        ↓
Photo is generated
        ↓
Guest downloads or shares it
        ↓
Photo can optionally appear in event gallery
```

The experience should be fast enough that a guest can go from scanning the QR code to receiving a finished photo within a short amount of time.

---

# 3. Target Users

Design the product around these users:

### Event Organizers

Examples:

* Wedding organizers
* Birthday organizers
* Graduation organizers
* Debut organizers
* School administrators
* Corporate event organizers
* Party planners
* Marketing agencies
* Photobooth businesses

They create and manage events.

### Event Guests

Guests should not need a complicated account.

They should be able to:

* Scan a QR code
* Open the event
* Allow camera access
* Take photos
* Select a template
* Download/share their photo

The guest experience should require as few steps as possible.

### Photobooth Businesses

Later, businesses should be able to manage multiple events and customers from one dashboard.

---

# 4. Recommended Tech Stack

Use the following architecture.

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion where appropriate

Use the Next.js App Router.

Build reusable components and keep the code organized.

## Camera

Use the browser's native:

```text
MediaDevices API
getUserMedia()
```

Do not require users to install a mobile application.

The camera should run directly in the browser.

## Photo Processing

Use:

* HTML Canvas API

For more advanced editing, use:

* Fabric.js or Konva.js

The system should be capable of:

* Cropping
* Resizing
* Positioning
* Adding frames
* Adding overlays
* Adding text
* Adding stickers
* Applying basic filters
* Creating photo strips
* Exporting the final image

## Backend

Use:

* Laravel
* PHP
* Laravel REST API

The backend should handle:

* Authentication
* Users
* Events
* Templates
* Premium plans
* Payments
* Event settings
* Photo metadata
* Gallery management
* Usage limits
* Subscription status

## Database

Use:

* PostgreSQL
* Neon PostgreSQL

Use Laravel Eloquent ORM.

Design the database relationally and avoid unnecessary duplication.

## File Storage

Use:

* Cloudflare R2

Store:

* Uploaded templates
* Event assets
* Generated photos when cloud storage is enabled
* Logos
* Backgrounds
* Other event media

Do not store large image files directly inside PostgreSQL.

Store file metadata and URLs/keys in the database.

## Authentication

Use:

* Laravel Sanctum

Support:

* Email/password authentication
* Session/token authentication appropriate for the frontend architecture
* Logout
* Password reset
* User profile

Guests should be able to use an event without creating an account.

## Payments

Use:

* Xendit

The payment system should be designed so premium features are only unlocked after the backend verifies the payment.

Never trust a frontend-only payment success flag.

Use payment/webhook verification.

## QR Codes

Use a QR code library such as:

```text
qrcode
```

or:

```text
qrcode.react
```

Each event should have a unique public URL.

Example:

```text
https://yourdomain.com/e/juan-maria-wedding
```

Generate a QR code pointing to that URL.

## Deployment

Frontend:

* Vercel

Backend:

* Render or another Laravel-compatible hosting platform

Database:

* Neon

Storage:

* Cloudflare R2

DNS/CDN:

* Cloudflare

---

# 5. Brand Direction

Create a modern startup-style visual identity.

The design should feel:

* Fun
* Premium
* Friendly
* Modern
* Clean
* Photographic
* Social-media friendly

Avoid making it look like an old-fashioned physical photobooth website.

The UI should be visually appealing enough that users immediately understand:

> "This is where I take and customize event photos."

Use:

* Large typography
* Rounded cards
* Subtle gradients
* Smooth animations
* Clean spacing
* Strong visual hierarchy
* High-quality placeholder photography where appropriate

Do not overload the interface with unnecessary animations.

Animations should improve the experience rather than distract from it.

---

# 6. Main Public Website

Create a landing page.

Sections:

## Hero

Example messaging:

> Create memories.
> One photo at a time.

Supporting text:

> A browser-based photobooth for weddings, parties, graduations, and events. No app required.

Buttons:

```text
Create an Event
Try the Photobooth
```

Include a visual demonstration of the photobooth experience.

---

## How It Works

Show three or four steps:

```text
1. Create Your Event
2. Share Your QR Code
3. Guests Take Photos
4. Everyone Gets Their Memories
```

---

## Features

Show:

* Browser-based camera
* Custom frames
* Photo filters
* Event galleries
* QR sharing
* Digital downloads
* Custom branding
* Premium templates

---

## Use Cases

Cards for:

* Weddings
* Birthdays
* Graduations
* School Events
* Corporate Events
* Parties

---

## Pricing

Create a pricing section.

For now, use configurable pricing rather than hardcoding business logic.

Example:

### Free

* Basic templates
* Limited photos
* Basic filters
* Watermarked downloads

### Event Premium

* More photos
* Premium templates
* No watermark
* Custom branding
* HD downloads
* Event gallery

### Business

* Multiple events
* Custom branding
* Analytics
* Advanced event management
* Multiple event templates

Prices should be editable later through the admin system.

---

# 7. Authentication

Create:

```text
/login
/register
/forgot-password
```

After login:

```text
/dashboard
```

Registration should request only necessary information.

Suggested fields:

* Name
* Email
* Password
* Password confirmation

Do not ask for unnecessary personal information.

---

# 8. Organizer Dashboard

Create a clean dashboard.

Example:

```text
Dashboard

Welcome back, Nico!

[ Create Event ]

Active Events
Completed Events
Photos Taken
Photos Downloaded
```

Show recent events.

Each event card should display:

* Event name
* Date
* Status
* Number of photos
* Number of guests/photos
* QR code button
* Manage button

---

# 9. Event Creation

Create an event wizard.

### Step 1 — Basic Information

Fields:

* Event name
* Event type
* Event date
* Description
* Location (optional)

Event types:

* Wedding
* Birthday
* Graduation
* Corporate
* School
* Party
* Other

### Step 2 — Branding

Allow:

* Logo upload
* Primary color
* Secondary color
* Event cover image
* Custom text

### Step 3 — Photobooth Settings

Options:

* Maximum photos per guest
* Countdown duration
* Enable flash effect
* Enable filters
* Enable stickers
* Enable gallery
* Enable downloads
* Enable sharing
* Watermark

### Step 4 — Template

Choose:

* Single photo
* Photo strip
* Polaroid
* Landscape
* Portrait
* Custom frame

### Step 5 — Publish

Show:

```text
Event Created Successfully!

[ Open Photobooth ]
[ View QR Code ]
[ Manage Event ]
```

---

# 10. Event QR Code

Every event gets a unique QR code.

Display:

```text
Your Event Is Ready!

[ QR CODE ]

Scan to Open Photobooth

Event URL:
yourdomain.com/e/juan-maria-wedding

[ Download QR ]
[ Print QR ]
[ Copy Link ]
```

Allow the organizer to download the QR code as PNG.

---

# 11. Guest Photobooth

This is the most important part of the product.

Route:

```text
/e/[eventSlug]
```

The interface should be optimized for mobile devices.

Do not show unnecessary dashboard elements.

Display:

```text
JUAN & MARIA
Wedding 2026

[ Camera Preview ]

[ Take Photo ]
```

---

# 12. Camera Permission

When the user opens the photobooth:

Explain why camera access is required.

Example:

> We need access to your camera so you can take your event photo.

Button:

```text
Enable Camera
```

Then request browser camera permission.

Handle:

* Permission granted
* Permission denied
* Camera unavailable
* No camera detected
* Camera already in use
* Unsupported browser

Show friendly error messages.

Do not expose raw technical errors to guests.

---

# 13. Camera Controls

Provide:

* Front/rear camera switching on supported devices
* Countdown
* Capture button
* Retake
* Preview
* Confirm

Countdown:

```text
3
2
1
📸
```

Allow configurable countdown:

* 0 seconds
* 3 seconds
* 5 seconds
* 10 seconds

---

# 14. Photo Editor

After capturing a photo, show an editor.

Tools:

### Frames

Examples:

* Wedding
* Birthday
* Graduation
* Christmas
* Corporate
* Minimal
* Polaroid

### Filters

Examples:

* Original
* Warm
* Cool
* Vintage
* Black & White
* Bright
* Contrast

### Text

Allow:

* Event name
* Custom message
* Date
* Short caption

### Stickers

Provide a small collection.

Examples:

* Hearts
* Stars
* Confetti
* Balloons
* Graduation cap
* Wedding rings

### Layouts

Support:

* Single photo
* 2-photo strip
* 3-photo strip
* 4-photo strip
* 2x2 grid

---

# 15. Free vs Premium Features

Create a centralized feature-access system.

Do not scatter checks throughout the frontend.

Example:

```text
Feature:
premium_template

User/Event Plan:
free

Access:
false
```

The backend must determine whether the event/user has access.

## Free Features

Example:

* Basic camera
* Basic filters
* Basic templates
* Limited photos
* Watermarked export

## Premium Features

Example:

* Premium templates
* No watermark
* HD export
* Custom branding
* Unlimited/expanded photo limit
* Advanced layouts
* Cloud gallery
* Custom event styling
* AI features when implemented

If a user tries to use a premium feature:

Show:

> Unlock this feature

Then display the relevant plan/payment option.

---

# 16. Payment Flow

Example:

```text
User selects Premium
        ↓
Frontend requests checkout
        ↓
Laravel creates payment request
        ↓
Xendit checkout
        ↓
User completes payment
        ↓
Xendit webhook
        ↓
Laravel verifies payment
        ↓
Database updated
        ↓
Premium feature unlocked
```

Important:

Never unlock premium features based only on:

```text
paymentSuccess = true
```

The backend must verify the payment.

Store transaction information such as:

* Payment ID
* User ID
* Event ID
* Plan ID
* Amount
* Currency
* Status
* Provider
* Created date
* Completed date

---

# 17. Photo Gallery

Each event can have a gallery.

Example:

```text
Juan & Maria
Wedding 2026

842 Photos

[ Photo ] [ Photo ] [ Photo ]
[ Photo ] [ Photo ] [ Photo ]
[ Photo ] [ Photo ] [ Photo ]
```

Allow the organizer to:

* View photos
* Download photos
* Delete photos
* Hide photos
* Share gallery
* Copy gallery link

Guests can optionally access a public gallery if the organizer enables it.

---

# 18. Live Gallery

If enabled, newly generated photos can appear in the event gallery in near real time.

Example:

```text
📸 New photo added!

[Photo]

[Photo]
[Photo]
[Photo]
```

Use Laravel Reverb/WebSockets if realtime functionality is implemented.

Do not make realtime functionality a requirement for the first MVP if it significantly increases complexity.

---

# 19. Admin Panel

Create an admin area.

Admin can manage:

* Users
* Events
* Plans
* Payments
* Templates
* Photos
* Reports
* System settings

Dashboard statistics:

```text
Total Users
Total Events
Photos Generated
Premium Events
Revenue
Storage Usage
```

---

# 20. Template Management

Create a template system rather than hardcoding frames.

A template can contain:

```text
name
type
category
thumbnail
background
overlay
text positions
photo positions
premium flag
active status
```

Example template:

```json
{
  "name": "Elegant Wedding",
  "category": "wedding",
  "premium": true
}
```

The editor should load template configuration dynamically.

This allows new templates to be added without changing the core photobooth code.

---

# 21. Database Structure

Create a normalized PostgreSQL schema.

Suggested tables:

```text
users
events
event_settings
event_members
plans
subscriptions
payments
templates
template_assets
event_templates
photos
photo_sessions
galleries
gallery_photos
media
usage_records
```

Adjust the schema when necessary.

Use foreign keys and appropriate indexes.

Important indexes should exist for:

* event slug
* user ID
* event ID
* payment ID
* subscription status
* created timestamps

---

# 22. Storage Architecture

Use Cloudflare R2 for large files.

Example:

```text
R2
├── templates/
├── events/
│   ├── event-id/
│   │   ├── logos/
│   │   ├── backgrounds/
│   │   └── photos/
```

Do not expose private storage credentials to the frontend.

Use secure upload/download mechanisms.

Where appropriate, use signed URLs.

---

# 23. Security

Implement:

* Authentication
* Authorization
* CSRF protection where applicable
* API validation
* Rate limiting
* File type validation
* File size limits
* Secure upload handling
* Payment webhook verification
* Event ownership checks
* Admin authorization
* Sanitization
* Secure environment variables

Never expose:

```text
DATABASE_URL
XENDIT_SECRET_KEY
R2_SECRET_ACCESS_KEY
Laravel APP_KEY
```

to the frontend.

---

# 24. Privacy

Photos can contain personal images, so treat them as private user content.

Provide:

* Delete photo
* Delete event
* Gallery visibility setting
* Optional public gallery
* Privacy notice
* Data retention settings where appropriate

Do not make every uploaded photo publicly accessible by default.

---

# 25. Mobile-First Design

The guest photobooth should be designed primarily for mobile.

Test:

* Android Chrome
* iPhone Safari
* Desktop Chrome
* Desktop Edge

The camera experience should work well in portrait mode.

Avoid tiny buttons.

The main capture button should be easy to tap.

---

# 26. Performance

The photobooth must feel fast.

Important goals:

* Compress images before uploading when appropriate
* Avoid unnecessarily uploading raw camera frames
* Process basic effects locally
* Lazy-load templates
* Optimize thumbnails
* Use WebP/AVIF where appropriate
* Avoid huge JavaScript bundles
* Use CDN delivery for static assets
* Avoid blocking the camera experience with unnecessary API calls

Basic photo processing should happen in the browser whenever possible.

---

# 27. Offline / Poor Internet Consideration

The guest experience should be resilient to unstable internet.

For the MVP:

* Camera capture should work locally in the browser.
* Photo editing should happen locally.
* Do not require an API request just to capture a photo.
* Queue photo uploads when appropriate.
* Show upload status clearly.

Possible future enhancement:

```text
Camera
 ↓
Local browser storage
 ↓
Upload queue
 ↓
Cloud storage
```

This can allow the photobooth to continue working temporarily during unstable connectivity.

---

# 28. Error Handling

Create friendly error states.

Examples:

### Camera denied

> Camera access was blocked. Please allow camera access in your browser settings and try again.

### No camera

> We couldn't find a camera on this device.

### Upload failed

> Your photo is safe on this device. We'll try uploading it again.

### Premium feature

> This template is part of Premium. Unlock it to use it in your event.

### Event expired

> This event is no longer accepting photos.

### Event not found

> We couldn't find this event. Please check your QR code or event link.

---

# 29. API Structure

Create clean REST endpoints.

Example:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/user

GET    /api/events
POST   /api/events
GET    /api/events/{event}
PUT    /api/events/{event}
DELETE /api/events/{event}

GET    /api/events/{event}/settings
PUT    /api/events/{event}/settings

GET    /api/events/{event}/templates

POST   /api/events/{event}/photos
GET    /api/events/{event}/photos

DELETE /api/photos/{photo}

GET    /api/plans
POST   /api/payments/checkout
POST   /api/payments/webhook

GET    /api/events/{event}/gallery
```

Adjust endpoints as the implementation evolves.

---

# 30. Project Structure

Keep the project maintainable.

Frontend example:

```text
app/
components/
features/
lib/
hooks/
services/
types/
public/
```

Organize components by feature rather than creating one huge components folder.

Example:

```text
features/
├── camera/
├── editor/
├── templates/
├── events/
├── gallery/
├── payments/
└── dashboard/
```

Backend:

```text
app/
├── Models/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Services/
├── Policies/
├── Jobs/
└── Notifications/
```

Use service classes for complex business logic.

Do not put everything inside controllers.

---

# 31. Development Rules

Follow these rules throughout development:

1. Do not create fake testimonials.
2. Do not create fake customers.
3. Do not create fake payment records.
4. Do not invent analytics data.
5. Do not hardcode production secrets.
6. Do not expose API keys.
7. Do not use placeholder business logic as if it were production functionality.
8. Use environment variables for secrets.
9. Validate all user input.
10. Keep components reusable.
11. Keep API logic separated from UI logic.
12. Keep database queries efficient.
13. Write clear TypeScript types.
14. Avoid unnecessary dependencies.
15. Do not build features that are not needed for the MVP.
16. Do not remove working functionality without a clear reason.
17. Do not replace the existing architecture without first explaining why.
18. When something is uncertain, inspect the existing project before making assumptions.

---

# 32. MVP Development Order

Build the project incrementally.

### Phase 1 — Foundation

* Project setup
* Next.js
* TypeScript
* Tailwind
* shadcn/ui
* Laravel API
* PostgreSQL
* Authentication
* Environment configuration

### Phase 2 — Event System

* Create event
* Edit event
* Delete event
* Event settings
* Event slug
* QR generation

### Phase 3 — Photobooth

* Camera permission
* Camera preview
* Front/rear camera
* Countdown
* Capture
* Retake
* Confirm

### Phase 4 — Photo Editor

* Frames
* Filters
* Text
* Stickers
* Layouts
* Canvas rendering
* Download

### Phase 5 — Storage

* Cloudflare R2
* Photo upload
* Thumbnail generation
* Gallery

### Phase 6 — Premium

* Plans
* Feature gating
* Xendit payment
* Webhooks
* Premium activation

### Phase 7 — Dashboard

* Event management
* Gallery
* Statistics
* QR management
* Settings

### Phase 8 — Polish

* Mobile optimization
* Error handling
* Loading states
* Empty states
* Animations
* Accessibility
* Performance optimization

### Phase 9 — Production

* Production environment variables
* Database migrations
* Storage configuration
* Payment configuration
* Domain
* HTTPS
* Monitoring
* Backups

---

# 33. Future Features

Do not implement these unless the MVP is already stable.

Potential future features:

### AI Photo Effects

* Background removal
* AI background replacement
* Cartoon effects
* AI enhancement
* Style transfer

### Social Features

* Share to social media
* Event hashtags
* Social sharing links

### Advanced Event Features

* Guest names
* Guestbook
* Reactions
* Photo voting
* Slideshow mode
* TV/projector mode

### Business Features

* Multiple staff accounts
* White-label platform
* Custom domains
* Client management
* Invoicing
* Advanced analytics

### Physical Photobooth Integration

Eventually support:

* External webcams
* DSLR cameras
* Touchscreen kiosks
* Thermal printers
* Dedicated photobooth machines

---

# 34. Important Product Principle

The platform should always prioritize the guest's experience.

A guest should be able to:

```text
Scan QR
   ↓
Camera
   ↓
Take Photo
   ↓
Choose Design
   ↓
Download
```

without being forced to:

* Register
* Install an app
* Enter unnecessary information
* Create a complicated account
* Navigate through a dashboard

The organizer gets the powerful dashboard.

The guest gets a simple photobooth.

---

# 35. Final Goal

Build this as a real SaaS product, not merely a demo.

The finished application should feel like a product that could actually be presented to:

* Event organizers
* Photobooth businesses
* Wedding planners
* Schools
* Corporate clients

The system should be:

* Fast
* Mobile-first
* Secure
* Maintainable
* Scalable
* Easy to use
* Visually polished
* Ready for future monetization

Start with the MVP and build it incrementally.

Before implementing a major feature, inspect the existing codebase and understand the current architecture. Reuse existing components and services where appropriate instead of duplicating code.

If a feature requires a third-party service, keep its credentials and configuration in environment variables and document the required setup.

Do not pretend that a feature is complete if it is only a mockup. Clearly separate UI prototypes from production functionality.

The final result should be a clean, professional **Web Photobooth SaaS platform where event organizers create events and guests can instantly take and customize photos using their own device cameras through a QR code.**
