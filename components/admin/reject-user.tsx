"use client";

import React from "react";
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
import { Button } from "../ui/button";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { RejectPartner } from "@/actions/admin/reject-user";

const RejectUser = ({ userID, type }: { userID: string; type: string }) => {
  const handleReject = async () => {
    toast.promise(
      async () => {
        await RejectPartner(userID);
      },
      {
        loading: "Loading...",
        success: "User Rejected!",
        error: "Something went wrong!",
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {type === "icon" ? (
          <Button variant={"destructive"} size={"icon"}>
            <X />
          </Button>
        ) : (
          <Button variant={"destructive"}>Reject</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject User?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Make sure to check the details and
            reject the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleReject()}>
            Reject
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectUser;
