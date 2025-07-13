"use client";

import { utils as xlsxUtils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Utility function to download files
const downloadFile = (content: string, mimeType: string, filename: string) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up
};

export const exportToClipboard = (
  headers: string[],
  rows: (string | number | Date)[][]
) => {
  const text = [headers, ...rows].map((row) => row.join("\t")).join("\n");
  navigator.clipboard.writeText(text).catch((err) => {
    console.error("Failed to copy to clipboard:", err);
    // Fallback or user notification can be added here
  });
};

export const exportToCSV = (
  headers: string[],
  rows: (string | number | Date)[][],
  filename: string
) => {
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const cellString = String(cell ?? "");
          // Escape quotes by doubling them, and wrap in quotes if it contains a comma, newline or quote
          if (
            cellString.includes('"') ||
            cellString.includes(",") ||
            cellString.includes("\n")
          ) {
            return `"${cellString.replace(/"/g, '""')}"`;
          }
          return cellString;
        })
        .join(",")
    )
    .join("\n");
  downloadFile(csvContent, "text/csv", filename);
};

export const exportToExcel = (
  headers: string[],
  rows: (string | number | Date)[][],
  filename: string,
  sheetName: string = "Sheet1"
) => {
  const ws = xlsxUtils.aoa_to_sheet([headers, ...rows]);
  const wb = xlsxUtils.book_new();
  xlsxUtils.book_append_sheet(wb, ws, sheetName);
  writeFile(wb, filename);
};

export const exportToPDF = (
  headers: string[],
  rows: (string | number | Date)[][],
  filename: string,
  title: string,
  columnWidths?: { [key: number]: { cellWidth: number } }
) => {
  const doc = new jsPDF({
    orientation: "landscape",
  });
  doc.setFontSize(16);
  doc.text(title, 14, 10);

  autoTable(doc, {
    head: [headers],
    body: rows.map((row) => row.map((cell) => String(cell ?? ""))),
    startY: 20,
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: columnWidths || {
      0: { cellWidth: "auto" }, // Default auto width
    },
    didParseCell: function (data) {
      // Ensure dates are formatted nicely for PDF
      if (data.cell.raw instanceof Date) {
        data.cell.text = [data.cell.raw.toLocaleDateString()];
      }
    },
  });

  doc.save(filename);
};
