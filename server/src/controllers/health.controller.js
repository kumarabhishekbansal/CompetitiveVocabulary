import { getDBStatus } from '../config/db.js';
import { config } from '../config/env.js';

export const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  const uptimeSeconds = Math.floor(process.uptime());

  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'competitive-vocabulary-api',
    version: '1.0.0',
    phase: 'Phase 1 - Foundation & Core Architecture',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    environment: config.nodeEnv,
    database: {
      status: dbStatus.state,
      readyState: dbStatus.readyState,
      databaseName: dbStatus.dbName,
      host: dbStatus.host
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    }
  });
};
