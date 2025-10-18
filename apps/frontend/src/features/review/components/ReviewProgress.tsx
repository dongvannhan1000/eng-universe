interface ReviewProgressProps {
  completed: number;
  total: number;
  remaining: number;
}

export function ReviewProgress({ completed, total, remaining }: ReviewProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: {completed} / {total}
        </span>
        <span className="text-muted-foreground">{remaining} remaining today</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Review progress: ${completed} out of ${total} completed`}
        />
      </div>
    </div>
  );
}
