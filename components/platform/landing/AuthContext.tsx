"use client";

import React, { createContext, useContext } from "react";

export interface LandingUser {
  name: string;
  email: string;
  provider: "google" | "email";
}

const AuthContext = createContext<LandingUser | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: LandingUser | null;
}) {
  return (
    <AuthContext.Provider value={initialUser}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const user = useContext(AuthContext);
  return { user, isAuthenticated: Boolean(user) };
}
