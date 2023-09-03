import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export const PasswordChanger = () => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [message, setMessage] = useState("");

  const { mutate } = trpc.users.changePassword.useMutation();

  const changePassword = () => {
    mutate(
      { oldPassword, newPassword },
      {
        onSuccess(data, variables, context) {
          toast({
            title: "Password changed",
            description: "Your password has been changed.",
          });
          setOldPassword("");
          setNewPassword("");
        },
        onError(error, variables, context) {
          if (error.data?.code !== "BAD_REQUEST") return;
          setMessage("You current password is not correct.");
          setOldPassword("");
          setNewPassword("");
        },
      }
    );
  };

  return (
    <div className="grid gap-4">
      <p className="text-red-700 font-semibold">{message}</p>
      <Input
        placeholder="Enter your current password"
        type="password"
        value={oldPassword}
        onChange={(ev) => {
          setOldPassword(ev.target.value);
        }}
      />
      <Input
        placeholder="Enter the new password"
        type="password"
        value={newPassword}
        onChange={(ev) => {
          setNewPassword(ev.target.value);
        }}
      />
      <Button onClick={changePassword}>Change passwords</Button>
    </div>
  );
};
