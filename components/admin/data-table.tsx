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
import { DataTablePagination } from "@/components/data-table-pagination";
import {
  exportToClipboard,
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "@/lib/table-export";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableTitle?: string;
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
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: data as unknown as TData[],
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
        pageSize: 50,
      },
    },
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
  });

  React.useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Utility function to get headers and rows dynamically
  const getTableData = () => {
    const visibleColumns = table.getVisibleLeafColumns();
    const headers = visibleColumns.map((column) => {
      // Attempt to get a human-readable header
      // This might need adjustment based on how headers are defined in your columnDefs
      const header = column.columnDef.header;
      if (typeof header === "string") {
        return header;
      }
      // Fallback to column id if header is not a simple string
      // You might want a more sophisticated way to get a display name
      return column.id;
    });

    const rows = table.getRowModel().rows.map((row) =>
      visibleColumns.map((column) => {
        const cell = row
          .getVisibleCells()
          .find((cell) => cell.column.id === column.id);
        // Accessing the original row data might be more reliable for export
        // than relying on the rendered cell value, especially for complex cell renderers.
        // This assumes `row.original` contains the data in a format suitable for export.
        // You might need to adjust `cell.getValue()` or access `row.original[column.id]`
        // depending on your data structure and cell rendering.
        // For simplicity, using cell.getValue() here.
        const value = cell?.getValue();
        if (value instanceof Date) {
          return value.toLocaleDateString(); // Or any other date format you prefer
        }
        return value !== undefined && value !== null ? String(value) : "";
      })
    );
    return { headers, rows };
  };

  const handleCopy = () => {
    const { headers, rows } = getTableData();
    // The `referralsTypes` cast and specific data mapping is removed.
    // The dynamic `getTableData` function now provides headers and rows.
    // We assume `getTableData` correctly formats data for plain text copy.
    exportToClipboard(
      headers,
      rows.map((row) => row.map((cell) => String(cell ?? "")))
    );
  };

  const handleCSV = () => {
    const { headers, rows } = getTableData();
    // The `referralsTypes` cast and specific data mapping is removed.
    // `exportToCSV` will handle quoting and escaping.
    exportToCSV(headers, rows, `${tableTitle}.csv`);
  };

  const handleExcel = () => {
    const { headers, rows } = getTableData();
    // The `referralsTypes` cast and specific data mapping is removed.
    // `exportToExcel` will handle data types appropriately for Excel.
    // Ensure dates are passed as Date objects if specific date formatting in Excel is desired,
    // or as formatted strings if not. `getTableData` currently formats dates as strings.
    // If Date objects are needed, `getTableData` should be adjusted.
    exportToExcel(
      headers,
      rows.map((row) =>
        row.map((cell) => {
          // Attempt to convert back to number if it's a numeric string for Excel
          const num = Number(cell);
          return isNaN(num) ? cell : num;
        })
      ),
      `${tableTitle}.xlsx`
    );
  };

  const handlePDF = () => {
    const { headers, rows } = getTableData();
    // The `referralsTypes` cast and specific data mapping is removed.
    // `exportToPDF` will handle the PDF generation.
    // Column widths can be customized if needed by passing a fourth argument to exportToPDF.
    exportToPDF(headers, rows, `${tableTitle}.pdf`, tableTitle || "Data");
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

      <DataTablePagination table={table} /> {/* Top Pagination */}

      <div id="data-table" className="!rounded-lg border">
        <Table className="min-w-[800px] sm:min-w-full rounded-md">
          <TableHeader className="rounded-t-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="text-sm !bg-dark-bg rounded-t-md">
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
      <DataTablePagination table={table} />
    </div>
  );
}
