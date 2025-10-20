import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * FeedbackWidget – A compact feedback widget positioned at bottom-left corner
 * * Features:
 * - Compact floating button with tooltip
 * - Bottom-left positioning
 * - Smooth animations
 * - Responsive modal with embedded Google Form
 */
export default function FeedbackWidget({
  formId,
  formUrl,
  buttonLabel = "Send feedback",
  tooltipText = "Do you have any questions? Send feedback to us",
  description = "You can describe the issue, contribute your ideas, or report a bug. We will respond as soon as possible.",
  initialOpen = false,
}: {
  formId?: string;
  formUrl?: string;
  buttonLabel?: string;
  tooltipText?: string;
  description?: string;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const embedUrl = useMemo(() => {
    if (formUrl) return ensureEmbedded(formUrl);
    if (formId) return `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;
    return "";
  }, [formUrl, formId]);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    setShowFallback(false);
    const t = setTimeout(() => setShowFallback(true), 8000);
    return () => clearTimeout(t);
  }, [open, embedUrl]);

  return (
    <>
      {/* Floating Button - Bottom Left */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              size="icon"
              aria-label={buttonLabel}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <p className="text-sm">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Đã chỉnh sửa: Loại bỏ 'p-0' và điều chỉnh chiều cao để tối ưu cho nội dung cuộn */}
        {/* 'h-full' đảm bảo chiều cao tối đa có thể, 'max-w-3xl' giữ nguyên chiều rộng */}
        <DialogContent className="w-[95vw] max-w-3xl h-[85vh] p-0 overflow-hidden gap-0 flex flex-col">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
            {" "}
            {/* Thêm 'flex-shrink-0' */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold">{buttonLabel}</DialogTitle>
                <DialogDescription className="mt-1.5 text-sm">{description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          {/* Đã chỉnh sửa: Đảm bảo phần này mở rộng để lấp đầy không gian còn lại */}
          <div className="relative flex-1 min-h-0 overflow-y-auto">
            {/* Loader */}
            {!loaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-medium">Loading form...</p>
                {showFallback && embedUrl && (
                  <a
                    href={toViewUrl(embedUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline transition-colors"
                  >
                    Open in new tab
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

            {/* iFrame */}
            {embedUrl ? (
              // Đã chỉnh sửa: Loại bỏ 'p-6' ở đây. Kích thước iframe phải là 100% của container
              <div className="h-full w-full">
                <iframe
                  title="Google Form – Phản hồi"
                  src={embedUrl}
                  // Đã chỉnh sửa: 'border-0' và 'rounded-none' để loại bỏ viền và góc tròn, tận dụng tối đa không gian.
                  className="block h-full w-full border-0 rounded-none"
                  frameBorder={0}
                  onLoad={() => setLoaded(true)}
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ display: "block" }}
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div className="max-w-md space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Missing Google Form configuration.
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    Please provide <code className="bg-muted px-1 py-0.5 rounded">formId</code> or{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">formUrl</code> to{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">&lt;FeedbackWidget /&gt;</code>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t bg-muted/30 flex-shrink-0">
            {" "}
            {/* Thêm 'flex-shrink-0' */}
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Note:</span> Form is provided by Google Forms. The
              content you submit will be stored on Google's system.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Giữ nguyên các hàm helper
function ensureEmbedded(url: string) {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("embedded")) {
      u.searchParams.set("embedded", "true");
    }
    return u.toString();
  } catch {
    return url;
  }
}

function toViewUrl(embedUrl: string) {
  try {
    const u = new URL(embedUrl);
    u.searchParams.delete("embedded");
    return u.toString();
  } catch {
    return embedUrl;
  }
}
