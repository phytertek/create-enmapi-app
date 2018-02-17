const fs = require('fs');
const beautify = require('js-beautify');
const cwd = process.cwd();

const ERROR_PATH_EXISTS = 'Component directory already exists';

const standard_types = {
  schema: ['--schema', '-sc'],
  routes: ['--routes', '-rt'],
  controllers: ['--controllers', '-cn'],
  services: ['--services', '-sr']
};

const beautifyOptions = { indent_size: 2 };

const specified_types = types => {
  const specified = {};
  types.forEach(t => {
    Object.keys(standard_types).forEach(ft => {
      if (standard_types[ft].includes(t)) specified[ft] = true;
    });
  });
  return specified;
};

const create_files = (path, types) => {
  Object.keys(types).forEach(type => {
    const file_text = require(`../templates/component/${type}_template`);
    const file = beautify(file_text, beautifyOptions);
    fs.writeFileSync(`${path}/${type}.js`, file);
  });
};

const create_component = (name, types) => {
  const path = `${cwd}/${name}`;
  if (fs.existsSync(path)) return console.error(ERROR_PATH_EXISTS);
  fs.mkdirSync(path);
  const file_types = types.length ? specified_types(types) : standard_types;
  create_files(path, file_types);
  console.log(
    `${name} component created with ${Object.keys(file_types).join(', ')}`
  );
};

module.exports = create_component;
