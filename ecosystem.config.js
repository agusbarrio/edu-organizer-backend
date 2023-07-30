module.exports = {
  apps: [{
    script: 'index.js',
    env_production: {
      NODE_ENV: 'production'
    },
    env_qa: {
      NODE_ENV: 'qa'
    },
    env: {
      NODE_ENV: undefined
    }
  },],
};
