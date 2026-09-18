/**
 * DairyGuard Frontend Subscription Configuration
 * Modify plan names, one-time hardware device costs, monthly subscription fees,
 * and feature lists in this single file.
 */
export const SUBSCRIPTION_PLANS = [
  {
    id: 'spoilage-guard',
    name: 'Spoilage Guard',
    tagline: 'Essential thermal & cold-chain monitoring for logistics',
    badge: 'Cold-Chain Focus',
    deviceCost: 4999,
    monthlyCost: 999,
    currency: '₹',
    features: [
      'Real-Time Temperature Monitoring',
      'AI Milk Spoilage Prediction',
      'Cold-Chain Route Integrity Tracking',
      'Instant SMS & In-App Spoilage Alerts',
      'Automated Spoilage Incident Reports',
      'ESP32 Thermal Sensor Kit Included',
      'Standard Email & Chat Support'
    ],
    capabilities: ['temperature'],
    highlight: false
  },
  {
    id: 'quality-guard',
    name: 'Quality Guard',
    tagline: 'Comprehensive biochemical milk quality & purity assurance',
    badge: 'Quality Focus',
    deviceCost: 6499,
    monthlyCost: 1299,
    currency: '₹',
    features: [
      'Precision pH Acidity Monitoring',
      'TDS / Electrical Conductivity (EC) Tracking',
      'Milk Quality Degradation Analytics',
      'Adulteration & Dilution Indicators',
      'Batch Quality Inspection Reports',
      'High-Sensitivity Chemical Sensor Probe',
      'Priority Technical Support'
    ],
    capabilities: ['ph', 'tds'],
    highlight: false
  },
  {
    id: 'dairyguard-complete',
    name: 'DairyGuard Complete',
    tagline: 'End-to-end full cold-chain telemetry and biochemical quality assurance',
    badge: 'Most Popular',
    deviceCost: 8999,
    monthlyCost: 1899,
    currency: '₹',
    features: [
      'All Spoilage Guard Features (Temperature + Spoilage Prediction)',
      'All Quality Guard Features (pH + TDS/EC + Quality Analytics)',
      'Unified Cold-Chain & Quality Control Dashboard',
      'Multi-Probe ESP32 IoT Hardware Gateway',
      'Automated Official PDF Quality Certificates',
      'Unlimited Vehicles & Batches Tracking',
      '24/7 Dedicated Dairy Support & Calibration Assistance'
    ],
    capabilities: ['temperature', 'ph', 'tds'],
    highlight: true
  }
];
