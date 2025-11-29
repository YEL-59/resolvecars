"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ pagination, currentPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!pagination || pagination.last_page <= 1) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = currentPage - 1;
            if (newPage >= 1) {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", newPage.toString());
              router.push(`/cars?${params.toString()}`);
            }
          }}
          disabled={currentPage === 1 || !pagination.prev_page_url}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {pagination.links && pagination.links.map((link, index) => {
            // Skip Previous and Next links (they're handled by buttons)
            if (!link.url || link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
              return null;
            }

            const pageNum = link.page;
            const isCurrentPage = link.active;

            return (
              <Button
                key={index}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", pageNum.toString());
                  router.push(`/cars?${params.toString()}`);
                }}
                className={isCurrentPage ? "bg-primary text-primary-foreground" : ""}
              >
                {link.label.replace(/[<>&;]/g, "")}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = currentPage + 1;
            if (newPage <= pagination.last_page) {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", newPage.toString());
              router.push(`/cars?${params.toString()}`);
            }
          }}
          disabled={currentPage === pagination.last_page || !pagination.next_page_url}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} cars
      </div>
    </>
  );
}

