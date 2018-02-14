const fs = require('fs');
const beautify = require('js-beautify');
const cwd = process.cwd();

const ERROR_PATH_EXISTS = 'Component directory already exists';

const ROUTES = '-routes';
const CONTROLLERS = '-controllers';
const SCHEMA = '-schema';
const SERVICES = '-services';

const valid_file_types = [ROUTES, CONTROLLERS, SCHEMA, SERVICES];

const beautifyOptions = { indent_size: 2 };

const create_file = (path, type) => {
  const file_text = require(`./resources/component/${type}_template`);
  const file = beautify(file_text, beautifyOptions);
  fs.writeFileSync(`${path}/${type}.js`, file);
};

const create_component = (name, types) => {
  const path = `${cwd}/${name}`;
  if (fs.existsSync(path)) return console.error(ERROR_PATH_EXISTS);
  fs.mkdirSync(path);
  if (types.length) {
    if (types.includes(ROUTES) && !types.includes(CONTROLLERS))
      types.push(CONTROLLERS);
    types
      .filter(t => valid_file_types.includes(t))
      .forEach(type => create_file(path, type.slice(1)));
  } else {
    valid_file_types.forEach(type => create_file(path, type.slice(1)));
  }
};
module.exports = create_component;
