import React from "react";
import type { Vocab } from "../types";
import { Chip } from "../../../components/Chip";
import { formatDistanceToNow } from "../../../lib/dates";

interface VocabCardProps {
  vocab: Vocab;
}

export const VocabCard = React.memo<VocabCardProps>(({ vocab }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">{vocab.word}</h3>
          <time
            className="text-xs text-muted-foreground"
            dateTime={vocab.addedAt}
            title={new Date(vocab.addedAt).toLocaleString()}
          >
            {formatDistanceToNow(vocab.addedAt)}
          </time>
        </div>

        <p className="text-sm font-medium text-primary">{vocab.meaningVi}</p>

        <p className="text-sm text-muted-foreground line-clamp-2">{vocab.explanationEn}</p>

        {vocab.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {vocab.tags.map((tag) => (
              <Chip key={tag} variant="secondary" size="sm">
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

VocabCard.displayName = "VocabCard";
