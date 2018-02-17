module.exports = name =>
  JSON.stringify({
    name,
    version: '0.1.0',
    private: true,
    scripts: {
      start: 'node index.js',
      'start:dev': 'nodemon index.js'
    }
  });
