"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, FileText, Sheet, FileUp, Printer } from "lucide-react";
import { utils as xlsxUtils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { format } from "date-fns";
import toast from "react-hot-toast";

export type WithdrawalHistory = {
  createdAt: string;
  id: string;
  amount: string;
  method_id: string;
  status: "approved" | "pending" | "rejected";
  paymentMethod: {
    number: string | null;
    id: string;
    bank: string | null;
    type: string;
    email: string | null;
    branch: string | null;
  };
};

interface DataTableProps {
  columns: ColumnDef<WithdrawalHistory>[];
  data: WithdrawalHistory[];
  tableTitle?: string;
}

export function DataTable({
  columns,
  data,
  tableTitle = "Withdrawal History",
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const getPaymentDetails = (
    paymentMethod: WithdrawalHistory["paymentMethod"]
  ) => {
    switch (paymentMethod.type) {
      case "Bank":
        return `${paymentMethod.bank} - A/C ${paymentMethod.number}${
          paymentMethod.branch ? ` (${paymentMethod.branch})` : ""
        }`;
      case "PayPal":
        return paymentMethod.email;
      default:
        return "-";
    }
  };

  const handleCopy = () => {
    const headers = [
      "Date",
      "Amount (LKR)",
      "Status",
      "Payment Method",
      "Details",
    ];
    const rows = data.map((withdrawal) => [
      format(withdrawal.createdAt, "dd MMM yyyy"),
      `LKR ${Number(withdrawal.amount).toLocaleString()}`,
      withdrawal.status,
      withdrawal.paymentMethod.type,
      getPaymentDetails(withdrawal.paymentMethod),
    ]);

    const text = [headers, ...rows].map((row) => row.join("\t")).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleCSV = () => {
    const headers = [
      "Date",
      "Amount",
      "Status",
      "Payment Method Type",
      "Bank",
      "Account Number",
      "Branch",
      "Email",
    ];
    const rows = data.map((withdrawal) => [
      `"${format(withdrawal.createdAt, "dd MMM yyyy")}"`,
      Number(withdrawal.amount).toFixed(2),
      `"${withdrawal.status}"`,
      `"${withdrawal.paymentMethod.type}"`,
      withdrawal.paymentMethod.bank
        ? `"${withdrawal.paymentMethod.bank}"`
        : '""',
      withdrawal.paymentMethod.number
        ? `"${withdrawal.paymentMethod.number}"`
        : '""',
      withdrawal.paymentMethod.branch
        ? `"${withdrawal.paymentMethod.branch}"`
        : '""',
      withdrawal.paymentMethod.email
        ? `"${withdrawal.paymentMethod.email}"`
        : '""',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    downloadFile(csvContent, "csv", `${tableTitle}.csv`);
  };

  const handleExcel = () => {
    const headers = [
      "Date",
      "Amount (LKR)",
      "Status",
      "Payment Method Type",
      "Bank",
      "Account Number",
      "Branch",
      "Email",
    ];
    const rows = data.map((withdrawal) => [
      withdrawal.createdAt,
      Number(withdrawal.amount),
      withdrawal.status,
      withdrawal.paymentMethod.type,
      withdrawal.paymentMethod.bank || "",
      withdrawal.paymentMethod.number || "",
      withdrawal.paymentMethod.branch || "",
      withdrawal.paymentMethod.email || "",
    ]);

    const ws = xlsxUtils.aoa_to_sheet([headers, ...rows]);
    const wb = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(wb, ws, "Withdrawals");
    writeFile(wb, `${tableTitle}.xlsx`);
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    const headers = [
      ["Date", "Amount (LKR)", "Status", "Payment Method", "Details"],
    ];
    const rows = data.map((withdrawal) => [
      format(withdrawal.createdAt, "dd MMM yyyy"),
      `LKR ${Number(withdrawal.amount).toLocaleString()}`,
      withdrawal.status,
      withdrawal.paymentMethod.type,
      getPaymentDetails(withdrawal.paymentMethod),
    ]);

    doc.setFontSize(16);
    doc.text(tableTitle, 14, 10);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        1: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 45 },
      },
    });

    doc.save(`${tableTitle}.pdf`);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const tableClone = document
        .querySelector("#withdrawals-table")
        ?.cloneNode(true) as HTMLElement;

      // Add print-specific styles
      const printStyles = `
        <style>
          @page { size: landscape; margin: 10mm; }
          body { margin: 0; font-family: Arial, sans-serif; }
          h2 { text-align: center; margin-bottom: 20px; color: #333; }
          table { width: 100% !important; border-collapse: collapse; table-layout: auto; }
          th, td { 
            border: 1px solid #ddd !important; 
            padding: 8px !important; 
            text-align: left !important; 
            white-space: nowrap;
            font-size: 12px;
          }
          th { background-color: #f5f5f5 !important; }
          .bg-accent { background-color: #f8f9fa !important; }
          button { display: none !important; }
        </style>
      `;

      printWindow.document.write(`
        <html>
          <head>
            <title>${tableTitle}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${printStyles}
          </head>
          <body>
            <h2>${tableTitle}</h2>
            ${tableClone?.outerHTML || ""}
          </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const downloadFile = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], { type: `text/${type};charset=utf-8;` });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center justify-between gap-4">
        <Input
          placeholder="Filter records..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="lg:max-w-sm w-full"
        />

        <div className="flex flex-col lg:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center justify-center flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleCSV}>
              <FileText className="h-4 w-4 mr-2" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExcel}>
              <Sheet className="h-4 w-4 mr-2" /> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handlePDF}>
              <FileUp className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="whitespace-nowrap w-full lg:w-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div id="withdrawals-table" className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="!bg-dark-bg/90">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white border-x-2 border-border first:pl-4 first:border-l-0 last:border-r-0">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-8 even:bg-accent data-[state=selected]:bg-muted/50"
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-x-2 border-border first:pl-4 first:border-l-0 last:border-r-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No earnings records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
