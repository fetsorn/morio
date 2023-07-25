import LightningFS from '@isomorphic-git/lightning-fs';

const fs = new LightningFS('fs');

const pfs = fs.promises;

const dir = "/root"

export class BrowserAPI {

  constructor() {
    //
  }

  async fetchFile(filepath) {
    // check if path exists in the repo
    const pathElements = dir.replace(/^\//, '').split('/').concat(filepath.split('/'));

    let root = '';

    for (let i = 0; i < pathElements.length; i += 1) {
      const pathElement = pathElements[i];

      root += '/';

      const files = await pfs.readdir(root);

      if (files.includes(pathElement)) {
        root += pathElement;
      } else {
        // console.log(
        //   `Cannot load file. Ensure there is a file called ${pathElement} in ${root}.`,
        // );
        // throw Error(
        //   `Cannot load file. Ensure there is a file called ${pathElement} in ${root}.`
        // );
        return undefined;
      }
    }

    const file = await pfs.readFile(`${dir}/${filepath}`);

    return file;
  }

  async clone(remoteUrl, remoteToken) {
    try {
      await this.rimraf(dir);
    } catch {
      // do nothing
    }

    const http = await import('isomorphic-git/http/web/index.cjs');

    const options = {
      fs,
      http,
      dir,
      url: remoteUrl,
      singleBranch: true,
    };

    if (remoteToken) {
      options.onAuth = () => ({
        username: remoteToken,
      });
    }

    const {
      clone, setConfig
    } = await import('isomorphic-git');

    await clone(options);

    await setConfig({
      fs,
      dir,
      path: `remote.origin.url`,
      value: remoteUrl
    });

    if (remoteToken) {
      await setConfig({
        fs,
        dir,
        path: `remote.origin.token`,
        value: remoteToken
      });
    }
  }

  async rimraf(rimrafpath) {
    let files;

    try {
      files = await pfs.readdir(rimrafpath);
    } catch {
      throw Error(`can't read ${rimrafpath} to rimraf it`);
    }

    for (const file of files) {
      const filepath = `${rimrafpath}/${file}`;

      const { type } = await pfs.stat(filepath);

      if (type === 'file') {
        await pfs.unlink(filepath);
      } else if (type === 'dir') {
        await this.rimraf(filepath);
      }
    }

    await pfs.rmdir(rimrafpath);
  }

  async readFeed() {
    return this.fetchFile("feed.xml")
  }

  async readTemplate() {
    return this.fetchFile("index.mustache")
  }
}
