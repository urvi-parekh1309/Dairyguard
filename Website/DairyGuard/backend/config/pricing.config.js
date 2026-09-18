/**
 * DairyGuard Subscription Pricing Configuration
 * Centralized location to modify device hardware costs, monthly subscription fees,
 * and enabled feature sets for all tiers.
 */
module.exports = {
  plans: [
    {
      id: 'spoilage-guard',
      name: 'Spoilage Guard',
      tagline: 'Essential thermal & cold-chain monitoring for logistics',
      badge: 'Cold-Chain Focus',
      deviceCost: 4999, // INR / Currency unit
      monthlyCost: 999,
      billingCycle: 'monthly',
      currency: '₹',
      features: [
        'Real-Time Temperature Monitoring',
        'AI Milk Spoilage Prediction',
        'Cold-Chain Route Integrity Tracking',
        'Instant SMS & In-App Spoilage Alerts',
        'Automated Spoilage Incident Reports',
        'ESP32 Thermal Sensor Kit Support',
        'Standard Email & Chat Support'
      ],
      sensorCapabilities: ['temperature'],
      isPopular: false
    },
    {
      id: 'quality-guard',
      name: 'Quality Guard',
      tagline: 'Comprehensive chemical & biochemical milk quality assurance',
      badge: 'Quality Focus',
      deviceCost: 6499,
      monthlyCost: 1299,
      billingCycle: 'monthly',
      currency: '₹',
      features: [
        'Precision pH Acidity Monitoring',
        'TDS / Electrical Conductivity (EC) Tracking',
        'Milk Quality Degradation Analytics',
        'Adulteration & Dilution Indicators',
        'Batch Quality Inspection Reports',
        'Chemical Sensor Kit Support',
        'Priority Technical Support'
      ],
      sensorCapabilities: ['ph', 'tds'],
      isPopular: false
    },
    {
      id: 'dairyguard-complete',
      name: 'DairyGuard Complete',
      tagline: 'End-to-end full cold-chain telemetry and biochemical quality assurance',
      badge: 'Recommended',
      deviceCost: 8999,
      monthlyCost: 1899,
      billingCycle: 'monthly',
      currency: '₹',
      features: [
        'All Spoilage Guard Features (Temperature + Spoilage Prediction)',
        'All Quality Guard Features (pH + TDS/EC + Quality Analytics)',
        'Unified Cold-Chain & Quality Control Dashboard',
        'High-Frequency ESP32 Multi-Sensor Telemetry',
        'Automated Compliance & Spoilage PDF Certificates',
        'Unlimited Vehicle & Milk Batch Tracking',
        '24/7 Dedicated Dairy Support & Calibration Assistance'
      ],
      sensorCapabilities: ['temperature', 'ph', 'tds'],
      isPopular: true
    }
  ]
};
