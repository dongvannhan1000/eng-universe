"use client";

import type React from "react";
import { useCallback, useEffect } from "react";
import { useParams, Link, useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectDeckDetail, setDeckPage, resetDeckDetail } from "../slices/deckDetailSlice";
import { useDeckDetail } from "../hooks/useDeckDetail";
import { useDeckItems } from "../hooks/useDeckItems";
import { DeckItemList } from "../components/DeckItemList";
import { Pagination } from "../../../components/Pagination";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { motion } from "framer-motion";

import { usePreviewDeck } from "../hooks/usePreviewDeck";

export const DeckDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sp] = useSearchParams();
  const location = useLocation();
  const isPreview = location.pathname.endsWith("/decks/preview");
  const topic = sp.get("topic") || "";
  const refresh = sp.get("refresh") === "true";
  const dispatch = useDispatch();
  const { page, limit } = useSelector(selectDeckDetail);

  // First fetch deck by slug to get the ID
  const {
    data: previewData,
    isLoading: isPreviewLoading,
    error: previewError,
  } = usePreviewDeck(topic, page, limit, refresh);

  // Real data (DB)
  const {
    data: deck,
    isLoading: isDeckLoading,
    error: deckError,
  } = useDeckDetail(isPreview ? "" : slug || "");

  const {
    data: itemsData,
    isLoading: isItemsLoading,
    error: itemsError,
  } = useDeckItems(isPreview ? "" : slug || "", page, limit);

  useEffect(() => {
    return () => {
      dispatch(resetDeckDetail());
    };
  }, [dispatch, slug, topic, isPreview]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setDeckPage(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch],
  );

  const effectiveDeck = isPreview ? previewData?.deck : deck;
  const effectiveItems = isPreview
    ? {
        items: previewData?.items ?? [],
        total: previewData?.total ?? 0,
        limit: previewData?.limit ?? limit,
      }
    : itemsData;
  const isLoading = isPreview ? isPreviewLoading : isDeckLoading || isItemsLoading;
  const hasError = isPreview ? !!previewError : deckError || itemsError;
  const totalPages = effectiveItems ? Math.ceil(effectiveItems.total / effectiveItems.limit) : 0;
  const isEmpty = effectiveItems ? effectiveItems.items.length === 0 : false;

  if (hasError) {
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

  if (!effectiveDeck && !isLoading) {
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
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
    >
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
            effectiveDeck && (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-3xl font-bold text-foreground">{effectiveDeck.title}</h1>
                  {effectiveDeck.cefr && (
                    <Badge variant="outline" className="text-sm">
                      {effectiveDeck.cefr}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {effectiveDeck.description || "No description available"}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-muted-foreground">
                    Created {new Date(effectiveDeck.createdAt as any).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Updated {new Date(effectiveDeck.updatedAt as any).toLocaleDateString()}
                  </span>
                </div>
                {effectiveDeck.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {effectiveDeck.tags.map((tag) => (
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
          {effectiveItems && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{effectiveItems.items.length}</span> of{" "}
                <span className="font-medium">{effectiveItems.total}</span> items
                {page > 1 && ` (page ${page})`}
              </p>
            </div>
          )}

          <DeckItemList
            items={effectiveItems?.items || []}
            isLoading={isLoading}
            isEmpty={isEmpty || false}
          />

          {effectiveItems && totalPages > 1 && (
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
    </motion.div>
  );
};
