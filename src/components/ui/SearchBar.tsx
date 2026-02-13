"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "جستجوی ارز، طلا، سکه...",
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch?.(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <div
      className={cn(
        "relative flex items-center rounded-lg border border-input bg-background transition-all",
        isFocused && "ring-2 ring-ring",
        className
      )}
    >
      <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          className="ml-2 rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="پاک کردن"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
