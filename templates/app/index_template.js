module.exports = name => {
  return `const enmapi = require('enmapi');

enmapi.server.setConfig({
  Level: process.env.NODE_ENV || 'development',
  Name: process.env.NAME || '${name} component repo',
  Host: process.env.HOST || 'http://localhost',
  Port: process.env.PORT || 3333,
  DatabaseName: process.env.DBNAME || '${name} DB',
  DatabaseURI:
    process.env.DB_URI ||
    'mongodb://localhost/${name}-db'
});

enmapi.server.start();`;
};
