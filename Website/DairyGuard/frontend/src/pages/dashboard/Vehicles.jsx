import React, { useState, useEffect } from 'react';
import { Truck, Plus, CheckCircle2, AlertCircle, Link2, Eye, Trash2, MapPin, User, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import SensorStatusBadge from '../../components/dashboard/SensorStatusBadge';
import EmptyState from '../../components/common/EmptyState';
import AlertBanner from '../../components/common/AlertBanner';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    vehicleId: '',
    vehicleNumber: '',
    driverName: '',
    source: '',
    destination: '',
    status: 'Active'
  });

  const fetchData = async () => {
    try {
      const [vList, bList] = await Promise.all([
        api.vehicles.getAll(),
        api.batches.getAll().catch(() => [])
      ]);
      setVehicles(vList || []);
      setBatches(bList || []);
    } catch (err) {
      setBanner({ type: 'danger', message: 'Failed to load vehicles: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.vehicles.create(formData);
      setBanner({ type: 'success', message: 'Vehicle registered successfully!' });
      setIsAddModalOpen(false);
      setFormData({ vehicleId: '', vehicleNumber: '', driverName: '', source: '', destination: '', status: 'Active' });
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to add vehicle.' });
    }
  };

  const handleAssignBatch = async () => {
    if (!selectedVehicle || !selectedBatchId) return;
    try {
      await api.vehicles.assignBatch(selectedVehicle.id, selectedBatchId);
      setBanner({ type: 'success', message: `Batch assigned to ${selectedVehicle.vehicleNumber} successfully!` });
      setIsAssignModalOpen(false);
      setSelectedBatchId('');
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to assign batch.' });
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.vehicles.delete(id);
      setBanner({ type: 'success', message: 'Vehicle deleted.' });
      fetchData();
    } catch (err) {
      setBanner({ type: 'danger', message: err.message || 'Failed to delete vehicle.' });
    }
  };

  return (
    <div className="dashboard-body">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Transport Logistics & Fleet</h2>
          <p style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>
            Manage milk transport tankers, drivers, live transit routes, and assigned batches
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Vehicle</span>
        </button>
      </div>

      {banner && <AlertBanner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

      {/* Vehicles Listing */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#CBD5E1', fontSize: '1.05rem' }}>Loading fleet...</div>
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No transport vehicles registered yet."
          description="Register your insulated milk tankers or collection trucks to begin tracking cold-chain logistics."
          action={
            <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} />
              <span>Register First Vehicle</span>
            </button>
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Vehicle Number</th>
                <th>Driver Name</th>
                <th>Route (Source &rarr; Dest)</th>
                <th>Status</th>
                <th>Current Batch</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td><strong style={{ fontSize: '1.05rem' }}>{v.vehicleId}</strong></td>
                  <td style={{ fontSize: '1.02rem' }}>{v.vehicleNumber}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                      <User size={16} color="#CBD5E1" />
                      <span>{v.driverName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.98rem' }}>
                      <MapPin size={16} color="#06B6D4" />
                      <span>{v.source || 'Hub'} &rarr; {v.destination || 'Plant'}</span>
                    </div>
                  </td>
                  <td>
                    <SensorStatusBadge status={v.status} />
                  </td>
                  <td>
                    {v.currentBatch ? (
                      <span style={{ color: '#22D3EE', fontWeight: 600, fontSize: '1rem' }}>{v.currentBatch}</span>
                    ) : (
                      <span style={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '0.95rem' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        title="Assign Batch"
                        onClick={() => { setSelectedVehicle(v); setIsAssignModalOpen(true); }}
                      >
                        <Link2 size={16} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        title="View Details"
                        onClick={() => { setSelectedVehicle(v); setIsDetailModalOpen(true); }}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        title="Delete"
                        onClick={() => handleDeleteVehicle(v.id)}
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

      {/* 1. Add Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Transport Vehicle"
      >
        <form onSubmit={handleAddVehicle}>
          <div className="form-group">
            <label className="form-label">Vehicle ID (Optional Code)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. DG-V-101"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle Registration Number *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. GJ-01-AB-1234"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Driver Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Mohan Singh"
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Source Route Point</label>
              <input
                type="text"
                className="form-control"
                placeholder="Village Chilling Hub A"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Destination Point</label>
              <input
                type="text"
                className="form-control"
                placeholder="Central Processing Plant"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="In-Transit">In-Transit</option>
              <option value="Idle">Idle</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Assign Batch Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Milk Batch to ${selectedVehicle?.vehicleNumber || 'Vehicle'}`}
      >
        <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: '#94A3B8' }}>
          Assign an active milk batch to link real-time cold-chain tracking with this vehicle.
        </div>

        {batches.length === 0 ? (
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '12px' }}>
              No milk batches registered yet. Please create a milk batch first.
            </p>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Select Milk Batch</label>
            <select
              className="form-control"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              <option value="">-- Choose a Batch --</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batchId} ({b.milkQuantity} L - {b.source} to {b.destination})
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleAssignBatch}
            disabled={!selectedBatchId}
          >
            Confirm Assignment
          </button>
        </div>
      </Modal>

      {/* 3. Vehicle Detail View Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Vehicle Details: ${selectedVehicle?.vehicleNumber || ''}`}
      >
        {selectedVehicle && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div><strong>Vehicle ID:</strong> {selectedVehicle.vehicleId}</div>
            <div><strong>Registration Number:</strong> {selectedVehicle.vehicleNumber}</div>
            <div><strong>Driver:</strong> {selectedVehicle.driverName}</div>
            <div><strong>Origin:</strong> {selectedVehicle.source || 'Hub'}</div>
            <div><strong>Destination:</strong> {selectedVehicle.destination || 'Plant'}</div>
            <div><strong>Status:</strong> <SensorStatusBadge status={selectedVehicle.status} /></div>
            <div><strong>Current Batch:</strong> {selectedVehicle.currentBatch || 'None assigned'}</div>
            <div><strong>Hardware Node ID:</strong> {selectedVehicle.temperatureSensorId || 'ESP32-TH-STD'}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
