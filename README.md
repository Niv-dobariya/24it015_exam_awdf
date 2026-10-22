# EventHub Ticket Booking System
### CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
**Chandubhai S. Patel Institute of Technology (CSPIT)**  
**Department of Information Technology / Computer Engineering**  
**Course:** ITUE301: Advanced Web Development Frameworks  
**Examination:** Open-Book Practical Examination | AY 2026–27  
**Student Name:** Niv Dobariya  
**Roll Number:** 24it015  
**Batch:** A  
**Allotted Set:** **SET F: EventHub Ticket Booking System**  
**Repository:** [https://github.com/Niv-dobariya/24it015_exam_awdf](https://github.com/Niv-dobariya/24it015_exam_awdf)

---

## 📌 Project Overview
EventHub is a full-stack event ticketing platform designed to transition local event ticketing away from paper coupons and spreadsheets.
- **Attendees** can browse events, search by title, and book tickets online.
- **Organizers** can access the Organizer Panel to publish and manage event listings.
- **Admins** oversee platform entities.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Context API (`AuthContext`), Vite |
| **Backend** | Node.js, Express.js (REST API at `/api/v1/`) |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) with Bearer token authentication |

---

## 📂 Project Structure

```text
itue301-exam-24it015-A/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Login and registration logic
│   │   ├── eventController.js      # Public event listing & organizer event creation
│   │   └── ticketController.js     # Ticket booking, population & status updates
│   ├── middleware/
│   │   ├── authGuard.js            # Custom Bearer token validator (401 on missing/invalid)
│   │   ├── errorHandler.js         # Global JSON error handler (Schema validation & 400/500)
│   │   └── requestLogger.js        # Global logger: [METHOD] [PATH] [TIMESTAMP]
│   ├── models/
│   │   ├── Attendee.js             # Mongoose schema (name, email unique, role enum, password)
│   │   ├── Event.js                # Mongoose schema (title, category, date, venue, ticketsAvailable min 0)
│   │   └── Ticket.js               # Mongoose schema (attendeeId ref, eventId ref, quantity min 1, status enum)
│   ├── routes/
│   │   ├── authRoutes.js           # POST /api/v1/auth/login
│   │   ├── eventRoutes.js          # GET /api/v1/events (public)
│   │   └── ticketRoutes.js         # POST, GET, PATCH /api/v1/tickets (protected)
│   ├── .env.example                # Template environment variables
│   ├── package.json
│   ├── seed.js                     # Sample database seeder
│   └── server.js                   # Express server bootstrap & MongoDB connection
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx       # Task 1: Reusable event card with sold-out condition
│   │   │   ├── Navbar.jsx          # Task 2: Client-side navigation links
│   │   │   └── ProtectedRoute.jsx  # Task 2: Auth guard with role mismatch redirect to /events
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Task 2: Global auth state { attendee, token, role }
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx       # Login view with quick-fill test accounts
│   │   │   ├── EventsPage.jsx      # Task 1, 2, 4: Events listing, client search & booking form
│   │   │   ├── MyTicketsPage.jsx   # Attendee ticket management & status update
│   │   │   └── OrganizerPanel.jsx  # Task 2: Lazy-loaded panel using React.lazy + Suspense
│   │   ├── api.js                  # Centralized API base config
│   │   ├── App.jsx                 # React Router routing configuration
│   │   ├── index.css               # Clean modern UI styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js              # Vite server & reverse proxy (/api -> :5000)
├── 24it015_SetF_Report.md          # Comprehensive examination report & viva defense prep
├── .env.example                    # Root environment template
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Execution Instructions

### 1. Prerequisites
- **Node.js** v18+ or v22+
- **MongoDB** running locally on port `27017` or a MongoDB Atlas URI

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Contents of `.env`:*
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/eventhub
   JWT_SECRET=eventhub-secret-key-charusat-itue301
   ```
4. Seed sample test data (creates Attendees, Events, and initial Tickets):
   ```bash
   npm run seed
   # or: node seed.js
   ```
