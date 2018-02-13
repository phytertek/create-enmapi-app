# create-enmapi-app

## Purpose

> The create-enmapi-app tool is intended to be an easy to use project and component generator for the enmapi framework

## Functionality

1. `create-enmapi-app {project_name}`
   * creates a new project directory with the project name
   * generates a package.json
   * installs the enmapi npm package
   * creates an index.js with the necessary import, config, and startup commands.
2. `create-enmapi-app-component {component_name}`
   * asks for what types of functionality you'll be needing for the component (routes, schema, services)
   * creates a new directory with the component name
   * adds scaffolded files for the selected functionality
3. `create-enmapi-app-template {component_name}`
   * searches the component template repository for the component specified
   * clones the component into the project directory
