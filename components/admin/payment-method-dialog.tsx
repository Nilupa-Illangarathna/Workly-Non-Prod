"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaymentMethodDetails } from "@/data/admin";

interface MethodData {
  number: string | null;
  email: string | null;
  bank: string | null;
  type: string;
  holder: string | null;
  branch: string | null;
}

interface PaymentMethodDialogProps {
  children: React.ReactElement;
  methodId: string;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  children,
  methodId,
}) => {
  const [method, setMethod] = useState<MethodData | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getPaymentMethodDetails(methodId);
      setMethod(data);
    } catch (error) {
      console.error("Failed to fetch payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger onClick={fetchDetails} asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Method Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        ) : method ? (
          <div className="space-y-2">
            {method.bank ? (
              <>
                <p>
                  <strong>Bank:</strong> {method.bank}
                </p>
                <p>
                  <strong>Account Holder:</strong> {method.holder}
                </p>
                <p>
                  <strong>Account Number:</strong> {method.number}
                </p>
                <p>
                  <strong>Branch:</strong> {method.branch}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Email:</strong> {method.email}
                </p>
                <p>
                  <strong>Type:</strong> {method.type}
                </p>
              </>
            )}
          </div>
        ) : (
          <p className="text-red-500">Payment method not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
