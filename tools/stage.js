import { join, dirname } from 'path';
import GitRepo from 'git-repository';
import task from './lib/task';
import fs from './lib/fs';

// TODO: Update deployment URL
const remote = {
  name: 'github',
  url: 'git@github.com:ebeecare/staging.ebeepartners.com.git',
  branch: 'gh-pages',
  cname: 'staging.ebeepartners.com',
};

/**
 * Deploy the contents of the `/build` folder to GitHub Pages.
 */
export default task(async function stage() {
  // Initialize a new Git repository inside the `/build` folder
  // if it doesn't exist yet
  const repo = await GitRepo.open('build', { init: true });
  await repo.setRemote(remote.name, remote.url);

  // Fetch the remote repository if it exists
  if ((await repo.hasRef(remote.url, remote.branch))) {
    await repo.fetch(remote.name);
    await repo.reset(`${remote.name}/${remote.branch}`, { hard: true });
    await repo.clean({ force: true });
  }

  // Build the project in RELEASE mode which
  // generates optimized and minimized bundles
  process.argv.push('release');
  await require('./build')();

  if (remote.cname) {
    const file = join(__dirname, '../build', 'CNAME');
    await fs.mkdir(dirname(file));
    await fs.writeFile(file, remote.cname);
  }

  // Push the contents of the build folder to the remote server via Git
  await repo.add('--all .');
  await repo.commit('Update ' + new Date().toISOString());
  await repo.push(remote.name, 'master:' + remote.branch);
});
