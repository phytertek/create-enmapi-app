#! /usr/bin/env node
const COMPONENT = ['--component', '-c'];
const TEMPLATE = ['--template', '-t'];

const VERSION = ['--version', '-v'];
const getCurrentVersion = () => require('../package.json').version;

const AUTH = ['--auth', '-a'];

const HELP = ['--help', '-h'];
const HELP_TEXT = `
  Usage: create-enmapi-app [component flags] <app or component name> [options]

  App or component name is required

  If no component flags are specified, a new app will be created

  Component Flags:
    -c, --component      Create new component
    -t, --template       Create component from specified template

  App Options:
    -a, --auth           Include auth template component

  Component Options:
    If options are specified, only the specified component files will be created
    If no options are specified, all component files will be created
    -sc, --schema        Create component schema file
    -rt, --routes        Create component routes file
    -cn, --controllers   Create component controllers file
    -sr, --services      Create component services file
`;

const ERROR_INVALID_NAME = `name must start with a letter and may only contain letters, numbers, underscores, and dashes`;
const ERROR_INVALID_APP_NAME = `App ${ERROR_INVALID_NAME}`;
const ERROR_INVALID_COMPONENT_NAME = `Component ${ERROR_INVALID_NAME}`;
const ERROR_NO_NAME = 'name must be specified';
const ERROR_NO_APP_NAME = `App ${ERROR_NO_NAME}`;
const ERROR_NO_COMPONENT_NAME = `Component ${ERROR_NO_NAME}`;
const ERROR_NO_TEMPLATE_NAME = `Component template name must be specified`;

const arg1 = process.argv[2];
const arg2 = process.argv[3];
const argsRest = process.argv.slice(4);

const validName = name => {
  return (
    /^([A-Za-z\-\_\d])+$/.test(name) && /^([A-Za-z])+$/.test(name.charAt(0))
  );
};

const new_component = (type, name, options) => {
  if (!name)
    return console.error(
      type === 'create_component'
        ? ERROR_NO_COMPONENT_NAME
        : ERROR_NO_TEMPLATE_NAME
    );
  if (!validName(name)) return console.error(ERROR_INVALID_COMPONENT_NAME);
  return require(`../lib/${type}`)(name, options);
};

const new_app = name => {
  if (!name) return console.error(ERROR_NO_APP_NAME);
  if (!validName(name)) return console.error(ERROR_INVALID_APP_NAME);
  return require('../lib/create_app')(name);
};

switch (true) {
  case VERSION.includes(arg1):
    return console.log(getCurrentVersion());
  case HELP.includes(arg1):
    return console.log(HELP_TEXT);
  case COMPONENT.includes(arg1):
    return new_component('create_component', arg2, argsRest);
  case TEMPLATE.includes(arg1):
    return new_component('template_component', arg2, argsRest);
  default:
    return new_app(arg1, arg2);
}
