const execa = require('execa');
const { shouldUseYarn } = require('../utils');

module.exports = function installDependencies(options) {
  return {
    title: 'Installing dependencies',
    task: () => {
      const useYarn = shouldUseYarn();
      const packageManager = useYarn ? 'yarn' : 'npm';
      // TODO: we could check for min yarn/npm versions
      // See https://github.com/facebook/create-react-app/blob/0f4781e8507249ce29a9ac1409fece67c1a53c38/packages/create-react-app/createReactApp.js#L225-L254
      return execa(packageManager, ['install'], {
        cwd: options.projectDirectoryPath,
        encoding: 'utf-8',
      });
    },
  };
};
