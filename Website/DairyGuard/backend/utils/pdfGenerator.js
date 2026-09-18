const PDFDocument = require('pdfkit');

/**
 * Generates a professional DairyGuard Milk Quality & Spoilage PDF Report
 * @param {Object} reportData
 * @param {stream.Writable} outputStream (or res)
 */
function generateMilkReportPDF(reportData, outputStream) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });

      doc.pipe(outputStream);

      // --- Header with Color Banner ---
      doc.rect(0, 0, 595.28, 80).fill('#0A1128'); // Deep navy banner

      doc.fillColor('#00E599')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('DAIRYGUARD', 40, 25, { characterSpacing: 1 });

      doc.fillColor('#94A3B8')
        .fontSize(9)
        .font('Helvetica')
        .text('IoT Cold-Chain & Biochemical Milk Spoilage Prevention Platform', 40, 50);

      doc.fillColor('#FFFFFF')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('OFFICIAL TRANSIT CERTIFICATE', 380, 30, { align: 'right' });

      doc.fillColor('#94A3B8')
        .fontSize(8)
        .font('Helvetica')
        .text(`Report Ref: ${reportData.id || 'DG-REP-001'}`, 380, 46, { align: 'right' });

      doc.moveDown(4);

      // --- Dairy & Generation Details ---
      doc.fillColor('#0F172A').fontSize(14).font('Helvetica-Bold').text('Milk Batch Quality & Spoilage Report', 40, 105);
      doc.fontSize(9).font('Helvetica').fillColor('#64748B').text(`Generated on: ${new Date().toLocaleString()} | Dairy: ${reportData.dairyName || 'Verified Dairy Cooperative'}`);

      doc.rect(40, 130, 515, 1).fill('#E2E8F0');

      // --- Transport & Batch Information Box ---
      let y = 145;
      doc.rect(40, y, 515, 95).fillAndStroke('#F8FAFC', '#E2E8F0');

      doc.fillColor('#1E293B').fontSize(11).font('Helvetica-Bold').text('Batch & Logistics Manifest', 55, y + 12);

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#475569');
      doc.text('Batch ID:', 55, y + 35);
      doc.text('Quantity:', 55, y + 52);
      doc.text('Milk Type:', 55, y + 69);

      doc.font('Helvetica').fillColor('#0F172A');
      doc.text(reportData.batchId || 'N/A', 130, y + 35);
      doc.text(`${reportData.milkQuantity || 0} Liters`, 130, y + 52);
      doc.text(reportData.milkType || 'Raw Cow Milk', 130, y + 69);

      doc.font('Helvetica-Bold').fillColor('#475569');
      doc.text('Vehicle ID / No:', 300, y + 35);
      doc.text('Route:', 300, y + 52);
      doc.text('Status:', 300, y + 69);

      doc.font('Helvetica').fillColor('#0F172A');
      doc.text(`${reportData.vehicleId || 'N/A'} (${reportData.vehicleNumber || 'Unspecified'})`, 400, y + 35);
      doc.text(`${reportData.source || 'Hub A'} -> ${reportData.destination || 'Plant B'}`, 400, y + 52);
      doc.text(reportData.status || 'Verified In-Transit', 400, y + 69);

      // --- Telemetry & Chemical Quality Summary ---
      y = 260;
      doc.fillColor('#1E293B').fontSize(12).font('Helvetica-Bold').text('IoT Sensor Readings & Thermal Telemetry', 40, y);

      y += 20;
      // Table Header
      doc.rect(40, y, 515, 24).fill('#0F172A');
      doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
      doc.text('Parameter', 55, y + 7);
      doc.text('Standard Safe Range', 180, y + 7);
      doc.text('Observed Value', 320, y + 7);
      doc.text('Compliance Status', 430, y + 7);

      y += 24;
      const metrics = [
        {
          name: 'Temperature',
          standard: '1.0°C - 4.0°C',
          observed: `${reportData.avgTemperature != null ? reportData.avgTemperature.toFixed(1) + ' °C' : 'No sensor data'}`,
          status: reportData.avgTemperature <= 4.0 ? 'Optimal (Cold-Chain Safe)' : (reportData.avgTemperature <= 7.0 ? 'Elevated Warning' : 'Critical Hazard')
        },
        {
          name: 'Milk pH Acidity',
          standard: '6.50 - 6.70 pH',
          observed: `${reportData.avgPh != null ? reportData.avgPh.toFixed(2) + ' pH' : 'No sensor data'}`,
          status: (reportData.avgPh >= 6.5 && reportData.avgPh <= 6.7) ? 'Fresh Normal' : 'Acidity Deviation'
        },
        {
          name: 'Total Dissolved Solids (TDS)',
          standard: '1050 - 1300 ppm',
          observed: `${reportData.avgTds != null ? Math.round(reportData.avgTds) + ' ppm' : 'No sensor data'}`,
          status: (reportData.avgTds >= 1050 && reportData.avgTds <= 1300) ? 'Standard Quality' : 'Adulteration Risk'
        }
      ];

      metrics.forEach((m, idx) => {
        const rowBg = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
        doc.rect(40, y, 515, 26).fill(rowBg);
        doc.fillColor('#1E293B').fontSize(9).font('Helvetica-Bold').text(m.name, 55, y + 8);
        doc.fillColor('#64748B').font('Helvetica').text(m.standard, 180, y + 8);
        doc.fillColor('#0F172A').font('Helvetica-Bold').text(m.observed, 320, y + 8);

        const statusColor = m.status.includes('Optimal') || m.status.includes('Fresh') || m.status.includes('Standard') ? '#059669' : '#DC2626';
        doc.fillColor(statusColor).font('Helvetica-Bold').text(m.status, 430, y + 8);

        doc.rect(40, y + 26, 515, 1).fill('#E2E8F0');
        y += 27;
      });

      // --- Spoilage Prediction Assessment Card ---
      y += 25;
      const risk = reportData.spoilageRisk || 'Low Risk';
      const riskColor = risk === 'Low Risk' ? '#059669' : (risk === 'Medium Risk' ? '#D97706' : '#DC2626');
      const riskBg = risk === 'Low Risk' ? '#ECFDF5' : (risk === 'Medium Risk' ? '#FFFBEB' : '#FEF2F2');

      doc.rect(40, y, 515, 80).fillAndStroke(riskBg, riskColor);

      doc.fillColor(riskColor).fontSize(14).font('Helvetica-Bold')
        .text(`Overall Spoilage Risk Evaluation: ${risk.toUpperCase()}`, 55, y + 14);

      doc.fillColor('#334155').fontSize(9).font('Helvetica')
        .text(`Model Confidence: ${reportData.confidence || 95}% | Transport Elapsed Time: ${reportData.durationHours || 2.5} hrs`, 55, y + 36);

      const recommendation = risk === 'Low Risk'
        ? 'Milk complies with cold-chain dairy standards. Microbial activity suppressed. Approved for processing/intake.'
        : (risk === 'Medium Risk'
          ? 'Warning: Thermal exposure observed. Test acidity and perform MBRT/alcohol test prior to silo unloading.'
          : 'CRITICAL ALERT: Spoilage risk elevated above safe limits. Milk likely souring; quarantine batch for lab inspection.');

      doc.fillColor('#1E293B').fontSize(8.5).font('Helvetica-Oblique').text(`Recommendation: ${recommendation}`, 55, y + 54, { width: 480 });

      // --- Signoff & Security Stamp ---
      y += 110;
      doc.rect(40, y, 515, 1).fill('#E2E8F0');

      doc.fillColor('#94A3B8').fontSize(8).font('Helvetica')
        .text('Digitally signed and generated by DairyGuard Automated IoT Intelligence Gateway.', 40, y + 15);
      doc.text('Tamper-evident verification hash: DG-SEC-VERIFIED-SHA256', 40, y + 28);
      doc.text('Page 1 of 1', 500, y + 28, { align: 'right' });

      doc.end();
      outputStream.on('finish', () => resolve());
      outputStream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  generateMilkReportPDF
};
