import { appConfig } from './app.config';

export const devConfig = {
  // Development mode settings
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API settings
  api: {
    rateLimit: {
      windowMs: 60000, // 1 minute
      max: 100 // limit each IP to 100 requests per windowMs
    },
  },
  
  // Logging settings
  logging: {
    firebasePrefix: '🔥',
  }
};

export default devConfig; 