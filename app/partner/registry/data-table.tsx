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
  VisibilityState,
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
import { cn } from "@/lib/utils";
import { Copy, FileText, Sheet, FileUp, Printer } from "lucide-react";
import { utils as xlsxUtils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import toast from "react-hot-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableTitle?: string;
}

interface referralsTypes {
  currentUserId: string | null;
  currentPartnerLevel: number;
  currentPartnerCommission: string;
  referrals: Array<referralsTypes>;
}

interface referralsTypes {
  name: string;
  id: string;
  worklyid: string;
  firstname: string;
  lastname: string;
  district: string;
  phone: string;
  email: string;
  role: string;
  createdat: string;
  sponsor_worklyid: string;
  sponsor_firstname: string;
  sponsor_lastname: string;
  commissionrate?: number;
  totalpaid?: number;
  totalcommission?: number;
  whatsapp?: string;
}
export function DataTable<TData, TValue>({
  columns,
  data,
  tableTitle = "Registry Data",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isMounted, setIsMounted] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      email: false,
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
    },
  });

  React.useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleCopy = () => {
    const headers = [
      "No.",
      "Reg. Date",
      "Workly ID",
      "Full Name",
      "Sponsor",
      "District",
      "Phone",
      "Whatsapp",
      "SLC",
      "User Type",
      "Stu. Paid",
    ];
    const rows = (data as referralsTypes[]).map(
      (row: referralsTypes, index) => [
        index + 1,
        new Date(row.createdat).toLocaleDateString(),
        row.worklyid,
        `${row.firstname} ${row.lastname}`,
        `${row.sponsor_firstname} ${row.sponsor_lastname}`,
        row.district,
        row.phone,
        row.whatsapp,
        row.commissionrate || "0",
        Number(row?.totalpaid)?.toFixed(2),
      ]
    );

    const text = [headers, ...rows].map((row) => row.join("\t")).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleCSV = () => {
    const headers = [
      "No.",
      "Reg. Date",
      "Workly ID",
      "Full Name",
      "Sponsor",
      "District",
      "Phone",
      "Whatsapp",
      "SLC",
      "User Type",
      "Stu. Paid",
    ];
    const rows = (data as referralsTypes[]).map((row, index) => [
      index + 1,
      `"${new Date(row.createdat).toLocaleDateString()}"`,
      `"${row.worklyid}"`,
      `"${row.firstname} ${row.lastname}"`,
      `"${row.sponsor_firstname} ${row.sponsor_lastname}"`,
      `"${row.district}"`,
      `"${row.phone}"`,
      `"${row.whatsapp}"`,
      row.commissionrate || "0",
      `"${row.role}"`,
      Number(row?.totalpaid)?.toFixed(2),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    downloadFile(csvContent, "csv", `${tableTitle}.csv`);
  };

  const handleExcel = () => {
    const headers = [
      "No.",
      "Reg. Date",
      "Workly ID",
      "Full Name",
      "Sponsor",
      "District",
      "Phone",
      "Whatsapp",
      "SLC",
      "User Type",
      "Stu. Paid",
    ];
    const rows = (data as referralsTypes[]).map(
      (row: referralsTypes, index) => [
        index + 1,
        new Date(row.createdat),
        row.worklyid,
        `${row.firstname} ${row.lastname}`,
        `${row.sponsor_firstname} ${row.sponsor_lastname}`,
        row.district,
        row.phone,
        row.whatsapp,
        Number(row.commissionrate) || 0,
        row.role,
        Number(row.totalpaid),
      ]
    );

    const ws = xlsxUtils.aoa_to_sheet([headers, ...rows]);
    const wb = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, `${tableTitle}.xlsx`);
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    const headers = [
      "No.",
      "Reg. Date",
      "Workly ID",
      "Full Name",
      "Sponsor",
      "District",
      "Phone",
      "Whatsapp",
      "SLC",
      "User Type",
      "Stu. Paid",
    ];
    const rows = (data as referralsTypes[]).map(
      (row: referralsTypes, index) => [
        index + 1,
        new Date(row.createdat).toLocaleDateString(),
        row.worklyid,
        `${row.firstname} ${row.lastname}`,
        `${row.sponsor_firstname} ${row.sponsor_lastname}`,
        row.district,
        row.phone,
        row.whatsapp,
        row.commissionrate || "0",
        row.role,
        Number(row?.totalpaid)?.toFixed(2),
      ]
    );

    doc.setFontSize(16);
    doc.text(`${tableTitle}`, 14, 10);

    autoTable(doc, {
      head: [headers],
      body: rows.map((row) => row.map((cell) => cell ?? "")),
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 15 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
      },
    });

    doc.save(`${tableTitle}.pdf`);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Clone the table to preserve original styles
      const tableClone = document
        .querySelector("#data-table")
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

      // Add slight delay to ensure proper rendering
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  // Add utility functions
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

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <Input
          placeholder="Filter Here..."
          value={globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="w-full sm:max-w-sm"
        />
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
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
              <Button variant="outline" className="w-full sm:w-auto">
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
                    className="capitalize text-xs sm:text-sm"
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

      <div id="data-table" className="rounded-md border overflow-x-hidden">
        <Table className="min-w-[800px] sm:min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-sm !bg-dark-bg">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-x-2 border-border first:pl-4 first:border-l-0 last:border-r-0 text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "text-sm h-12",
                    index % 2 !== 0 && "bg-accent text-accent-foreground"
                  )}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
