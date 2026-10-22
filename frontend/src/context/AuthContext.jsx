import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [attendee, setAttendee] = useState(() => {
    const saved = localStorage.getItem('eventhub_attendee');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('eventhub_token') || null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('eventhub_role') || null;
  });

  const login = (jwtToken, attendeeData) => {
    setToken(jwtToken);
    setAttendee(attendeeData);
    setRole(attendeeData.role);

    localStorage.setItem('eventhub_token', jwtToken);
    localStorage.setItem('eventhub_attendee', JSON.stringify(attendeeData));
    localStorage.setItem('eventhub_role', attendeeData.role);
  };

  const logout = () => {
    setToken(null);
    setAttendee(null);
    setRole(null);

    localStorage.removeItem('eventhub_token');
    localStorage.removeItem('eventhub_attendee');
    localStorage.removeItem('eventhub_role');
  };

  return (
    <AuthContext.Provider value={{ attendee, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
