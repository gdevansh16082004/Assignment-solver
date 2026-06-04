module.exports = {
  apps: [
    {
      name: 'express-api',
      script: './dist/index.js', 
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'bullmq-worker',
      script: './dist/worker.js', 
      env: { NODE_ENV: 'production' },
    }
  ],
};