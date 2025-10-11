"use client";

import type React from "react";
import { useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectDeckDetail, setDeckPage, resetDeckDetail } from "../slices/deckDetailSlice";
import { useDeckDetail } from "../hooks/useDeckDetail";
import { useDeckItems } from "../hooks/useDeckItems";
import { DeckItemList } from "../components/DeckItemList";
import { Pagination } from "../../../components/Pagination";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";

export const DeckDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const { page, limit } = useSelector(selectDeckDetail);

  // First fetch deck by slug to get the ID
  const { data: deck, isLoading: isDeckLoading, error: deckError } = useDeckDetail(slug || "");
  const deckId = deck?.id || 0;

  const {
    data: itemsData,
    isLoading: isItemsLoading,
    error: itemsError,
  } = useDeckItems(deckId, page, limit);

  useEffect(() => {
    return () => {
      dispatch(resetDeckDetail());
    };
  }, [dispatch, slug]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setDeckPage(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch],
  );

  const totalPages = itemsData ? Math.ceil(itemsData.total / itemsData.limit) : 0;
  const isEmpty = itemsData && itemsData.items.length === 0;

  if (deckError || itemsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
          <p className="text-muted-foreground">
            Failed to load deck details. Please try again later.
          </p>
          <Link to="/decks">
            <Button variant="outline" className="mt-4 bg-transparent">
              Back to Decks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!deck && !isDeckLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Deck not found</h3>
          <p className="text-muted-foreground">The deck you're looking for doesn't exist.</p>
          <Link to="/decks">
            <Button variant="outline" className="mt-4 bg-transparent">
              Back to Decks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/decks">
          <Button variant="ghost" size="sm" className="mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Decks
          </Button>
        </Link>

        {isDeckLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ) : (
          deck && (
            <div>
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-3xl font-bold text-foreground">{deck.title}</h1>
                {deck.cefr && (
                  <Badge variant="outline" className="text-sm">
                    {deck.cefr}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {deck.description || "No description available"}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-muted-foreground">
                  Created {new Date(deck.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  Updated {new Date(deck.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {deck.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {deck.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      <div className="border-t border-border pt-6">
        {itemsData && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {itemsData.items.length} of {itemsData.total} items
              {page > 1 && ` (page ${page})`}
            </p>
          </div>
        )}

        <DeckItemList
          items={itemsData?.items || []}
          isLoading={isItemsLoading}
          isEmpty={isEmpty || false}
        />

        {itemsData && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
