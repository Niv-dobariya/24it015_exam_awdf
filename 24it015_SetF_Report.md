# ITUE301: Advanced Web Development Frameworks
## Practical Examination Report · AY 2026–27
**Set:** SET F — EventHub Ticket Booking System  
**Institution:** Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Department:** Information Technology / Computer Engineering  
**Student Name:** Niv Dobariya  
**Roll Number:** 24it015  
**Batch:** A  
**GitHub Repository:** [https://github.com/Niv-dobariya/24it015_exam_awdf](https://github.com/Niv-dobariya/24it015_exam_awdf)  

---

## 1. Executive Summary & Architecture Overview

EventHub is a full-stack event ticketing platform developed using the MERN stack (MongoDB, Express.js, React, Node.js) with Mongoose ODM. It streamlines local event ticketing by allowing attendees to browse and book tickets online, organizers to manage and publish event listings, and administrators to oversee system entities.

### Architecture
- **Frontend:** React 18 with Vite, React Router v6, Context API (`AuthContext`), and responsive CSS.
- **Backend:** Express.js REST API exposed at `/api/v1/` with global `requestLogger`, custom `authGuard` JWT middleware, and global structured JSON `errorHandler`.
- **Database:** MongoDB with Mongoose ODM implementing schema-level validations, references, and population.

---

## 2. Detailed Task Implementation

### Task 1: React Component Architecture (4 Marks)
- **Component File:** `frontend/src/components/EventCard.jsx`
- **Props Accepted:** `title`, `category`, `date`, `venue`, `ticketsAvailable`, `onSelect`.
- **Conditional Rendering:** If `ticketsAvailable === 0`, renders a "Sold Out" badge instead of a "Book" button.
- **Pages Created:** `LoginPage.jsx`, `EventsPage.jsx`, `MyTicketsPage.jsx`, and `OrganizerPanel.jsx`.

### Task 2: React Routing and State Management (4 Marks)
- **Routes Configured (`frontend/src/App.jsx`):**
  - `/` -> `LoginPage`
  - `/events` -> `EventsPage` (protected)
  - `/my-tickets` -> `MyTicketsPage` (protected)
  - `/organizer` -> `OrganizerPanel` (lazy-loaded with `React.lazy()` + `Suspense`, role `'organizer'` required)
- **Navigation Component:** `Navbar.jsx` with React Router `NavLink` preventing full-page reload.
- **Global Auth State:** `AuthContext.jsx` holding `{ attendee, token, role, login, logout }`.
- **Differentiated Protected Route Redirection (`ProtectedRoute.jsx`):**
  - Missing token -> Redirects to `/` (LoginPage).
  - Role mismatch (e.g., non-organizer visiting `/organizer`) -> Redirects to `/events` (keeps user logged in).
- **Booking Form State:** `EventsPage.jsx` manages `selectedEventId` and `ticketQuantity` with `useState`.

### Task 3: Express REST API + Middleware (4 Marks)
- **Endpoints Implemented:**
  1. `POST /api/v1/auth/login` — Authenticates credentials, generates JWT containing `{ id, name, email, role }`.
  2. `GET /api/v1/events` — Public listing of events sorted by date.
  3. `POST /api/v1/tickets` — Protected booking route: validates availability, creates Ticket, decrements `ticketsAvailable` on Event.
  4. `GET /api/v1/tickets/my` — Protected route returning attendee's own tickets with `.populate()`.
  5. `PATCH /api/v1/tickets/:id/status` — Updates ticket status (`booked`, `cancelled`, `used`).
- **Middleware:**
  - `requestLogger.js`: Global logging: `[METHOD] [PATH] [TIMESTAMP]`.
  - `authGuard.js`: Verifies `Bearer` token from `Authorization` header, returns HTTP 401 on missing/invalid token.
  - `errorHandler.js`: Catches errors globally, formats Mongoose `ValidationError` and duplicate key errors into structured JSON.

### Task 4: REST API Consumption in React (4 Marks)
- **Endpoint:** `GET /api/v1/events` called on component mount using `useEffect()`.
- **States Maintained:** `events`, `loading`, and `error`.
- **UI Feedback:** Displays loading spinner during fetch, error message on network failure, and dynamic cards upon success.
- **Client-Side Filtering:** Instant search filter by title using `.filter()` on render without extra network requests.

### Task 5: MongoDB + Mongoose Schema Design and Validation (4 Marks)
- **Models Implemented:**
  - `Attendee`: `name` (required), `email` (required, unique), `role` (enum: attendee, organizer, admin), `password`.
  - `Event`: `title` (required), `category`, `date` (required), `venue` (required), `ticketsAvailable` (`min: [0, 'ticketsAvailable cannot be negative']`).
  - `Ticket`: `attendeeId` (ref: Attendee), `eventId` (ref: Event), `quantity` (`min: [1, 'quantity must be at least 1']`), `status` (enum: booked, cancelled, used).
- **Population:**
  ```javascript
  const tickets = await Ticket.find({ attendeeId })
    .populate('attendeeId', 'name email')
    .populate('eventId', 'title date venue');
  ```
- **Validation Failure Demonstration:**
  Requesting `quantity > ticketsAvailable` returns HTTP 400 with:
  ```json
  {
    "success": false,
    "message": "Validation Error: Not enough tickets available. Requested: 999, Available: 147"
  }
  ```

---

## 3. Viva Preparation & Answers

**Q1: How does the `authGuard` middleware protect endpoints?**  
*Answer:* `authGuard` checks the `Authorization` header for `Bearer <token>`. It verifies the token using `jwt.verify(token, JWT_SECRET)`. If valid, it attaches decoded user information to `req.user` and calls `next()`. If missing or invalid, it halts execution and returns HTTP 401.

**Q2: Why is `OrganizerPanel` loaded with `React.lazy()`?**  
*Answer:* `React.lazy(() => import('./pages/OrganizerPanel'))` splits the Organizer Panel code into a separate chunk. Attendees never download this bundle, reducing initial load time. `Suspense` displays a fallback spinner while the chunk is fetched.

**Q3: How does the booking endpoint prevent negative ticket counts?**  
*Answer:* The controller verifies `ticketsAvailable >= quantity` using `Event.findById` before creating the ticket, and updates the count using `Event.findByIdAndUpdate(eventId, { $inc: { ticketsAvailable: -quantity } })`. The Mongoose schema also enforces `min: [0, 'ticketsAvailable cannot be negative']`.

---

## 4. Submission Artifacts

1. **GitHub Repository:** [https://github.com/Niv-dobariya/24it015_exam_awdf](https://github.com/Niv-dobariya/24it015_exam_awdf)
2. **Final Commit SHA:** `86f8d32811bbc8ad2854828800c1e212b12601a0`
3. **Report PDF:** `24it015_SetF_Report.pdf`
