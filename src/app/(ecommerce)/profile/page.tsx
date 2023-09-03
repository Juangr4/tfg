import { authOptions } from "@/app/_nextauth/options";
import { serverClient } from "@/app/_trpc/serverClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AccountForm } from "./profile";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  const user = await serverClient.users.findByEmail(
    session.user.email as string
  );

  if (!user) {
    return redirect("/");
  }

  return (
    <div>
      <AccountForm user={user} />
    </div>
  );
};

export default ProfilePage;
