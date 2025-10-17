"use client";

import type React from "react";
import { useState } from "react";
import { SearchBar } from "../../../components/SearchBar";
import { Button } from "../../../components/ui/button";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Input } from "../../../components/ui/input";
// import { Loader2 } from "lucide-react";

interface DeckToolbarProps {
  searchQuery: string;
  selectedTags: string[];
  availableTags: string[];
  onSearchChange: (query: string) => void;
  onTagsChange: (tags: string[]) => void;
  onClearFilters: () => void;
}

export const DeckToolbar: React.FC<DeckToolbarProps> = ({
  searchQuery,
  selectedTags,
  availableTags,
  onSearchChange,
  onTagsChange,
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  const navigate = useNavigate();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [topic, setTopic] = useState("");
  const [refresh, setRefresh] = useState(false);

  const normalized = (s: string) =>
    s.trim().toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ");

  const canSubmit = normalized(topic).length >= 2;

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const goPreview = () => {
    const t = normalized(topic);
    navigate({
      pathname: "/decks/preview",
      search: `?${createSearchParams({ topic: t, refresh: String(refresh) })}`,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search decks..." />
          {/* Advanced preview block */}
          <div className="mt-2 text-sm">
            {!showAdvanced ? (
              <button
                className="text-primary hover:underline"
                onClick={() => setShowAdvanced(true)}
              >
                Can’t find your topic? Try advanced search
              </button>
            ) : (
              <div className="mt-2 rounded-lg border border-border p-3 space-y-3">
                <div className="text-sm text-muted-foreground">
                  Enter a topic to preview a new deck.
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., renewable energy, behavioral economics"
                  />
                  <Button disabled={!canSubmit} onClick={goPreview}>
                    Preview deck
                  </Button>
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={refresh}
                    onChange={(e) => setRefresh(e.target.checked)}
                  />
                  Force refresh (ignore cache)
                </label>
              </div>
            )}
          </div>
        </div>

        {availableTags.length > 0 && (
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Active filters:{" "}
            {[
              searchQuery && "search",
              selectedTags.length > 0 &&
                `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"}`,
            ]
              .filter(Boolean)
              .join(", ")}
          </div>
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
