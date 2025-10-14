"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ReviewEmptyProps {
  onAddWords?: () => void;
}

export function ReviewEmpty({ onAddWords }: ReviewEmptyProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-16 h-16 text-primary" />
          <CardTitle className="text-2xl text-center text-balance">
            Everything up to date!
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          You have no vocabulary items due for review today.
        </p>
        {onAddWords && (
          <div className="flex justify-center pt-4">
            <Button onClick={onAddWords}>Add New Words</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
