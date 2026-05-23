import React from "react";
import { Box, Text, HStack } from "@chakra-ui/react";
import { Check, Plus, TrendingUp, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SearchResults = ({ results, onAddToWatchlist, watchlist }) => {
  const isInWatchlist = (schemeCode) => {
    return watchlist.some((item) => item.schemeCode === schemeCode);
  };

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-white">Search Results</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {results.length} fund{results.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          <span className="text-[10px] font-medium text-gray-400">
            {results.length} results
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        {results.map((scheme) => {
          const added = isInWatchlist(scheme.schemeCode);

          return (
            <Card
              key={scheme.schemeCode}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/15">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                      {scheme.schemeName}
                    </h4>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Hash className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">Scheme Code:</span>
                      <code className="text-xs font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                        {scheme.schemeCode}
                      </code>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      Track NAV performance and analyze historical trends
                    </p>

                    <button
                      onClick={() => onAddToWatchlist(scheme)}
                      disabled={added}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200
                        ${added 
                          ? "bg-emerald-500/15 text-emerald-400 cursor-default"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
                        }
                      `}
                    >
                      {added ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Added to Watchlist
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          Add to Watchlist
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;