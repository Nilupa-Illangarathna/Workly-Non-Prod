import React from "react";
import { Button } from "../ui/button";
import { approvePayment } from "@/actions/admin/payments";
import toast from "react-hot-toast";
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

const PaymentApprove = ({
  paymentId,
  userid,
}: {
  paymentId: string;
  userid: string;
}) => {
  const handleApprove = async () => {
    toast.promise(approvePayment(paymentId, userid), {
      loading: "Processing...",
      success: (result) => <p>{result}</p>,
      error: (err) => <p>{err.message}</p>,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button size="sm">Approve</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve this payment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently Approve the
            payment and update the user dashboard
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleApprove()}>
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentApprove;
