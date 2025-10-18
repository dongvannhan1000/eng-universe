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

import { motion } from "framer-motion";

export const DeckListPage: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectDeckFilters);

  const { data: allDecks, isLoading, error } = useDecks();

  const filteredDecks = useMemo(() => {
    if (!allDecks) return [];

    let result = allDecks;

    // Filter by search query (matches slug, title, or description)
    if (filters.q) {
      const query = filters.q.toLowerCase().trim();
      result = result.filter((deck) => {
        return (
          deck.slug.toLowerCase().includes(query) ||
          deck.title.toLowerCase().includes(query) ||
          (deck.description && deck.description.toLowerCase().includes(query)) ||
          deck.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    // Filter by selected tags
    if (filters.tags.length > 0) {
      result = result.filter((deck) => {
        return filters.tags.some((filterTag) => deck.tags.includes(filterTag));
      });
    }

    return result;
  }, [allDecks, filters.q, filters.tags]);

  const availableTags = useMemo(() => {
    if (!allDecks) return [];
    const tagSet = new Set<string>();
    allDecks.forEach((deck) => {
      deck.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allDecks]);

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

  const isEmpty = filteredDecks.length === 0;

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
    <div className="relative">
      <div className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Word Observatory</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore the <span className="font-medium">constellations of vocabulary</span> — where
            each word is a star and every meaning connects to another. Expand your English universe,
            one theme at a time.
          </p>
        </motion.header>
        {/* <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Collections</h1>
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
        /> */}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <DeckToolbar
            searchQuery={filters?.q || ""}
            selectedTags={filters?.tags || []}
            availableTags={availableTags}
            onSearchChange={handleSearchChange}
            onTagsChange={handleTagsChange}
            onClearFilters={handleClearFilters}
          />

          {allDecks && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredDecks.length}</span> of{" "}
                <span className="font-medium">{allDecks.length}</span> vocabulary constellations
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          <DeckList decks={filteredDecks} isLoading={isLoading} isEmpty={isEmpty} />
        </motion.div>
      </div>
    </div>
  );
};
