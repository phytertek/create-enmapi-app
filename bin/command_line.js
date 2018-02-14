const CREATE_COMPONENT_FLAG = '-c';
const DOWNLOAD_COMPONENT_FLAG = '-t';

const HELP = '--help';
const HELP_TEXT = `
  Usage: create-enmapi-app [component flags] <app or component name> [options]

  App or component name is required

  If no component flags are specified, a new app will be created

  Component Flags (optional):
    -c      Create new component
    -t      Create component from specified template

  Options (optional):
    If options are specified, only the specified component files will be created
    If no options are specified, all component files will be created
    -schema     Create component schema file
    -routes     Create component routes and controllers files
    -services   Create component services file
`;

const ERROR_INVALID_NAME =
  'name must start with a letter or number and may only contain letters, numbers, underscores, and dashes';
const ERROR_INVALID_APP_NAME = `App ${ERROR_INVALID_NAME}`;
const ERROR_INVALID_COMPONENT_NAME = `Component ${ERROR_INVALID_NAME}`;
const ERROR_NO_NAME = 'name must be specified';
const ERROR_NO_APP_NAME = `App ${ERROR_NO_NAME}`;
const ERROR_NO_COMPONENT_NAME = `Component ${ERROR_NO_NAME}`;
const ERROR_NO_TEMPLATE_COMPONENT_NAME = `Component template name must be specified`;

const arg1 = process.argv[2];
const arg2 = process.argv[3];
const argsRest = process.argv.slice(4);

const validName = name => {
  return (
    /^([A-Za-z\-\_\d])+$/.test(name) && /^([A-Za-z\d])+$/.test(name.charAt(0))
  );
};

const new_component = (type, name, options) => {
  if (!name)
    return console.error(
      type === 'create_component'
        ? ERROR_NO_COMPONENT_NAME
        : ERROR_NO_TEMPLATE_COMPONENT_NAME
    );
  if (!validName(name)) return console.error(ERROR_INVALID_COMPONENT_NAME);
  return require(`./${type}`)(name, options);
};

const new_app = name => {
  if (!name) return console.error(ERROR_NO_APP_NAME);
  if (!validName(name)) return console.error(ERROR_INVALID_APP_NAME);
  return require('./create_app')(name);
};

switch (arg1) {
  case HELP:
    return console.log(HELP_TEXT);
  case CREATE_COMPONENT_FLAG:
    return new_component('create_component', arg2, argsRest);
  case DOWNLOAD_COMPONENT_FLAG:
    return new_component('download_component', arg2);
  default:
    return new_app(arg1);
}
