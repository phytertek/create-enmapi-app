const cmd = require('child_process').execSync;

let yarnInstalled;

try {
  cmd('yarn bin').toString();
  yarnInstalled = true;
} catch (error) {
  yarnInstalled = false;
}

module.exports = yarnInstalled;
