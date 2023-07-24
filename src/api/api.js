import { BrowserAPI } from './browser.js';

export class API {
  #browser;

  constructor() {
    this.#browser = new BrowserAPI();
  }

  async clone(repoURL, token) {
    // eslint-disable-next-line
    switch (__BUILD_MODE__) {
      case 'electron':
        return window.electron.clone(repoURL, token);

      default:
        return this.#browser.clone(repoURL, token);
    }
  }

  async readFeed() {
    // eslint-disable-next-line
    switch (__BUILD_MODE__) {
      case 'electron':
        return window.electron.readFeed();

      default:
        return this.#browser.readFeed();
    }
  }

  async readTemplate() {
    // eslint-disable-next-line
    switch (__BUILD_MODE__) {
      case 'electron':
        return window.electron.readTemplate();

      default:
        return this.#browser.readTemplate();
    }
  }
}
