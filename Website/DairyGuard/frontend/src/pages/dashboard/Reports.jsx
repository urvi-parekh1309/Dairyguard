import React, { useState, useEffect } from 'react';
import { FileText, Download, Plus, Eye, CheckCircle2, Calendar, FileCheck2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import SensorStatusBadge from '../../components/dashboard/SensorStatusBadge';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [banner, setBanner] = useState(null);

  // Form state
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Report detail modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [rList, bList] = await Promise.all([
        api.reports.getAll(),
        api.batches.getAll().catch(() => [])
      ]);
      setReports(rList || []);
      setBatches(bList || []);
      if (bList && bList.length > 0 && !selectedBatchId) {
        setSelectedBatchId(bList[0].id);
      }
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to load reports: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const newReport = await api.reports.generate({
        batchId: selectedBatchId || null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      });
      setBanner({ type: 'success', message: 'Official Milk Transit Quality Report generated successfully!' });
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to generate report.' });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async (report) => {
    setDownloadingId(report.id);
    try {
      await api.reports.downloadPDF(report.id, `DairyGuard_Report_${report.batchId || 'Batch'}.pdf`);
      setBanner({ type: 'success', message: `Downloaded PDF report for Batch ${report.batchId}` });
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to download PDF: ' + err.message });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="dashboard-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Official Milk Quality & Transit Reports</h2>
          <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>
            Generate and export official PDF cold-chain certificates for plant unloading and regulatory audits
          </p>
        </div>
      </div>

      {banner && <AlertBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      {/* Generator Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <FileCheck2 size={22} style={{ color: '#10B981' }} />
          <h3 style={{ fontSize: '1.35rem' }}>Generate New Batch Report</h3>
        </div>

        <form onSubmit={handleGenerateReport} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          {/* Select Batch */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Milk Batch *</label>
            <select
              className="form-control"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              <option value="">-- General Cooperative Summary --</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batchId} ({b.milkQuantity}L - {b.source})
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date From</label>
            <input
              type="date"
              className="form-control"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date To</label>
            <input
              type="date"
              className="form-control"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '13px 22px', height: '48px', fontWeight: 700 }}
            disabled={generating}
          >
            <Plus size={18} />
            <span>{generating ? 'Compiling Report...' : 'Generate Official Report'}</span>
          </button>
        </form>
      </div>

      {/* Reports History */}
      <div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '18px' }}>Generated Reports Archive</h3>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#CBD5E1', fontSize: '1.05rem' }}>Loading reports...</div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No reports generated yet."
            description="Select an active batch above and click 'Generate Official Report' to create your first printable PDF report."
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Batch Ref</th>
                  <th>Generated Date</th>
                  <th>Milk Quantity</th>
                  <th>Risk Status</th>
                  <th>Avg Temp / pH</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td><strong style={{ fontSize: '1.02rem' }}>{r.id.slice(0, 10)}...</strong></td>
                    <td><span style={{ color: '#22D3EE', fontWeight: 600, fontSize: '1.02rem' }}>{r.batchId}</span></td>
                    <td style={{ fontSize: '0.95rem', color: '#CBD5E1' }}>
                      {new Date(r.createdAt).toLocaleDateString()} {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ fontSize: '1rem' }}>{r.milkQuantity} Liters</td>
                    <td>
                      <SensorStatusBadge status={r.spoilageRisk} />
                    </td>
                    <td style={{ fontSize: '0.98rem' }}>
                      {r.avgTemperature != null ? `${r.avgTemperature.toFixed(1)}°C` : 'N/A'} | {r.avgPh != null ? `${r.avgPh.toFixed(2)} pH` : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          title="View Summary"
                          onClick={() => { setSelectedReport(r); setIsDetailOpen(true); }}
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button 
                          className="btn btn-primary btn-sm"
                          title="Download Official PDF"
                          onClick={() => handleDownloadPDF(r)}
                          disabled={downloadingId === r.id}
                        >
                          <Download size={16} />
                          <span>{downloadingId === r.id ? 'Exporting...' : 'Download PDF'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Summary Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Report Details: ${selectedReport?.batchId || ''}`}
        maxWidth="600px"
        footer={
          selectedReport && (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => handleDownloadPDF(selectedReport)}
              disabled={downloadingId === selectedReport.id}
            >
              <Download size={14} />
              <span>Download PDF Certificate</span>
            </button>
          )
        }
      >
        {selectedReport && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', display: 'block' }}>COOPERATIVE</span>
                <strong>{selectedReport.dairyName}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', display: 'block' }}>SPOILAGE RISK</span>
                <SensorStatusBadge status={selectedReport.spoilageRisk} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><strong>Batch ID:</strong> {selectedReport.batchId}</div>
              <div><strong>Volume:</strong> {selectedReport.milkQuantity} Liters</div>
              <div><strong>Milk Type:</strong> {selectedReport.milkType}</div>
              <div><strong>Assigned Vehicle:</strong> {selectedReport.vehicleNumber}</div>
              <div><strong>Route:</strong> {selectedReport.source} &rarr; {selectedReport.destination}</div>
              <div><strong>Transit Status:</strong> {selectedReport.status}</div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', color: '#06B6D4' }}>Observed Telemetry Summary</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Average Temp</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34D399' }}>
                    {selectedReport.avgTemperature != null ? `${selectedReport.avgTemperature.toFixed(1)}°C` : 'N/A'}
                  </div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Average pH</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#06B6D4' }}>
                    {selectedReport.avgPh != null ? `${selectedReport.avgPh.toFixed(2)}` : 'N/A'}
                  </div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Average TDS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3B82F6' }}>
                    {selectedReport.avgTds != null ? `${Math.round(selectedReport.avgTds)} ppm` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
