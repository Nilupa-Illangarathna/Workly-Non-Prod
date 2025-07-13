import { cache, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPaymentsByUser } from "@/data/student";
import PaymentSlipsActions from "@/components/students/payment-slips-action";

const getCachedPaymentMethods = cache(async (id: string) => {
  return await getPaymentsByUser(id);
});

export default async function PaymentHistory({ id }: { id: string }) {
  const payments = await getCachedPaymentMethods(id);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Suspense
        fallback={
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        }
      />
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
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="px-4 py-2">
                {new Date(payment.createdat).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-4 py-2">LKR {payment.amount}</TableCell>
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
                    payment.status === "pending" ? "bg-highlight-yellow" : ""
                  }`}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-2">
                {payment.image?.split("/").pop()}
              </TableCell>
              <TableCell className="px-4 py-2">
                {payment.image && <PaymentSlipsActions path={payment.image} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
