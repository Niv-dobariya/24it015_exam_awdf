import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE } from '../api';

const LoginPage = () => {
  const [email, setEmail] = useState('attendee@eventhub.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, token, attendee, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.attendee);
      navigate('/events');
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="page-container">
      <div className="card auth-card">
        <h2>Sign In to EventHub</h2>
        <p className="subtitle">ITUE301 Practical Exam · Set F</p>

        {token && attendee ? (
          <div className="alert alert-info">
            <p>You are currently logged in as <strong>{attendee.name}</strong> ({role}).</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/events')}>
                Go to Events
              </button>
              <button className="btn btn-outline" onClick={logout}>
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleLogin} className="form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. attendee@eventhub.com"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Authenticating...' : 'Login'}
              </button>
            </form>

            <div className="demo-accounts-box">
              <h4>Quick Test Accounts (Click to Fill):</h4>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setDemoCredentials('attendee@eventhub.com', 'attendee')}
                >
                  Attendee Account
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setDemoCredentials('organizer@eventhub.com', 'organizer')}
                >
                  Organizer Account
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setDemoCredentials('admin@eventhub.com', 'admin')}
                >
                  Admin Account
                </button>
              </div>
              <p className="hint-text">Default password: <code>password123</code></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
