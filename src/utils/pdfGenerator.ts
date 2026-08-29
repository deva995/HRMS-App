import { jsPDF } from 'jspdf';
import { Employee, Payslip, Organization } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generatePayslipPdf(
  payslip: Payslip,
  employee: Employee,
  org: Organization
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Watermark (Required: "Sample / Demo Data")
  doc.saveGraphicsState();
  doc.setFontSize(42);
  doc.setTextColor(230, 230, 230);
  doc.setFont('helvetica', 'bold');
  // Rotate watermark across the page
  const text = 'SAMPLE / DEMO DATA';
  doc.text(text, pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45,
  });
  doc.restoreGraphicsState();

  // Header Banner
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(org.name.toUpperCase(), 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Salary Payslip — ${payslip.month} ${payslip.year}`, 14, 22);

  // Subtitle / Note
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(
    'PROTOTYPE DEMO: Illustrative math only. Not statutory compliant.',
    pageWidth - 14,
    22,
    { align: 'right' }
  );

  // Employee Information Box
  let y = 38;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 38, 2, 2, 'FD');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);

  // Left Column
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Name:', 18, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.name, 52, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Employee ID:', 18, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.employeeCode, 52, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 18, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.email, 52, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Bank Account:', 18, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.bankDetailsMasked, 52, y + 32);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.text('Joining Date:', 110, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.joiningDate, 142, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Employment Type:', 110, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.employmentType, 142, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Pay Period:', 110, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${payslip.month} ${payslip.year}`, 142, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Generated On:', 110, y + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-IN'), 142, y + 32);

  // Earnings & Deductions Table
  y = 86;
  const colWidth = (pageWidth - 28) / 2;

  // Earnings Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, colWidth - 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('EARNINGS', 18, y + 5.5);
  doc.text('AMOUNT (INR)', 14 + colWidth - 6, y + 5.5, { align: 'right' });

  // Deductions Header
  doc.rect(14 + colWidth + 2, y, colWidth - 2, 8, 'F');
  doc.text('DEDUCTIONS', 18 + colWidth + 2, y + 5.5);
  doc.text('AMOUNT (INR)', pageWidth - 18, y + 5.5, { align: 'right' });

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const earnings = [
    { label: 'Basic Salary', val: payslip.basic },
    { label: 'House Rent Allowance (HRA)', val: payslip.hra },
    { label: 'Special / Other Allowances', val: payslip.specialAllowances },
    { label: 'Performance Bonus / Incentives', val: payslip.performanceBonus },
  ];

  const deductions = [
    { label: 'Provident Fund (PF @ 12%)', val: payslip.providentFund },
    { label: 'Professional Tax (PT)', val: payslip.professionalTax },
    { label: 'Tax Deducted at Source (TDS)', val: payslip.taxDeductedAtSource },
  ];

  const maxRows = Math.max(earnings.length, deductions.length);
  for (let i = 0; i < maxRows; i++) {
    const rowY = y + i * 8;

    // Draw row bottom line
    doc.setDrawColor(241, 245, 249);
    doc.line(14, rowY + 3, 14 + colWidth - 2, rowY + 3);
    doc.line(14 + colWidth + 2, rowY + 3, pageWidth - 14, rowY + 3);

    if (earnings[i]) {
      doc.text(earnings[i].label, 18, rowY);
      doc.text(formatINR(earnings[i].val), 14 + colWidth - 6, rowY, { align: 'right' });
    }
    if (deductions[i]) {
      doc.text(deductions[i].label, 18 + colWidth + 2, rowY);
      doc.text(formatINR(deductions[i].val), pageWidth - 18, rowY, { align: 'right' });
    }
  }

  y += maxRows * 8 + 4;

  // Subtotals
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, colWidth - 2, 8, 'F');
  doc.rect(14 + colWidth + 2, y, colWidth - 2, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.text('Gross Earnings', 18, y + 5.5);
  doc.text(formatINR(payslip.grossEarnings), 14 + colWidth - 6, y + 5.5, { align: 'right' });

  doc.text('Total Deductions', 18 + colWidth + 2, y + 5.5);
  doc.text(formatINR(payslip.totalDeductions), pageWidth - 18, y + 5.5, { align: 'right' });

  // Net Pay Highlight Box
  y += 16;
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setTextColor(67, 56, 202); // indigo-700
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('NET SALARY PAYABLE:', 20, y + 9);

  doc.setFontSize(14);
  doc.text(formatINR(payslip.netPayable), 20, y + 17);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Disbursed via Electronic Direct Deposit / NEFT', pageWidth - 20, y + 13, { align: 'right' });

  // Footer
  y = pageHeight - 20;
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('This is a computer-generated simulated prototype payslip. No signature is required.', 14, y);
  doc.text(`Tenant: ${org.name} | Org ID: ${org.id}`, pageWidth - 14, y, { align: 'right' });

  // Trigger download
  doc.save(`Payslip_${employee.employeeCode}_${payslip.month}_${payslip.year}.pdf`);
}
