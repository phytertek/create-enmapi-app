const fs = require('fs');
const axios = require('axios');
const beautify = require('js-beautify');
const yarnInstalled = require('./utilities/check_yarn');
const HOST = 'https://pure-shelf-61025.herokuapp.com';
const cwd = process.cwd();
const spawn = require('child_process').spawn;

const beautifyOptions = {
  indent_size: 2
};

const standard_types = {
  alias: ['--alias', '-a']
};

const getComponentFromRepo = async name => {
  try {
    const component = await axios.get(`${HOST}/component/get/${name}`);
    return component.data;
  } catch (error) {
    console.error(error);
  }
};

const validAlias = alias =>
  /^([A-Za-z\-\_\d])+$/.test(alias) && /^([A-Za-z])+$/.test(alias.charAt(0));

const getNewComponentName = (name, types) => {
  let newComponentName;
  if (!!types && types.length) {
    if (standard_types.alias.includes(types[0])) {
      newComponentName = !!types[1] && validAlias(types[1]) ? types[1] : name;
    }
  } else {
    newComponentName = name;
  }
  return newComponentName;
};

const createDirectory = (path, name) => {
  fs.mkdirSync(`${path}/${name}`);
};

const batchCreateDirectories = (path, dirMap) => {
  dirMap.forEach(dirName => {
    createDirectory(path, dirName);
  });
};

const writeFile = (path, name, contents) => {
  fs.writeFileSync(`${path}/${name}`, contents, 'utf8');
};

const batchWriteFiles = (path, fileMap) => {
  Object.keys(fileMap).forEach(file => {
    writeFile(path, file, fileMap[file]);
  });
};

const createFileDirMap = files => {
  const fileMap = {};
  const dirMap = [];
  const flattenFiles = (path, files) => {
    Object.keys(files).forEach(name => {
      if (typeof files[name] === 'string') {
        fileMap[path ? `${path}/${name}` : name] = files[name];
      } else if (typeof files[name] === 'object') {
        dirMap.push(path ? `${path}/${name}` : name);
        flattenFiles(path ? `${path}/${name}` : name, files[name]);
      }
    });
  };
  flattenFiles(null, files);
  return { fileMap, dirMap };
};

const getInstalledDependencies = path => {
  if (fs.existsSync(`${path}/package.json`)) {
    const package = require(`${path}/package.json`);
    const dependencies = Object.keys(package.dependencies);
    return dependencies;
  }
};

const getRequiredDependencies = (installed, required) => {
  console.log(typeof required, installed);
  const needed = required.filter(dep => !installed.includes(dep));
  console.log(needed);
  return needed || [];
};

const installRequiredDependencies = (path, dependencies) => {
  if (dependencies.length > 0) {
    if (yarnInstalled) {
      spawn(`yarn add ${dependencies.join(' ')}`, { shell: true });
    } else {
      spawn(`npm install ${dependencies.join(' ')}`, { shell: true });
    }
  }
};

const templateComponentFromRepo = async (name, types) => {
  const newComponentName = getNewComponentName(name, types);
  const { files, dependencies } = await getComponentFromRepo(name);
  console.log(dependencies);
  const { fileMap, dirMap } = createFileDirMap(JSON.parse(files));
  createDirectory(cwd, newComponentName);
  const componentPath = `${cwd}/${newComponentName}`;
  batchCreateDirectories(componentPath, dirMap);
  batchWriteFiles(componentPath, fileMap);
  const installedDependencies = getInstalledDependencies(cwd);
  console.log(installedDependencies);
  const componentDependencies = JSON.parse(dependencies);
  const requiredDependencies = getRequiredDependencies(
    installedDependencies,
    componentDependencies
  );
  console.log(requiredDependencies);
  installRequiredDependencies(cwd, requiredDependencies);
};

module.exports = templateComponentFromRepo;

// getComponentFromRepo('wonton');

// const testComp = {
//   _id: '5a8f3be5319aea023e40d777',
//   gh_url: 'https://github.com/enmapi-am/api_comp_wonton',
//   name: 'wonton',
//   description: 'hello der',
//   author: 'phytertek',
//   dependencies: '["enmapi","github"]',
//   files:
//     "{\"controllers.js\":\"const Component = require('enmapi/database').Component;\\nconst { sendUserError } = require('enmapi/common/errors');\\nconst { github_api } = require('enmapi/services/').Github;\\n\\nmodule.exports = {\\n  getFindComponentByName: async (req, res) => {\\n    try {\\n      const { component_name } = req.params;\\n    const component = await Component.findOne({ name: component_name });\\n      if (!component) throw new Error('Component not found');\\n      res.json(component);\\n    } catch (error) {\\n      sendUserError(error, res);\\n    }\\n  },\\n  postSubmitComponent: async (req, res) => {\\n    try {\\n      // const { name, author, installMessage,files, }\\n      const component = await new Component(req.body).save();\\n      const new_team_repo = await github_api.orgs.addTeamRepo({\\n        id,\\n        org,\\n        repo\\n      });\\n      res.json(component);\\n    } catch (error) {\\n      sendUserError(error, res);\\n    }\\n  },\\n  getTest: async (req, res) => {\\n    try {\\n   const gh = await github_api.asApp();\\n      console.log(gh.repos.create());\\n      const gh_teams = await gh.repos.create({\\n        name: 'a_test_repo_from_robots',\\n        description: 'A test, duh',\\n        homepage: 'https://github.com',\\n        private: false\\n      });\\n      res.json(gh_teams);\\n    } catch (error) {\\n     sendUserError(error, res);\\n    }\\n  }\\n};\\n\",\"routes.js\":\"const {\\n  getFindComponentByName,\\n  postSubmitComponent,\\n  getTest\\n} = require('./controllers');\\n\\nmodule.exports = {\\n  '/component': {\\n    get: {\\n      '/find/:component_name': getFindComponentByName\\n    },\\n    post: {\\n      '/submit': postSubmitComponent\\n    }\\n  },\\n  '/': {\\n    get: {\\n      '/': getTest\\n    }\\n  }\\n};\\n\",\"schema.js\":\"const { Types } = require('enmapi/database/utils');\\n\\nmodule.exports = {\\n  Component: {\\n    Schema: {\\n      name: {\\n        type: String,\\n        required: true,\\n        unique: true\\n      },\\n      gh_url: {\\n        type: String,\\n        required: true,\\n        unique: true\\n      },\\n      description: {\\n        type: String\\n      },\\n      installMessage: {\\n        type: String\\n      },\\n      author: {\\n    type: Types.ObjectId,\\n        ref: 'User'\\n      },\\n      version: {\\n        type: String,\\n        default: '0.1.0'\\n }\\n    }\\n  }\\n};\\n\",\"utils\":{\"index.js\":\"const GitHubApi = require('github');\\n\\nconst github = new GitHubApi();\\n\\nconst status = async () => {\\n  try {\\n    github.authenticate({\\n      type: 'token',\\n      token: '43d6b08243af295960b0e650ec8f97ee4f893f4f'\\n    });\\n    const authState = await github.users.get({});\\n    console.log(authState);\\n  } catch (error) {\\n    console.log(error);\\n  }\\n};\\n\\nstatus();\\n\"},\"component_package.json\":\"{\\\"dependencies\\\":[\\\"enmapi\\\",\\\"github\\\"]}\"}",
//   __v: 0,
//   version: '0.1.0'
// };

// const { fileMap, dirMap } = createFileDirMap(JSON.parse(testComp.files));

// console.log(fileMap, dirMap);
