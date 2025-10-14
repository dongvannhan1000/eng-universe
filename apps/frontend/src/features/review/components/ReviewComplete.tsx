"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ReviewCompleteProps {
  count: number;
  elapsedSec: number;
  onRestart?: () => void;
}

export function ReviewComplete({ count, elapsedSec, onRestart }: ReviewCompleteProps) {
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <CardTitle className="text-2xl text-center text-balance">
            All reviews completed for today!
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm text-muted-foreground">Cards reviewed</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
            <p className="text-sm text-muted-foreground">Time spent</p>
          </div>
        </div>

        {onRestart && (
          <div className="flex justify-center pt-4">
            <Button onClick={onRestart}>Review More</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
