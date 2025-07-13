"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

interface InvoiceData {
  logo: string;
  user: {
    worklyId: string;
    name: string;
  };
  course: {
    name: string;
    fee: number;
    paid: number;
    remaining: number;
  };
  payments: {
    date: string;
    amount: number;
  }[];
}

const PrintComponent = React.forwardRef<HTMLDivElement, { data: InvoiceData }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="p-4 md:p-8 bg-white text-gray-800 max-w-3xl mx-auto">
        {/* Responsive Header */}
        <div className="mb-6 md:mb-8 border-b pb-4 md:pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Image
              src={data.logo}
              alt="Workly Logo"
              width={150}
              height={50}
              className="h-10 md:h-12 w-auto"
            />
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              INVOICE
            </h1>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Details */}
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-base md:text-lg font-semibold">
              Student Details
            </h2>
            <p className="text-sm">
              <span className="font-medium">User ID:</span> {data.user.worklyId}
            </p>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {data.user.name}
            </p>
          </div>

          {/* Company Details */}
          <div className="text-left md:text-right space-y-1 md:space-y-2">
            <h2 className="text-base md:text-lg font-semibold">Workly LMS</h2>
            <div className="text-sm space-y-0.5">
              <p>1/23, Embilmeegama,</p>
              <p>Pilimathalawa, Sri Lanka</p>
              <p>+94 812579900</p>
              <p>info@workly.cloud</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Date:</span>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="mb-6 md:mb-8 space-y-2 md:space-y-4">
          <h2 className="text-base md:text-lg font-semibold">Course Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div>
              <p className="text-sm">
                <span className="font-medium">Course Name:</span>{" "}
                {data.course.name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-right">
                <span className="font-medium">Course Fee:</span> LKR{" "}
                {data.course.fee.toFixed(2)}
              </p>
              <p className="text-sm text-right">
                <span className="font-medium">Paid:</span> LKR{" "}
                {data.course.paid.toFixed(2)}
              </p>
              <p className="text-sm text-right">
                <span className="font-medium">Balance:</span> LKR{" "}
                {data.course.remaining.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Payment History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-3 md:px-4 border text-sm">
                    Date
                  </th>
                  <th className="text-right py-2 px-3 md:px-4 border text-sm">
                    Amount (LKR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((payment, index) => (
                  <tr key={index}>
                    <td className="py-2 px-3 md:px-4 border text-sm">
                      {payment.date}
                    </td>
                    <td className="py-2 px-3 md:px-4 border text-right text-sm">
                      {payment.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 md:mt-12 pt-4 md:pt-6 border-t text-sm">
          <p className="text-center text-xs md:text-sm">
            Thank you for choosing Workly LMS!
          </p>
        </div>
      </div>
    );
  }
);

PrintComponent.displayName = "PrintComponent";

export default function StudentInvoiceComponent({
  paymentData,
}: {
  paymentData: InvoiceData;
}) {
  const [isClient, setIsClient] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Invoice_${paymentData.user.worklyId}`,
    pageStyle: `
      @media print { 
        @page { margin: 10mm; }
        body { -webkit-print-color-adjust: exact; }
      }
    `,
  });

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => handlePrint()} className="print:hidden">
          Download Invoice
        </Button>
      </div>
      <PrintComponent ref={contentRef} data={paymentData} />
    </div>
  );
}
