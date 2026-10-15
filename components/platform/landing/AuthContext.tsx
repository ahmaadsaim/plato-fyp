"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  name: string;
  email: string;
  picture?: string;
  provider: "google" | "email";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: "signin" | "signup";
  toastMessage: string | null;
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: "signin" | "signup") => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Restore stored session and check for Google OAuth hash callback
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      return;
    }
    try {
      const stored = localStorage.getItem("plato_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Local storage unavailable or failed
    }

    // Check for Google OAuth Implicit Token in URL Hash
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");

      if (accessToken) {
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch Google profile");
            return res.json();
          })
          .then((profile) => {
            const googleUser: User = {
              name: profile.name || profile.given_name || "Google User",
              email: profile.email || "user@gmail.com",
              picture: profile.picture,
              provider: "google",
            };
            setUser(googleUser);
            localStorage.setItem("plato_user", JSON.stringify(googleUser));
            showToast(`Signed in as ${googleUser.name} with Google`);
            // Clean hash from address bar
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.search
            );
          })
          .catch((err) => {
            console.error("Google Auth error:", err);
            showToast("Failed to complete Google Sign In");
          });
      }
    }
  }, []);

  const openSignIn = () => {
    setAuthMode("signin");
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithGoogle = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (clientId && clientId.trim() !== "") {
      // Real Google OAuth 2.0 Web Client Flow
      const redirectUri = window.location.origin;
      const scope = encodeURIComponent("openid email profile");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=${scope}&prompt=select_account`;
      window.location.href = authUrl;
    } else {
      // Interactive Google Sign-In Simulation
      // Emulates instant Google account connection
      const demoUser: User = {
        name: "Alex Rivera",
        email: "alex.rivera@gmail.com",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        provider: "google",
      };
      setUser(demoUser);
      localStorage.setItem("plato_user", JSON.stringify(demoUser));
      closeAuthModal();
      showToast("Signed in with Google as Alex Rivera");
    }
  };

  const signInWithEmail = async (email: string): Promise<boolean> => {
    if (!email || !email.includes("@")) return false;
    const name = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const emailUser: User = {
      name: formattedName || "Restaurant Owner",
      email,
      provider: "email",
    };
    setUser(emailUser);
    localStorage.setItem("plato_user", JSON.stringify(emailUser));
    closeAuthModal();
    showToast(`Welcome back, ${emailUser.name}!`);
    return true;
  };

  const signUpWithEmail = async (name: string, email: string): Promise<boolean> => {
    if (!email || !name) return false;
    const newUser: User = {
      name: name.trim(),
      email: email.trim(),
      provider: "email",
    };
    setUser(newUser);
    localStorage.setItem("plato_user", JSON.stringify(newUser));
    closeAuthModal();
    showToast(`Account created for ${newUser.name}!`);
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("plato_user");
    showToast("Signed out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        toastMessage,
        openSignIn,
        openSignUp,
        closeAuthModal,
        setAuthMode,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-2xl border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
