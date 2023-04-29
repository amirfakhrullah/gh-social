"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const resetPage = () => setCurrentPage(1);

  const Pagination = ({ nextPage }: { nextPage: boolean }) => (
    <div className="py-2 flex flex-row items-center justify-center gap-2">
      {currentPage > 1 && (
        <Button
          variant="secondary"
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>
      )}
      {currentPage > 1 && nextPage && <div>{currentPage}</div>}
      {nextPage && (
        <Button
          variant="secondary"
          onClick={() => nextPage && setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      )}
    </div>
  );

  return {
    currentPage,
    Pagination,
    resetPage,
  };
};

export default usePagination;
