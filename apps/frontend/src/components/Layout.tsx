"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { verifyAuth } from "@/features/auth/slices/authSlice";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { AuthDialog } from "@/features/auth/components/AuthDialog";
import { Button } from "@/components/ui/button";

export const Layout: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Verify authentication on mount
  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/decks");
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors"
              >
                Vocab Learning
              </Link>
              {isAuthenticated && (
                <div className="flex gap-1">
                  <Link
                    to="/decks"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    Collections
                  </Link>
                  <Link
                    to="/vocabs"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/vocabs")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    Laboratory
                  </Link>
                  <Link
                    to="/review"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/review")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    Review
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isLoading &&
                (isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <Button onClick={() => setAuthDialogOpen(true)}>Sign In</Button>
                ))}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};
