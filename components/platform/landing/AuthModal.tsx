"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { X, Eye, EyeOff, UtensilsCrossed } from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authMode,
    closeAuthModal,
    setAuthMode,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Reset form when modal opens or mode changes
  useEffect(() => {
    setErrorMessage("");
    setLoading(false);
    setGoogleLoading(false);
  }, [isAuthModalOpen, authMode]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleGoogleClick = async () => {
    try {
      setGoogleLoading(true);
      setErrorMessage("");
      await signInWithGoogle();
    } catch {
      setErrorMessage("Google Sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (authMode === "signup") {
        if (!name.trim()) {
          setErrorMessage("Please enter your name.");
          setLoading(false);
          return;
        }
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch {
      setErrorMessage("Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Blurred Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card (Always vertically & horizontally centered, max height constrained to viewport) */}
      <div className="relative w-full max-w-[420px] max-h-[calc(100dvh-2rem)] bg-white rounded-2xl border border-neutral-200/90 shadow-2xl text-left z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="shrink-0 px-5 sm:px-6 pt-4 sm:pt-5 pb-3 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white relative shadow-sm">
              <UtensilsCrossed className="w-4 h-4 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-lime-500 border border-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-black">Plato</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-500" />
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-5 sm:px-6 py-4">
          <div className="mb-3">
            <h3 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {authMode === "signin" ? "Welcome back" : "Get started with Plato"}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {authMode === "signin"
                ? "Sign in to manage your registers, kitchen screens, and orders."
                : "Create your restaurant account and start your 14-day free trial."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-xl mb-3">
            <button
              type="button"
              onClick={() => setAuthMode("signin")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === "signin"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === "signup"
                  ? "bg-white text-black shadow-xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Primary Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading || loading}
            className="btn-animate w-full flex items-center justify-center gap-3 px-4 py-2 sm:py-2.5 rounded-xl border border-neutral-300/80 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-xs sm:text-sm shadow-xs transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {authMode === "signin" ? "Sign in with Google" : "Sign up with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2.5 text-neutral-400 font-medium tracking-wider text-[11px]">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {authMode === "signup" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 truncate">
                    Restaurant <span className="text-neutral-400 font-normal text-[10px]">(opt)</span>
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Metro Grill"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@restaurant.com"
                className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Password
                </label>
                {authMode === "signin" && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset instructions will be sent to your email.")}
                    className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-animate-dark w-full mt-1.5 py-2.5 px-4 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{authMode === "signin" ? "Sign In to Plato" : "Create Account"}</span>
              )}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-3.5 text-center text-xs text-neutral-500">
            {authMode === "signin" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="font-bold text-black hover:underline cursor-pointer"
                >
                  Create one free
                </button>
              </p>
            ) : (
              <p>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="font-bold text-black hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
