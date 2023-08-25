"use client";

import { trpc } from "@/app/_trpc/client";
import { DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { type selectCategorySchemaType } from "@/lib/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

export const categoryColumnsDefinition: Array<
  ColumnDef<selectCategorySchemaType>
> = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      const { mutate } = trpc.categories.delete.useMutation();

      return (
        <div>
          <Button variant="ghost" asChild>
            <Link href={`/dashboard/categories/${category.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={async (ev) => {
              mutate(category.id, {
                onSuccess: () => {
                  location.reload();
                },
              });
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
