"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const RoleContext = createContext();

// 2. Create the Provider Component
export function RoleProvider({ children }) {
  const [userRole, setUserRole] = useState('');

  // Load the role from local storage when the app first loads
  useEffect(() => {
    const savedRole = localStorage.getItem('greenhoop_user_role');
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  // Custom setter that updates both React state and Local Storage
  const setAndSaveRole = (role) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('greenhoop_user_role', role);
    } else {
      localStorage.removeItem('greenhoop_user_role'); // Useful for logout
    }
  };

  return (
    <RoleContext.Provider value={{ userRole, setRole: setAndSaveRole }}>
      {children}
    </RoleContext.Provider>
  );
}

// 3. Create a custom hook for easy access in other components
export const useRole = () => useContext(RoleContext);