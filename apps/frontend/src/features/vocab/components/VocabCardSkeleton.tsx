import React from "react";

export const VocabCardSkeleton = React.memo(() => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <div className="h-6 bg-muted rounded w-24"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
        </div>

        <div className="h-4 bg-muted rounded w-32"></div>

        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>

        <div className="flex flex-wrap gap-1">
          <div className="h-6 bg-muted rounded-full w-16"></div>
          <div className="h-6 bg-muted rounded-full w-12"></div>
        </div>
      </div>
    </div>
  );
});

VocabCardSkeleton.displayName = "VocabCardSkeleton";
