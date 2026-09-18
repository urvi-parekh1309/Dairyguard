import React from 'react';

export default function SpoilageRiskGauge({ score = 15, level = 'Low Risk', confidence = 95 }) {
  // Score 0 to 100 mapped to angle (-90deg to 90deg)
  const clampedScore = Math.max(0, Math.min(100, score));
  const rotation = -90 + (clampedScore / 100) * 180;

  const getColor = () => {
    if (level === 'Low Risk') return '#10B981';
    if (level === 'Medium Risk') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
      <div style={{ position: 'relative', width: '220px', height: '110px', overflow: 'hidden' }}>
        {/* Semi-circle track */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'conic-gradient(from 180deg at 50% 50%, #10B981 0deg 60deg, #F59E0B 60deg 120deg, #EF4444 120deg 180deg, transparent 180deg 360deg)',
            opacity: 0.25
          }} 
        />
        
        {/* Needle pointer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: '4px',
            height: '90px',
            background: getColor(),
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: '2px',
            boxShadow: `0 0 10px ${getColor()}`
          }}
        />

        {/* Center pivot */}
        <div
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
          }}
        />
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: getColor(), fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
          {level.toUpperCase()}
        </div>
        <div style={{ fontSize: '0.95rem', color: '#CBD5E1', marginTop: '4px' }}>
          Spoilage Index: <strong style={{ color: '#FFFFFF' }}>{score}/100</strong> | Confidence: <strong style={{ color: '#FFFFFF' }}>{confidence}%</strong>
        </div>
      </div>
    </div>
  );
}
