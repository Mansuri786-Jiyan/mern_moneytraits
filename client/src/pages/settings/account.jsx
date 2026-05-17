import React from "react";
import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./_components/account-form";
import { ChangePasswordForm } from "./_components/change-password-form";
import { DeleteAccountButton } from "./_components/delete-account-button";

const Account = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">Account Overview</h3>
        <p className="text-sm text-muted-foreground">
          Update your profile information and email address.
        </p>
      </div>
      <Separator />
      <AccountForm />

      <div className="pt-6">
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-muted-foreground">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>
      <Separator />
      <ChangePasswordForm />

      <div className="pt-6">
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all of your content.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
};

export default Account;