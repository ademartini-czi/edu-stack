const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const PackageJson = require('@npmcli/package-json');

const escapeRegExp = (string) =>
  // $& means the whole matched string
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getPackageManagerCommand = (packageManager) =>
  // Inspired by https://github.com/nrwl/nx/blob/bd9b33eaef0393d01f747ea9a2ac5d2ca1fb87c6/packages/nx/src/utils/package-manager.ts#L38-L103
  ({
    npm: () => ({
      exec: 'npx',
      lockfile: 'package-lock.json',
      run: (script, args) => `npm run ${script} ${args ? `-- ${args}` : ''}`,
    }),
    pnpm: () => {
      throw new Error('pnpm not supported');
    },
    yarn: () => ({
      exec: 'yarn',
      lockfile: 'yarn.lock',
      run: (script, args) => `yarn ${script} ${args || ''}`,
    }),
  }[packageManager]());

const getRandomString = (length) => crypto.randomBytes(length).toString('hex');

const updatePackageJson = ({APP_NAME, packageJson}) => {
  const {
    scripts: {types, validate, ...scripts},
  } = packageJson.content;

  packageJson.update({
    name: APP_NAME,
    scripts: {...scripts, types, validate},
  });
};

const main = async ({isTypeScript, packageManager, rootDirectory}) => {
  if (!isTypeScript) {
    console.warn(
      "I see you've asked for TypeScript to be removed from the project 🧐. That option is not supported, and the project will still be generated with TypeScript.",
    );
  }

  const pm = getPackageManagerCommand(packageManager);

  const README_PATH = path.join(rootDirectory, 'README.md');
  const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example');
  const ENV_PATH = path.join(rootDirectory, '.env');
  const DOCKERFILE_PATH = path.join(rootDirectory, 'Dockerfile');

  const REPLACER = 'blues-stack-template';
  const DIR_NAME = path.basename(rootDirectory);

  const APP_NAME = DIR_NAME
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-');

  const [readme, env, dockerfile, packageJson] = await Promise.all([
    fs.readFile(README_PATH, 'utf-8'),
    fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
    fs.readFile(DOCKERFILE_PATH, 'utf-8'),
    PackageJson.load(rootDirectory),
  ]);

  const newEnv = env.replace(
    /^SESSION_SECRET=.*$/m,
    `SESSION_SECRET="${getRandomString(16)}"`,
  );

  const newReadme = readme.replace(
    new RegExp(escapeRegExp(REPLACER), 'g'),
    APP_NAME,
  );

  const newDockerfile = pm.lockfile
    ? dockerfile.replace(
        new RegExp(escapeRegExp('ADD package.json'), 'g'),
        `ADD package.json ${pm.lockfile}`,
      )
    : dockerfile;

  updatePackageJson({APP_NAME, packageJson});

  const fileOperationPromises = [
    fs.writeFile(README_PATH, newReadme),
    fs.writeFile(ENV_PATH, newEnv),
    fs.writeFile(DOCKERFILE_PATH, newDockerfile),
    packageJson.save(),
    fs.copyFile(
      path.join(rootDirectory, 'remix.init', 'gitignore'),
      path.join(rootDirectory, '.gitignore'),
    ),
    // Remove the stack repo's lock file, so that the generated project will generate its own.
    fs.rm(path.join(rootDirectory, 'package-lock.json'), {force: true}),
    fs.rm(path.join(rootDirectory, 'yarn.lock'), {force: true}),
  ];

  await Promise.all(fileOperationPromises);

  console.log(
    `
Setup is almost complete. Follow these steps to finish initialization:

- Run the first build (this generates the server you will run):
  ${pm.run('build')}

- You're now ready to rock and roll 🤘
  ${pm.run('dev')}
    `.trim(),
  );
};

module.exports = main;
