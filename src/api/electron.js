import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import { app } from 'electron';
import http from 'isomorphic-git/http/node/index.cjs';

const dir = "/root"

export class ElectronAPI {

  constructor() {
    //
  }

  async clone(remoteUrl, remoteToken) {
    try {
      await this.rimraf(dir);
    } catch {
      // do nothing
    }

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

    await git.clone(options);

    await git.setConfig({
      fs,
      dir,
      path: `remote.origin.url`,
      value: remoteUrl
    });

    await git.setConfig({
      fs,
      dir,
      path: `remote.origin.token`,
      value: remoteToken
    });
  }

  static async rimraf(rimrafpath) {
    // TODO: check that rimrafpath has no ".."
    const file = path.join(appPath, rimrafpath);

    try {
      const stats = await pfs.stat(file);

      if (stats.isFile()) {
        await pfs.unlink(file);
      } else if (stats.isDirectory()) {
        await pfs.rmdir(file, { recursive: true });
      }
    } catch (e) {
      // console.log(`failed to rimraf ${e}`);
    }
  }

  async readFeed() {
    return this.fetchFile("feed.xml")
  }

  async readTemplate() {
    return this.fetchFile("index.mustache")
  }
}
