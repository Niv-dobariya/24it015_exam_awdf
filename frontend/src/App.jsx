import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import MyTicketsPage from './pages/MyTicketsPage';

// Task 2: Lazy-loaded route for OrganizerPanel using React.lazy + Suspense
const OrganizerPanel = lazy(() => import('./pages/OrganizerPanel'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Route: / -> LoginPage */}
              <Route path="/" element={<LoginPage />} />

              {/* Route: /events -> EventsPage (protected) */}
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <EventsPage />
                  </ProtectedRoute>
                }
              />

              {/* Route: /my-tickets -> MyTicketsPage (protected) */}
              <Route
                path="/my-tickets"
                element={
                  <ProtectedRoute>
                    <MyTicketsPage />
                  </ProtectedRoute>
                }
              />

              {/* Route: /organizer -> OrganizerPanel (lazy-loaded, role 'organizer' required) */}
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <Suspense
                      fallback={
                        <div className="loading-state">
                          <div className="spinner"></div>
                          <p>Loading Organizer Panel (Lazy Loaded)...</p>
                        </div>
                      }
                    >
                      <OrganizerPanel />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Fallback to / */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
