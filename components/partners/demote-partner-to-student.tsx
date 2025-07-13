// components/partner/demote-user.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { demotePartner } from "@/actions/admin/users";
import toast from "react-hot-toast";

export function DemotePartnerToStudent({
  userId,
  label,
}: {
  userId: string;
  label?: string;
}) {
  const handleDemote = async () => {
    toast.promise(
      async () => {
        await demotePartner(userId);
      },
      {
        loading: "Demoting user...",
        success: "User demoted successfully",
        error: (error) => `Failed to demote user: ${error}`,
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          {label ? label : "Demote to Student"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Demotion</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove partner privileges from the user. Are you
            sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDemote()}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
