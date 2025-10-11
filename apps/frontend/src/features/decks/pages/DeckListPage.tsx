"use client";

import type React from "react";
import { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDeckFilters,
  setDeckQ,
  setDeckTags,
  resetDeckFilters,
} from "../slices/deckFiltersSlice";
import { useDecks } from "../hooks/useDecks";
import { DeckToolbar } from "../components/DeckToolBar";
import { DeckList } from "../components/DeckList";

export const DeckListPage: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectDeckFilters);

  const { data: decks, isLoading, error } = useDecks(filters);

  const availableTags = useMemo(() => {
    if (!decks) return [];
    const tagSet = new Set<string>();
    decks.forEach((deck) => {
      deck.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [decks]);

  const handleSearchChange = useCallback(
    (query: string) => {
      dispatch(setDeckQ(query));
    },
    [dispatch],
  );

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      dispatch(setDeckTags(tags));
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    dispatch(resetDeckFilters());
  }, [dispatch]);

  const isEmpty = decks && decks.length === 0;

  if (error) {
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
          <p className="text-muted-foreground">Failed to load decks. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Vocabulary Decks</h1>
        <p className="text-muted-foreground">
          Browse and explore curated vocabulary collections organized by topics and themes.
        </p>
      </header>

      <DeckToolbar
        searchQuery={filters?.q || ""}
        selectedTags={filters?.tags || []}
        availableTags={availableTags}
        onSearchChange={handleSearchChange}
        onTagsChange={handleTagsChange}
        onClearFilters={handleClearFilters}
      />

      {decks && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {decks.length} deck{decks.length === 1 ? "" : "s"}
          </p>
        </div>
      )}

      <DeckList decks={decks || []} isLoading={isLoading} isEmpty={isEmpty || false} />
    </div>
  );
};
