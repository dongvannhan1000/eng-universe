// src/components/ProtectedRoute.tsx
"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { Button } from "@/components/ui/button";
import { openAuthDialog } from "@/features/auth/slices/authDialogSlice";

/**
 * Soft-gate ProtectedRoute:
 * - isLoading: show skeleton
 * - isAuthenticated: render children
 * - not authenticated: show 401 UX + CTA to open AuthDialog
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((s: RootState) => s.auth);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md space-y-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          <div className="h-48 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11a2 2 0 012 2v3a2 2 0 11-4 0v-3a2 2 0 012-2z"
                />
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 11V8a4 4 0 118 0v3"
                />
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Mission Control: Authorization Required
            </h3>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access this sector of your galaxy.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => dispatch(openAuthDialog({ tab: "login" }))}
                className="min-w-36"
              >
                Sign In to Continue
              </Button>
              <Button
                variant="outline"
                onClick={() => dispatch(openAuthDialog({ tab: "register" }))}
                className="min-w-36"
              >
                Create Account
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Access your Constellation and launch daily Training Missions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
