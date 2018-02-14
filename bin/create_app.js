const fs = require('fs');
const spawn = require('child_process').spawn;
const beautify = require('js-beautify');
const Spinner = require('cli-spinner').Spinner;
const cwd = process.cwd();

const ERROR_PATH_EXISTS = 'App directory already exists';

const SUCCESS_TEXT = (name, path) => `
  Success! Created ${name} at ${path}

  To start your app, run:
    $ npm start

  To start your app in development mode with live reloading, run:
    $ npm run start:dev

  We suggest that you begin with the following commands:
    $ cd ${name}
    $ npm run start:dev

  \\m/ Hack The Planet! \\m/
`;

const beautifyOptions = { indent_size: 2 };

const create_app = name => {
  const path = `${cwd}/${name}`;
  if (fs.existsSync(path)) return console.error(ERROR_PATH_EXISTS);
  fs.mkdirSync(path);

  const package_text = require('./resources/app/package_template')(name);
  const package = beautify(package_text, beautifyOptions);
  fs.writeFileSync(`${path}/package.json`, package);

  const index_text = require('./resources/app/index_template')(name);
  const index = beautify(index_text, beautifyOptions);
  fs.writeFileSync(`${path}/index.js`, index);
  fs.writeFileSync(`${path}/.gitignore`, '/node_modules/');

  const install_spinner = new Spinner(`%s Creating new enmapi app: ${name}`);
  install_spinner.setSpinnerString(17);
  install_spinner.start();
  const install_enmapi = spawn(
    `cd ${path} && npm i enmapi && npm i -D nodemon`,
    {
      shell: true
    }
  );
  install_enmapi.on('exit', () => {
    install_spinner.stop(true);
    console.log(SUCCESS_TEXT(name, path));
  });
};

module.exports = create_app;
