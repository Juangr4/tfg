import { serverClient } from "@/app/_trpc/serverClient";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { userColumnsDefinition } from "./columns";

export const dynamic = "force-dynamic";

const UsersPage = async () => {
  const users = await serverClient.users.all();

  return (
    <div className="flex flex-col items-center justify-start h-full w-full gap-4 p-12">
      <div className="flex justify-start items-center w-full gap-4">
        <h1 className="text-5xl">Users</h1>
      </div>
      <Separator />
      <DataTable
        className="w-full"
        columns={userColumnsDefinition}
        data={users}
      />
    </div>
  );
};

export default UsersPage;
