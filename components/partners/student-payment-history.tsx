"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPaymentsByUser } from "@/data/student"; // Assuming Payment type is exported or defined
import PaymentSlipsActions from "@/components/students/payment-slips-action";
import { GalleryVerticalEnd } from "lucide-react";

// If Payment type is not exported from @/data/student, define it here
interface Payment {
  id: string;
  userid: string | null;
  status: "pending" | "approved" | "rejected";
  createdat: Date;
  updatedat: Date;
  type: "direct" | "bank" | "online";
  amount: string;
  totalamount: string | null;
  image: string | null;
}

export default function PaymentHistoryDialog({ userId }: { userId: string }) {
  const [paymentsData, setPaymentsData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setIsLoading(true);
        const payments = await getPaymentsByUser(userId);
        setPaymentsData(payments);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
        setError("Failed to load payment history.");
        setPaymentsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [userId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <GalleryVerticalEnd className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto rounded-lg border">
          {isLoading ? (
            <div className="p-4 text-center">Loading payments...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : paymentsData.length === 0 ? (
            <div className="p-4 text-center">No payment history found.</div>
          ) : (
            <Table className="min-w-[600px]">
              <TableHeader className="bg-muted">
                <TableRow>
                  {["Date", "Amount", "Type", "Status", "Slip", "Actions"].map(
                    (header) => (
                      <TableHead key={header} className="px-4 py-3 text-sm">
                        {header}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsData.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="px-4 py-2">
                      {new Date(payment.createdat).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      LKR {payment.amount}
                    </TableCell>
                    <TableCell className="px-4 py-2 capitalize">
                      {payment.type}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <Badge
                        variant={
                          payment.status === "approved"
                            ? "default"
                            : payment.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                        className={`${
                          payment.status === "pending"
                            ? "bg-highlight-yellow"
                            : ""
                        }`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {payment.image?.split("/").pop()}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {payment.image && (
                        <PaymentSlipsActions path={payment.image} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
