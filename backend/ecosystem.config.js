module.exports = {
  apps: [
    {
      name: 'express-api',
      script: 'ts-node',
      args: 'index.ts',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'bullmq-worker',
      script: 'ts-node',
      args: 'worker.ts',
      env: {
        NODE_ENV: 'production',
      },
    }
  ],
};