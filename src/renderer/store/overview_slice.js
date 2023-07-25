import { API, schemaRoot } from 'api';

export const createOverviewSlice = (set, get) => ({
  schema: {},

  isInitialized: false,

  repoURL: undefined,

  feed: undefined,

  template: undefined,

  initialize: async (search) => {
    console.log("initialize")

    const searchParams = new URLSearchParams(search);

    console.log("~", searchParams.get('~'))
    console.log("__DEFAULT_URL__", __DEFAULT_URL__)
    const repoURL = searchParams.get('~') ?? __DEFAULT_URL__;

    const token = searchParams.get('-') ?? '';

    const api = new API();

    await api.clone(repoURL, token);

    const feed = await api.readFeed();

    const template = await api.readTemplate();

    set({
      feed,
      template,
      repoURL,
      isInitialized: true,
    });
  },
});
