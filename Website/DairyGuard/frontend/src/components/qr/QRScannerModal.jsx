import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'upload'
  const [scanning, setScanning] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera when camera tab is open
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setStreamError(null);
    setScanning(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setStreamError('Camera access not supported by your current browser.');
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setStreamError('Unable to access device camera. Please grant camera permission or use the "Upload QR Image" option below.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  // Simulate scanning a verified batch QR payload
  const handleSimulateScan = () => {
    const sampleBatchData = {
      batchId: 'DG-B-' + Math.floor(1000 + Math.random() * 9000),
      milkQuantity: 2500,
      milkType: 'Pure Buffalo Milk',
      source: 'Central Chilling Center (Hub #3)',
      destination: 'Apex Processing Silo 4',
      date: new Date().toISOString().split('T')[0]
    };
    setScannedResult(sampleBatchData);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate reading QR code from image file
    const reader = new FileReader();
    reader.onload = () => {
      // In production, jsQR or html5-qrcode scans reader.result
      const sampleBatchData = {
        batchId: 'DG-B-' + Math.floor(1000 + Math.random() * 9000),
        milkQuantity: 1800,
        milkType: 'Cow Milk A2',
        source: 'Greenfield Dairy Cooperative',
        destination: 'Metro Distribution Hub',
        date: new Date().toISOString().split('T')[0]
      };
      setScannedResult(sampleBatchData);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmBatch = () => {
    if (scannedResult) {
      onScanSuccess(scannedResult);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setScannedResult(null);
    setStreamError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Scan Milk Batch QR Code"
      maxWidth="500px"
      footer={
        scannedResult ? (
          <button className="btn btn-primary" onClick={handleConfirmBatch}>
            <CheckCircle2 size={16} />
            <span>Import Scanned Batch</span>
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        )
      }
    >
      {/* Scanner Mode Switch */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'camera' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => { setScannedResult(null); setActiveTab('camera'); }}
        >
          <Camera size={16} />
          <span>Live Camera</span>
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => { stopCamera(); setScannedResult(null); setActiveTab('upload'); }}
        >
          <Upload size={16} />
          <span>Upload QR Code</span>
        </button>
      </div>

      {scannedResult ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', marginBottom: '14px', fontWeight: 600 }}>
            <CheckCircle2 size={20} />
            <span>QR Code Decoded Successfully</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <div><strong>Batch ID:</strong> {scannedResult.batchId}</div>
            <div><strong>Quantity:</strong> {scannedResult.milkQuantity} Liters</div>
            <div><strong>Milk Type:</strong> {scannedResult.milkType}</div>
            <div><strong>Source:</strong> {scannedResult.source}</div>
            <div><strong>Destination:</strong> {scannedResult.destination}</div>
          </div>

          <button 
            className="btn btn-secondary btn-sm" 
            style={{ marginTop: '16px', width: '100%' }}
            onClick={() => setScannedResult(null)}
          >
            <RefreshCw size={14} />
            <span>Scan Another Code</span>
          </button>
        </div>
      ) : activeTab === 'camera' ? (
        <div className="qr-scanner-box">
          {streamError ? (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <AlertCircle size={32} style={{ color: '#F59E0B', margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontSize: '0.85rem', color: '#F59E0B', marginBottom: '16px' }}>{streamError}</p>
              <button className="btn btn-outline btn-sm" onClick={handleSimulateScan}>
                Simulate Camera QR Detection
              </button>
            </div>
          ) : (
            <>
              <div style={{ position: 'relative', width: '100%', height: '240px', background: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', border: '2px solid #06B6D4', width: '160px', height: '160px', borderRadius: '12px', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }} />
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Position the milk batch QR code inside the viewfinder.</p>
              <button className="btn btn-outline btn-sm" onClick={handleSimulateScan}>
                Trigger Instant QR Capture (Test)
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="qr-scanner-box">
          <QrCode size={48} style={{ color: '#06B6D4' }} />
          <p style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500 }}>Select a QR code image to parse batch</p>
          <input
            type="file"
            accept="image/*"
            id="qr-file-input"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <label htmlFor="qr-file-input" className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Choose QR Image File</span>
          </label>
        </div>
      )}
    </Modal>
  );
}
