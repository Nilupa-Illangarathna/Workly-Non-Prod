import React from "react";
import { Button } from "../ui/button";
import { rejectPayment } from "@/actions/admin/payments";
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
import { Loader2 } from "lucide-react";

const PaymentReject = ({ paymentId }: { paymentId: string }) => {
  const [isPending, startTransition] = React.useTransition();

  const handleRejection = async () => {
    startTransition(async () => {
      try {
        await rejectPayment(paymentId);
        toast.success("Payment rejected");
      } catch {
        toast.error("Rejection failed");
      }
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size="sm" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Reject"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject this payment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently Reject the
            payment and update the user dashboard
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleRejection()}
            className="!bg-red-500 text-white"
            disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Reject"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentReject;
