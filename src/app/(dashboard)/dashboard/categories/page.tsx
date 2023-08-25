import { serverClient } from "@/app/_trpc/serverClient";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { categoryColumnsDefinition } from "./columns";
import { DialogCategoryForm } from "./dialog-form";

const CategoriesPage = async () => {
  const categories = await serverClient.categories.all();

  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-4 p-12">
      <div className="flex justify-start items-center w-full gap-4">
        <h1 className="text-5xl">Categories</h1>
        <DialogCategoryForm />
      </div>
      <Separator />
      <DataTable
        className="w-full"
        columns={categoryColumnsDefinition}
        data={categories}
      />
    </div>
  );
};

export default CategoriesPage;
