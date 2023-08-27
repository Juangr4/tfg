"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC } from "react";

interface PaginationControlsProps {
  page: number;
  hasNextPage: boolean;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  page,
  hasNextPage,
}) => {
  const router = useRouter();

  const goTo = (page: number) => {
    router.push(`/products?page=${page}`);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              goTo(1);
            }}
            disabled={page === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              goTo(page - 1);
            }}
            disabled={page === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              goTo(page + 1);
            }}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
