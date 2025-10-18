"use client";

import type React from "react";
import { Link } from "react-router-dom";
import type { Deck } from "../types";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { cn } from "../../../lib/utils"; // optional: classnames helper nếu bạn có
import { ArrowRight } from "lucide-react";

/**
 * Deck type gợi ý:
 * export type Deck = {
 *   slug: string;
 *   title: string;
 *   tags: string[];
 *   description?: string | null; // không dùng nữa
 *   cefr?: string | null;        // không dùng nữa
 *   createdAt?: string;
 *   sample?: string[];           // ví dụ: ["renewable", "emission", "ecosystem"]
 *   itemsCount?: number;         // ví dụ: 120
 * }
 */

interface DeckCardProps {
  deck: Deck;
  className?: string;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck, className }) => {
  const first = deck.title?.trim()?.[0] ?? "?";
  const sample = (deck as any).sample as string[] | undefined; // tuỳ chọn
  const itemsCount = (deck as any).itemsCount as number | undefined;

  return (
    <Link to={`/decks/${deck.slug}`} className="block group">
      <Card
        className={cn(
          "h-full border-border/60 transition-all duration-200 hover:shadow-lg hover:border-primary/40",
          "bg-gradient-to-br from-background to-muted/30",
          className,
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {/* Avatar chữ cái đầu để tạo điểm tựa thị giác */}
            <div
              aria-hidden
              className={cn(
                "select-none shrink-0 rounded-2xl",
                "size-12 grid place-items-center font-semibold",
                "bg-primary/10 text-primary",
              )}
            >
              <span className="text-lg leading-none">{first.toUpperCase()}</span>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold tracking-tight line-clamp-1">{deck.title}</h3>

              {/* Hàng phụ rất nhẹ — ưu tiên sample pills */}
              <div className="mt-2 min-h-[28px]">
                {sample && sample.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {sample.slice(0, 3).map((w) => (
                      <span
                        key={w}
                        className="px-2 py-0.5 text-xs rounded-full bg-card border border-border/60 text-foreground/80"
                        title={w}
                      >
                        {w}
                      </span>
                    ))}
                    {sample.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-card border border-border/60 text-foreground/60">
                        +{sample.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Explore words <ArrowRight className="inline size-3.5 align-[-1px]" />
                  </div>
                )}
              </div>
            </div>

            {/* Count nhỏ xíu, chỉ hiện khi có */}
            {typeof itemsCount === "number" && itemsCount >= 0 && (
              <div className="shrink-0 ml-2">
                <span className="text-[11px] rounded-full border border-border/60 px-2 py-0.5 text-muted-foreground">
                  {itemsCount}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Footer siêu tối giản: mũi tên di chuyển khi hover */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-muted-foreground">
              {deck.tags?.[0] ? `#${deck.tags[0]}` : "\u00A0"}
            </div>
            <ArrowRight
              className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
