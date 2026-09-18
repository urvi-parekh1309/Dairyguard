import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Plus, 
  QrCode, 
  Upload, 
  Camera, 
  Eye, 
  Trash2, 
  Edit3, 
  FileCheck2, 
  Calendar, 
  Droplet 
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import SensorStatusBadge from '../../components/dashboard/SensorStatusBadge';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';
import QRScannerModal from '../../components/qr/QRScannerModal';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    batchId: '',
    vehicle: '',
    milkQuantity: '',
    milkType: 'Pure Cow Milk',
    source: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Collected'
  });

  const fetchData = async () => {
    try {
      const [bList, vList] = await Promise.all([
        api.batches.getAll(),
        api.vehicles.getAll().catch(() => [])
      ]);
      setBatches(bList || []);
      setVehicles(vList || []);
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to load batches: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      await api.batches.create(formData);
      setBanner({ type: 'success', message: 'Milk batch created successfully!' });
      setIsAddModalOpen(false);
      setFormData({
        batchId: '',
        vehicle: '',
        milkQuantity: '',
        milkType: 'Pure Cow Milk',
        source: '',
        destination: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Collected'
      });
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to create batch.' });
    }
  };

  const handleStatusChange = async (batchId, newStatus) => {
    try {
      await api.batches.update(batchId, { status: newStatus });
      setBanner({ type: 'success', message: `Batch status updated to ${newStatus}` });
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to update status.' });
    }
  };

  const handleDeleteBatch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this milk batch?')) return;
    try {
      await api.batches.delete(id);
      setBanner({ type: 'success', message: 'Batch removed.' });
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to delete batch.' });
    }
  };

  // Callback when QR scanner detects/uploads a batch payload
  const handleQRScanned = async (scannedData) => {
    try {
      await api.batches.create({
        batchId: scannedData.batchId,
        milkQuantity: scannedData.milkQuantity,
        milkType: scannedData.milkType || 'Standard Milk',
        source: scannedData.source,
        destination: scannedData.destination,
        date: scannedData.date || new Date().toISOString().split('T')[0],
        status: 'Collected'
      });
      setBanner({ type: 'success', message: `Imported Scanned Batch ${scannedData.batchId} successfully!` });
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to import scanned batch: ' + err.message });
    }
  };

  return (
    <div className="dashboard-body">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Milk Batches & Intake</h2>
          <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>
            Register milk collections, scan incoming delivery QR codes, and trace quality across checkpoints
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsQRModalOpen(true)}
          >
            <QrCode size={18} />
            <span>Scan / Upload QR</span>
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add New Batch</span>
          </button>
        </div>
      </div>

      {banner && <AlertBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      {/* Batches Listing */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#CBD5E1', fontSize: '1.05rem' }}>Loading batches...</div>
      ) : batches.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No milk batches created yet."
          description="Register your first milk collection batch or scan an incoming tank QR barcode."
          action={
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={18} />
                <span>Add New Batch</span>
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsQRModalOpen(true)}>
                <QrCode size={18} />
                <span>Scan QR Code</span>
              </button>
            </div>
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Milk Volume</th>
                <th>Assigned Vehicle</th>
                <th>Route (Source &rarr; Dest)</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id}>
                  <td><strong style={{ fontSize: '1.05rem' }}>{b.batchId}</strong></td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#34D399', fontSize: '1.05rem' }}>{b.milkQuantity} L</span>
                    <span style={{ fontSize: '0.88rem', color: '#CBD5E1', display: 'block', marginTop: '2px' }}>{b.milkType}</span>
                  </td>
                  <td style={{ fontSize: '1rem' }}>{b.vehicle || 'Unassigned'}</td>
                  <td style={{ fontSize: '0.98rem' }}>{b.source} &rarr; {b.destination}</td>
                  <td style={{ fontSize: '0.95rem', color: '#CBD5E1' }}>{new Date(b.date).toLocaleDateString()}</td>
                  <td>
                    <select
                      style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        padding: '6px 10px',
                        fontSize: '0.92rem',
                        cursor: 'pointer'
                      }}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    >
                      <option value="Collected">Collected</option>
                      <option value="In-Transit">In-Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        title="View Details"
                        onClick={() => { setSelectedBatch(b); setIsDetailModalOpen(true); }}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        title="Delete"
                        onClick={() => handleDeleteBatch(b.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 1. Add Batch Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Milk Batch"
      >
        <form onSubmit={handleCreateBatch}>
          <div className="form-group">
            <label className="form-label">Batch ID (Optional custom code)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. DG-B-2024"
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Milk Quantity (Liters) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="2500"
                value={formData.milkQuantity}
                onChange={(e) => setFormData({ ...formData, milkQuantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Milk Type</label>
              <select
                className="form-control"
                value={formData.milkType}
                onChange={(e) => setFormData({ ...formData, milkType: e.target.value })}
              >
                <option value="Pure Cow Milk">Pure Cow Milk</option>
                <option value="Buffalo Milk">Buffalo Milk</option>
                <option value="Mixed Raw Milk">Mixed Raw Milk</option>
                <option value="A2 Organic Cow Milk">A2 Organic Cow Milk</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Vehicle</label>
            <select
              className="form-control"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
            >
              <option value="Unassigned">-- Choose Vehicle (Optional) --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber} ({v.driverName})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Collection Source Point *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. BMC Hub 4"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Destination *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Silo Unit B"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Collection Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Collected">Collected</option>
                <option value="In-Transit">In-Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Batch
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onScanSuccess={handleQRScanned}
      />

      {/* 3. Detail View Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Batch Details: ${selectedBatch?.batchId || ''}`}
      >
        {selectedBatch && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div><strong>Batch ID:</strong> {selectedBatch.batchId}</div>
            <div><strong>Milk Quantity:</strong> {selectedBatch.milkQuantity} Liters</div>
            <div><strong>Milk Type:</strong> {selectedBatch.milkType}</div>
            <div><strong>Assigned Vehicle:</strong> {selectedBatch.vehicle || 'Unassigned'}</div>
            <div><strong>Source:</strong> {selectedBatch.source}</div>
            <div><strong>Destination:</strong> {selectedBatch.destination}</div>
            <div><strong>Date:</strong> {new Date(selectedBatch.date).toLocaleDateString()}</div>
            <div><strong>Status:</strong> <SensorStatusBadge status={selectedBatch.status} /></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
