"use client";

import { trpc } from "@/app/_trpc/client";
import { DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { type selectProductSchemaType } from "@/lib/types";
import { type ColumnDef } from "@tanstack/react-table";
import { CheckIcon, Pencil, Trash, XIcon } from "lucide-react";
import Link from "next/link";

export const productColumnsDefinition: Array<
  ColumnDef<selectProductSchemaType>
> = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "archived",
    header: "Archived",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div>
          {product.archived ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <XIcon className="h-4 w-4" />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      const { mutate } = trpc.products.delete.useMutation();

      return (
        <div>
          <Button variant="ghost" asChild>
            <Link href={`/dashboard/products/${product.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={async (ev) => {
              mutate(product.id, {
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
