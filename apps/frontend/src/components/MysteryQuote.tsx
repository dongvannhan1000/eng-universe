import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { http } from "@/lib/http";

export const MysteryQuote = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  interface Quote {
    content: string;
    author: string;
  }
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const response = await http.get<Quote>("/quote");
      setQuote(response.data);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote({
        content:
          "The universe is full of magical things patiently waiting for our wits to grow sharper.",
        author: "Eden Phillpotts",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      if (!quote) {
        fetchQuote();
      }
    } else {
      setIsExpanded(false);
    }
  };

  //   const handleRefresh = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     fetchQuote();
  //   };

  return (
    <div className="relative">
      {!isExpanded ? (
        // Collapsed State - Icon Button
        <button
          onClick={handleToggle}
          className="relative group p-2 rounded-full hover:bg-accent transition-all duration-300"
          aria-label="Mystery Quote of the Day"
          title="Discover your Insight of the Day"
        >
          <Sparkles className="h-6 w-6 text-cyan-500 group-hover:text-cyan-400 transition-colors animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </button>
      ) : (
        // Expanded State - Quote Display
        <div className="absolute right-0 top-0 w-80 sm:w-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl p-6 border border-purple-500/30 z-50">
          {/* Close Button */}
          <button
            onClick={handleToggle}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors group"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-300 group-hover:text-white" />
          </button>

          {/* Header Icon */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-purple-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Insight of the Day</h3>
              <p className="text-xs text-purple-300">Expand your perspective</p>
            </div>
          </div>

          {/* Quote Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500 border-t-transparent"></div>
            </div>
          ) : quote ? (
            <div className="space-y-4">
              {/* Quote Text */}
              <div className="relative">
                <span className="text-3xl text-purple-400/30 font-serif absolute -top-2 -left-2">
                  "
                </span>
                <p className="text-sm text-gray-100 leading-relaxed pl-4 italic">{quote.content}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-2 pt-2 border-t border-purple-500/20">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/50"></div>
                <p className="text-purple-300 text-xs font-medium">— {quote.author}</p>
              </div>
            </div>
          ) : null}

          {/* Refresh Button */}
          {/* <div className="mt-4 flex justify-center">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              New Quote
            </button>
          </div> */}

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl -z-10"></div>
        </div>
      )}
    </div>
  );
};

export default MysteryQuote;
