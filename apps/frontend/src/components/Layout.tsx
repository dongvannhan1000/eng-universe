"use client";

import type React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export const Layout: React.FC = () => {
  const location = useLocation();

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
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
