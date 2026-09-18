const app = require('./app');
const config = require('./config/default');

const store = require('./repositories/inMemoryStore');

const PORT = config.port;

const startServer = async () => {
  try {
    await store.seedDemoData();
  } catch (err) {
    console.error('Warning: Seed demo data encountered error:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🥛 DairyGuard IoT Backend Server is Online`);
    console.log(`🚀 Port: ${PORT}`);
    console.log(`🌐 Environment: ${config.nodeEnv}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Demo Login: demo@dairyguard.com / password123`);
    console.log('====================================================');
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server gracefully.');
    server.close(() => {
      console.log('HTTP server closed.');
    });
  });
};

startServer();
