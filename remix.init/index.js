const {execSync} = require('child_process');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const PackageJson = require('@npmcli/package-json');
const YAML = require('yaml');

const cleanupCypressFiles = ({fileEntries, packageManager}) =>
  fileEntries.flatMap(([filePath, content]) => {
    const newContent = content.replace(
      new RegExp('npx ts-node', 'g'),
      `${packageManager.exec} ts-node`,
    );

    return [fs.writeFile(filePath, newContent)];
  });

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
    prisma: {seed: prismaSeed, ...prisma},
    scripts: {typecheck, validate, ...scripts},
  } = packageJson.content;

  packageJson.update({
    name: APP_NAME,
    prisma: {...prisma, seed: prismaSeed},
    scripts: {...scripts, typecheck, validate},
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
  const DEPLOY_WORKFLOW_PATH = path.join(
    rootDirectory,
    '.github',
    'workflows',
    'deploy.yml',
  );
  const DOCKERFILE_PATH = path.join(rootDirectory, 'Dockerfile');
  const CYPRESS_SUPPORT_PATH = path.join(rootDirectory, 'cypress', 'support');
  const CYPRESS_COMMANDS_PATH = path.join(CYPRESS_SUPPORT_PATH, 'commands.ts');
  const CREATE_USER_COMMAND_PATH = path.join(
    CYPRESS_SUPPORT_PATH,
    'create-user.ts',
  );
  const DELETE_USER_COMMAND_PATH = path.join(
    CYPRESS_SUPPORT_PATH,
    'delete-user.ts',
  );

  const REPLACER = 'blues-stack-template';

  const DIR_NAME = path.basename(rootDirectory);
  const SUFFIX = getRandomString(2);

  const APP_NAME = (DIR_NAME + '-' + SUFFIX)
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-');

  const [
    readme,
    env,
    dockerfile,
    cypressCommands,
    createUserCommand,
    deleteUserCommand,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deployWorkflow,
    packageJson,
  ] = await Promise.all([
    fs.readFile(README_PATH, 'utf-8'),
    fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
    fs.readFile(DOCKERFILE_PATH, 'utf-8'),
    fs.readFile(CYPRESS_COMMANDS_PATH, 'utf-8'),
    fs.readFile(CREATE_USER_COMMAND_PATH, 'utf-8'),
    fs.readFile(DELETE_USER_COMMAND_PATH, 'utf-8'),
    fs.readFile(DEPLOY_WORKFLOW_PATH, 'utf-8').then(YAML.parse),
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
    ...cleanupCypressFiles({
      fileEntries: [
        [CYPRESS_COMMANDS_PATH, cypressCommands],
        [CREATE_USER_COMMAND_PATH, createUserCommand],
        [DELETE_USER_COMMAND_PATH, deleteUserCommand],
      ],
      packageManager: pm,
    }),
    packageJson.save(),
    fs.copyFile(
      path.join(rootDirectory, 'remix.init', 'gitignore'),
      path.join(rootDirectory, '.gitignore'),
    ),
    fs.copyFile(
      path.join(rootDirectory, 'remix.init', 'pull_request_template.md'),
      path.join(rootDirectory, '.github/pull_request_template.md'),
    ),
    fs.rm(path.join(rootDirectory, '.github', 'ISSUE_TEMPLATE'), {
      recursive: true,
    }),
    fs.rm(path.join(rootDirectory, '.github', 'dependabot.yml')),
    fs.rm(path.join(rootDirectory, '.github', 'PULL_REQUEST_TEMPLATE.md')),

    // Remove the stack repo's lock file, so that the generated project will generate its own.
    fs.rm(path.join(rootDirectory, 'package-lock.json'), {force: true}),
    fs.rm(path.join(rootDirectory, 'yarn.lock'), {force: true}),
  ];

  await Promise.all(fileOperationPromises);

  execSync(pm.run('format', '--loglevel warn'), {
    cwd: rootDirectory,
    stdio: 'inherit',
  });

  console.log(
    `
Setup is almost complete. Follow these steps to finish initialization:

- Start the database:
  ${pm.run('docker')}

- Run setup (this updates the database):
  ${pm.run('setup')}

- Run the first build (this generates the server you will run):
  ${pm.run('build')}

- You're now ready to rock and roll 🤘
  ${pm.run('dev')}
    `.trim(),
  );
};

module.exports = main;
