/**
 * Standard Dairy Science Quality & Spoilage Thresholds
 * Reference: International Dairy Federation (IDF) & Food Safety Standards
 */
module.exports = {
  temperature: {
    unit: '°C',
    optimalMin: 1.0,
    optimalMax: 4.0,
    warningMax: 7.0, // Mild microbial multiplication begins
    criticalMax: 10.0 // Rapid lactic acid bacteria proliferation
  },
  ph: {
    unit: 'pH',
    optimalMin: 6.5,
    optimalMax: 6.7,
    warningLow: 6.4,
    criticalLow: 6.2, // Sour milk / curding danger threshold
    warningHigh: 6.8,
    criticalHigh: 7.0 // Mastitis or alkaline adulteration
  },
  tds: {
    unit: 'ppm',
    optimalMin: 1050,
    optimalMax: 1300,
    warningLow: 950,
    criticalLow: 850, // Dilution / water adulteration
    warningHigh: 1400,
    criticalHigh: 1550 // Neutralizer / salt adulteration
  }
};
