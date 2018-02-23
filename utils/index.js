const GitHubApi = require('github');

const github = new GitHubApi();

const status = async () => {
  try {
    github.authenticate({
      type: 'token',
      token: '43d6b08243af295960b0e650ec8f97ee4f893f4f'
    });
    const authState = await github.users.get({});
    console.log(authState);
  } catch (error) {
    console.log(error);
  }
};

status();
