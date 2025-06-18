import * as XLSX from "xlsx";

export const exportToExcel = async (data, filename = "bookings") => {
  try {
    const exportData = data.map((booking) => ({
      Date: booking.date,
      Name: booking.name,
      Bay: booking.bay,
      Hours: booking.hours,
      "Start Time": booking.startTime,
      "End Time": booking.endTime,
      Players: booking.players,
      Members: booking.members,
      Guests: booking.guests,
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const columnWidths = [
      { wch: 12 }, // Date
      { wch: 20 }, // Name
      { wch: 8 }, // Bay
      { wch: 10 }, // Hours
      { wch: 12 }, // Start Time
      { wch: 12 }, // End Time
      { wch: 10 }, // Players
      { wch: 10 }, // Members
      { wch: 10 }, // Guests
    ];
    worksheet["!cols"] = columnWidths;

    // Style the header row
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Add borders to all cells
    for (let row = 0; row <= headerRange.e.r; row++) {
      for (let col = 0; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;

        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s.border = {
          top: { style: "thin", color: { rgb: "CCCCCC" } },
          bottom: { style: "thin", color: { rgb: "CCCCCC" } },
          left: { style: "thin", color: { rgb: "CCCCCC" } },
          right: { style: "thin", color: { rgb: "CCCCCC" } },
        };

        // Alternate row colors (excluding header)
        if (row > 0 && row % 2 === 0) {
          if (!worksheet[cellAddress].s.fill) {
            worksheet[cellAddress].s.fill = { fgColor: { rgb: "F9FAFB" } };
          }
        }
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Add metadata sheet
    const metadataSheet = XLSX.utils.json_to_sheet([
      {
        "Export Information": "Booking Data Export",
        "Generated On": new Date().toLocaleString(),
        "Total Records": data.length,
        "Exported By": "Booking Management System",
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Export Info");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    // Create blob and download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(
      `Successfully exported ${data.length} bookings to ${filename}.xlsx`
    );
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

export const exportUsersToExcel = async (users, filename = "users") => {
  try {
    // Prepare data for Excel export
    const exportData = users.map((user) => ({
      "Created At": user.createdAt,
      Name: user.name,
      Email: user.email,
      Membership: user.membership,
      "Account Status": user.accountStatus,
      "Subscription Status": user.subscriptionStatus,
      "Subscription Date": user.subscriptionDate || "",
      "Subscription Plan": user.subscriptionPlan || "",
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better formatting
    const columnWidths = [
      { wch: 12 }, // Created At
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 12 }, // Membership
      { wch: 15 }, // Account Status
      { wch: 18 }, // Subscription Status
      { wch: 15 }, // Subscription Date
      { wch: 18 }, // Subscription Plan
    ];
    worksheet["!cols"] = columnWidths;

    // Style the header row
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2563EB" } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Add borders to all cells
    for (let row = 0; row <= headerRange.e.r; row++) {
      for (let col = 0; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;

        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s.border = {
          top: { style: "thin", color: { rgb: "CCCCCC" } },
          bottom: { style: "thin", color: { rgb: "CCCCCC" } },
          left: { style: "thin", color: { rgb: "CCCCCC" } },
          right: { style: "thin", color: { rgb: "CCCCCC" } },
        };

        // Alternate row colors (excluding header)
        if (row > 0 && row % 2 === 0) {
          if (!worksheet[cellAddress].s.fill) {
            worksheet[cellAddress].s.fill = { fgColor: { rgb: "F9FAFB" } };
          }
        }
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Add metadata sheet
    const metadataSheet = XLSX.utils.json_to_sheet([
      {
        "Export Information": "Users Data Export",
        "Generated On": new Date().toLocaleString(),
        "Total Records": users.length,
        "Exported By": "User Management System",
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Export Info");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    // Create blob and download
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(
      `Successfully exported ${users.length} users to ${filename}.xlsx`
    );
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};
