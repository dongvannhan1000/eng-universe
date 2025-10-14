"use client";

import { useState } from "react";
import { useReviewQueue } from "../hooks/useReviewQueue";
import { useSubmitReview } from "../hooks/useSubmitReview";
import { ReviewCard } from "../components/ReviewCard";
import { ReviewProgress } from "../components/ReviewProgress";
import { ReviewComplete } from "../components/ReviewComplete";
import { ReviewEmpty } from "../components/ReviewEmpty";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { ReviewResult } from "../types";

export function ReviewQueuePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [sessionStartTime] = useState(() => Date.now());
  const [queueParams] = useState({ take: 50 });

  const { data, isLoading, error, refetch } = useReviewQueue(queueParams);
  const submitReview = useSubmitReview();

  // Filter out completed cards from the queue
  const remainingCards = data?.items.filter((card) => !completedCards.includes(card.id)) || [];
  const currentCard = remainingCards[currentIndex];
  const totalCards = data?.items.length || 0;
  const completedCount = completedCards.length;

  const handleReview = async (result: ReviewResult, durationSec: number) => {
    if (!currentCard) return;

    try {
      await submitReview.mutateAsync({
        vocabId: currentCard.id,
        body: {
          result,
          durationSec,
        },
      });

      // Mark card as completed
      setCompletedCards((prev) => [...prev, currentCard.id]);

      // Move to next card or stay at current index (since we filtered out completed)
      // The current index will automatically show the next card due to filtering
    } catch (err) {
      console.error("[v0] Failed to submit review:", err);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompletedCards([]);
    refetch();
  };

  // Calculate elapsed time
  const elapsedSec = Math.floor((Date.now() - sessionStartTime) / 1000);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner className="w-8 h-8" />
        <p className="text-muted-foreground">Loading your review queue...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load review queue. Please try again.</AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  // Empty state - no cards due
  if (totalCards === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ReviewEmpty />
      </div>
    );
  }

  // Complete state - all cards reviewed
  if (remainingCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ReviewComplete count={completedCount} elapsedSec={elapsedSec} onRestart={handleRestart} />
      </div>
    );
  }

  // Review in progress
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ReviewProgress
        completed={completedCount}
        total={totalCards}
        remaining={remainingCards.length}
      />

      <div className="flex justify-center">
        <ReviewCard
          card={currentCard}
          onReview={handleReview}
          isSubmitting={submitReview.isPending}
        />
      </div>

      {submitReview.isError && (
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to submit review. Please try again.</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
