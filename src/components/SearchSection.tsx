"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import SearchResults from "./SearchResults";

const SearchSection = () => {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    setQuery(input);
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col md:items-center items-end gap-2 p-2 border-b border-slate-700">
        <Input
          placeholder="Start searching"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          type="button"
          variant="secondary"
          disabled={!input}
          onClick={handleSubmit}
        >
          Search
        </Button>
      </div>
      {!query ? (
        <div className="pt-20 text-center text-lg font-bold text-slate-500">
          Start typing to get some results
        </div>
      ) : (
        <SearchResults query={query} />
      )}
    </div>
  );
};

export default SearchSection;
