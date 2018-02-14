# create-enmapi-app

## Purpose

> The create-enmapi-app tool is intended to be an easy to use project and component generator for the enmapi framework

## Functionality

1. `create-enmapi-app <project_name>`
   * creates a new project directory with the project name
   * generates a package.json
   * installs the enmapi npm package
   * creates an index.js with the necessary import, config, and startup commands.
2. `create-enmapi-app -c <component_name> [options]`
   * component files can be specified with options (routes, schema, services)
   * creates a new directory with the component name
   * adds scaffolded files
3. `create-enmapi-app -t {component_name}`
   * searches the component template repository for the component specified
   * clones the component into the project directory

## Usage

`create-enmapi-app [component flags] <app or component name> [options]`

```
App or component name is required

If no component flags are specified, a new app will be created

Component Flags (optional):
  -c      Create new component
  -t      Create component from specified template

Options (optional):
  If options are specified, only the specified component files will be created
  If no options are specified, all component files will be created
  -schema       Create component schema file
  -routes       Create component routes and controllers files
  -services     Create component services file
```
