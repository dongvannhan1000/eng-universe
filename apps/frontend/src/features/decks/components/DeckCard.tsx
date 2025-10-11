"use client";

import type React from "react";
import { Link } from "react-router-dom";
import type { Deck } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

interface DeckCardProps {
  deck: Deck;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {
  return (
    <Link to={`/decks/${deck.slug}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl">{deck.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {deck.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            {deck.cefr && (
              <Badge variant="outline" className="text-xs">
                {deck.cefr}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(deck.createdAt).toLocaleDateString()}
            </span>
          </div>
          {deck.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {deck.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
