module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: 'mongodb://localhost:27017/snippet-app',
    jwtSecret: 'snippet-app-secret',
  };
  