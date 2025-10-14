"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VocabCard } from "../types";

interface ReviewCardProps {
  card: VocabCard;
  onReview: (result: "AGAIN" | "HARD" | "GOOD" | "EASY", durationSec: number) => void;
  isSubmitting?: boolean;
}

export function ReviewCard({ card, onReview, isSubmitting }: ReviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime] = useState(() => Date.now());

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleReview = (result: "AGAIN" | "HARD" | "GOOD" | "EASY") => {
    const durationSec = Math.floor((Date.now() - startTime) / 1000);
    onReview(result, durationSec);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      if (e.code === "Space" && !isFlipped) {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        switch (e.key) {
          case "1":
            handleReview("AGAIN");
            break;
          case "2":
            handleReview("HARD");
            break;
          case "3":
            handleReview("GOOD");
            break;
          case "4":
            handleReview("EASY");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFlipped, isSubmitting]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-3xl font-bold text-balance">{card.word}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isFlipped ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-6 text-center">Think about the meaning...</p>
            <Button size="lg" onClick={handleFlip} disabled={isSubmitting}>
              Show Answer <span className="ml-2 text-xs">(Space)</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Meaning (Vietnamese)</h3>
              <p className="text-xl text-pretty">{card.meaningVi}</p>
            </div>

            {card.explanationEn && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Explanation (English)</h3>
                <p className="text-base text-pretty">{card.explanationEn}</p>
              </div>
            )}

            {card.notes && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="text-sm text-muted-foreground text-pretty">{card.notes}</p>
              </div>
            )}

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                How well did you know this word?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="destructive"
                  onClick={() => handleReview("AGAIN")}
                  disabled={isSubmitting}
                  className="h-auto py-4 flex flex-col gap-1"
                  title="Again - Press 1"
                  aria-keyshortcuts="1"
                >
                  <span className="font-semibold">Again</span>
                  <span className="text-xs opacity-80">(1)</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview("HARD")}
                  disabled={isSubmitting}
                  className="h-auto py-4 flex flex-col gap-1 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                  title="Hard - Press 2"
                  aria-keyshortcuts="2"
                >
                  <span className="font-semibold">Hard</span>
                  <span className="text-xs opacity-80">(2)</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview("GOOD")}
                  disabled={isSubmitting}
                  className="h-auto py-4 flex flex-col gap-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  title="Good - Press 3"
                  aria-keyshortcuts="3"
                >
                  <span className="font-semibold">Good</span>
                  <span className="text-xs opacity-80">(3)</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview("EASY")}
                  disabled={isSubmitting}
                  className="h-auto py-4 flex flex-col gap-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  title="Easy - Press 4"
                  aria-keyshortcuts="4"
                >
                  <span className="font-semibold">Easy</span>
                  <span className="text-xs opacity-80">(4)</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
