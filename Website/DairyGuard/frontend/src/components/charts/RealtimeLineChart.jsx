import React from 'react';

export default function RealtimeLineChart({ 
  title, 
  data = [], 
  dataKey = 'value', 
  unit = '', 
  color = '#06B6D4',
  height = 200,
  minVal = null,
  maxVal = null
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.08)' }}>
        <span style={{ fontSize: '0.88rem', color: '#64748B', fontStyle: 'italic' }}>
          No telemetry readings recorded for this interval.
        </span>
      </div>
    );
  }

  // Calculate SVG bounds
  const values = data.map(d => Number(d[dataKey]));
  const computedMin = minVal !== null ? minVal : Math.min(...values);
  const computedMax = maxVal !== null ? maxVal : Math.max(...values);
  const range = computedMax === computedMin ? 1 : computedMax - computedMin;

  const width = 600;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Compute SVG Points
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - ((Number(d[dataKey]) - computedMin) / range) * chartHeight;
    return { x, y, val: d[dataKey], label: d.label || '' };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div style={{ width: '100%' }}>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
          <span>{title}</span>
          <span style={{ color }}>Latest: {data[data.length - 1][dataKey]} {unit}</span>
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: `${height}px`, overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid Horizontal Guidelines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
        <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

        {/* Value Labels on Y-axis */}
        <text x={padding - 8} y={padding + 4} fill="#64748B" fontSize="10" textAnchor="end">{computedMax.toFixed(1)}</text>
        <text x={padding - 8} y={height - padding} fill="#64748B" fontSize="10" textAnchor="end">{computedMin.toFixed(1)}</text>

        {/* Filled Area */}
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Points */}
        {points.map((pt, idx) => (
          <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#0B0F17" stroke={color} strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}
