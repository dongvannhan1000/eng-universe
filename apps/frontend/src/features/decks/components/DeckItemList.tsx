import type React from "react";
import type { DeckItem } from "../types";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";

interface DeckItemListProps {
  items: DeckItem[];
  isLoading: boolean;
  isEmpty: boolean;
}

export const DeckItemList: React.FC<DeckItemListProps> = ({ items, isLoading, isEmpty }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-1/3 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No vocabulary items</h3>
        <p className="text-muted-foreground">This deck doesn't have any vocabulary items yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-xl font-semibold text-foreground">{item.headword}</h3>
                {item.pos && (
                  <span className="text-sm text-muted-foreground italic">({item.pos})</span>
                )}
                {item.ipa && <span className="text-sm text-muted-foreground">/{item.ipa}/</span>}
              </div>
            </div>
          </div>

          {item.definition && (
            <p className="text-base text-foreground mb-2">
              <span className="font-medium">Definition:</span> {item.definition}
            </p>
          )}

          {item.example && (
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed italic">
              "{item.example}"
            </p>
          )}

          {item.collocations.length > 0 && (
            <div className="mb-3">
              <span className="text-sm font-medium text-foreground">Collocations: </span>
              <span className="text-sm text-muted-foreground">{item.collocations.join(", ")}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {item.source && (
              <span className="text-xs text-muted-foreground ml-auto">Source: {item.source}</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
