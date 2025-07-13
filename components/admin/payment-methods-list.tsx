import { cache, Suspense } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPaymentMethodsByUser } from "@/data/payment-methods";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentMethodDelete from "../payment-method-delete";

const getCachedUser = cache(async (id: string) => {
  return await getPaymentMethodsByUser(id);
});

export default async function PaymentMethodsList({ id }: { id: string }) {
  const methods = await getCachedUser(id);

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
            {[
              "Method",
              "Email",
              "Holder",
              "Bank",
              "Branch",
              "Number",
              "Actions",
            ].map((header) => (
              <TableHead key={header} className="px-4 py-3 text-sm">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {methods.length === 0 && (
          <TableCaption className="w-full">
            No payment methods found
          </TableCaption>
        )}
        <TableBody>
          {methods.map((method) => (
            <TableRow key={method.id}>
              <TableCell className="px-4 py-2 capitalize">
                {method.type}
              </TableCell>
              <TableCell className="px-4 py-2">{method.email || "-"}</TableCell>
              <TableCell className="px-4 py-2">
                {method.holder || "-"}
              </TableCell>
              <TableCell className="px-4 py-2">{method.bank || "-"}</TableCell>
              <TableCell className="px-4 py-2">
                {method.branch || "-"}
              </TableCell>
              <TableCell className="px-4 py-2">
                {method.number || "-"}
              </TableCell>
              <TableCell className="px-4 py-2">
                <PaymentMethodDelete id={method.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
