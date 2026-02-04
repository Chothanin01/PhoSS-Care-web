import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import { ArrowUpDown } from "lucide-react";
import { cn } from "../lib/utils";

interface ColumnHeaderProps<T> {
  column: Column<T>;
}

export interface Column<T> {
  id: keyof T | string;
  header: string | ((props: ColumnHeaderProps<T>) => React.ReactNode);
  align?: "left" | "center" | "right";
  width?: string;
  cell: (item: T, rowIndex?: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
  onRowClick?: (item: T) => void;
}

function getPaginationRange(
  current: number,
  total: number,
  delta: number = 1
): (number | "...")[] {
  const range: (number | "...")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  if (left > 2) range.push(1, "...");
  else for (let i = 1; i < left; i++) range.push(i);

  for (let i = left; i <= right; i++) range.push(i);

  if (right < total - 1) range.push("...", total);
  else for (let i = right + 1; i <= total; i++) range.push(i);

  return range;
}

export function DataTable<T>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  currentSortBy,
  currentSortOrder,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full table-auto">
        <TableHeader className="bg-Bamboo-300">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id as string}
                className={cn(
                  "px-2 py-2 text-sm max-w-[200px] text-Bamboo-100 font-semibold",
                  column.className,
                  {
                    "text-center": column.align === "center" || !column.align,
                    "text-right": column.align === "right",
                    "text-left": column.align === "left",
                  }
                )}
                style={{ width: column.width || "auto" }}
              >
                <div
                  className={cn("flex items-center", {
                    "cursor-pointer": column.sortable,
                    "justify-center": column.align === "center" || !column.align,
                    "justify-end": column.align === "right",
                    "justify-start": column.align === "left",
                  })}
                  onClick={() => {
                    if (!column.sortable) return;
                    const newOrder =
                      currentSortBy === column.id && currentSortOrder === "asc"
                        ? "desc"
                        : "asc";
                    onSortChange(column.id as string, newOrder);
                  }}
                >
                  {typeof column.header === "string"
                    ? column.header
                    : column.header({ column })}

                  {column.sortable && (
                    <ArrowUpDown
                      className={cn(
                        "ml-2 h-3 w-3 text-black transition-transform",
                        currentSortBy === column.id &&
                          currentSortOrder === "desc" &&
                          "rotate-180"
                      )}
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id as string}
                    className={cn(
                      "px-2 py-2 text-sm max-w-[200px] font-medium",
                      column.className,
                      {
                        "text-center":
                          column.align === "center" || !column.align,
                        "text-right": column.align === "right",
                        "text-left": column.align === "left",
                      }
                    )}
                  >
                    {column.cell(item, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {getPaginationRange(currentPage, totalPages).map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-2 text-black">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