5. Start the backend server:
   ```bash
   npm start
   # or: node server.js
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🔑 Test User Credentials

The database seeder pre-configures three accounts with password `password123`:

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **Attendee** | `attendee@eventhub.com` | `password123` | `/events`, `/my-tickets` |
| **Organizer** | `organizer@eventhub.com` | `password123` | `/events`, `/my-tickets`, `/organizer` |
| **Admin** | `admin@eventhub.com` | `password123` | Platform oversight |

*(Note: The login page includes 1-click buttons to auto-populate any of these accounts.)*

---

## 📋 Task-by-Task Implementation Summary

### Task 1: React Component Architecture (4 Marks)
- Reusable `EventCard` component placed in `frontend/src/components/EventCard.jsx`.
- Accepts props: `title`, `category`, `date`, `venue`, `ticketsAvailable`.
- Conditional rendering at top of component:
  ```jsx
  const isSoldOut = ticketsAvailable === 0;
  // If ticketsAvailable === 0, renders a "Sold Out" badge instead of "Book" button.
  ```
- Displays all 5 properties and passes click handling via props to parent component.

### Task 2: React Routing and State Management (4 Marks)
- Configured routes in `App.jsx`:
  - `/` -> `LoginPage`
  - `/events` -> `EventsPage` (protected)
  - `/my-tickets` -> `MyTicketsPage` (protected)
  - `/organizer` -> `OrganizerPanel` (lazy-loaded with `React.lazy` + `Suspense`, role `'organizer'` required)
- `Navbar` component using React Router `NavLink` for client-side navigation without full-page reloads.
- `AuthContext` provides `{ attendee, token, role, login, logout }`.
- `ProtectedRoute` logic:
  - If token is missing: redirects to `/` (LoginPage).
  - If role does not match `requiredRole`: redirects to `/events` (without logging the user out).
- Booking form in `EventsPage` manages state via `useState`: `selectedEventId` and `ticketQuantity`.

### Task 3: Express REST API + Middleware (4 Marks)
Implemented endpoints:
1. `POST /api/v1/auth/login` - Authenticates attendee, issues JWT token.
2. `GET /api/v1/events` - Returns all events (public route).
3. `POST /api/v1/tickets` - Books tickets, decrements `ticketsAvailable` on Event document (protected).
4. `GET /api/v1/tickets/my` - Returns attendee's booked tickets with `.populate()` (protected).
5. `PATCH /api/v1/tickets/:id/status` - Updates ticket status to `booked`, `cancelled`, or `used` (protected).
- **Global `requestLogger` middleware**: Logs `[METHOD] [PATH] [TIMESTAMP]` for every request.
- **Custom `authGuard` middleware**: Validates `Authorization: Bearer <token>` and returns `401 Unauthorized` if missing or invalid.
- **Global `errorHandler` middleware**: Registered as the last middleware, returning structured JSON errors instead of raw stack traces.

### Task 4: REST API Consumption in React (4 Marks)
- `EventsPage` retrieves data from `GET /api/v1/events` on mount using `useEffect()`.
- Maintains 3 states: `events`, `loading`, and `error`.
- Displays animated spinner during loading, error message on failure, and dynamic cards upon success.
- Client-side search box filters already-fetched events in memory via `.filter()` without triggering extra network requests.

### Task 5: MongoDB + Mongoose Schema Design and Validation (4 Marks)
- **Attendee Schema**: `name` (required), `email` (required, unique), `role` (enum: attendee, organizer, admin), `password` (required).
- **Event Schema**: `title` (required), `category`, `date` (required), `venue` (required), `ticketsAvailable` (`min: [0, 'ticketsAvailable cannot be negative']`).
- **Ticket Schema**: `attendeeId` (ref: Attendee), `eventId` (ref: Event), `quantity` (`min: [1, 'quantity must be at least 1']`), `bookingDate` (default: Date.now), `status` (enum: booked, cancelled, used, default: booked).
- Ticket booking validates `ticketsAvailable >= quantity` using `findById` before `Ticket.create()`, and decrements count via `findByIdAndUpdate`.
- Returns HTTP 400 with clean JSON error if requested tickets exceed availability.
- `GET /api/v1/tickets/my` populates:
  - `.populate('attendeeId', 'name email')`
  - `.populate('eventId', 'title date venue')`
