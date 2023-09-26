export const createOverviewSlice = (set, get) => ({
  schema: {},

  isInitialized: false,

  repoURL: undefined,

  feedXML: undefined,

  template: undefined,

  initialize: async (search) => {
    const searchParams = new URLSearchParams(search);

    const repoURL = searchParams.get('~') ?? __DEFAULT_URL__;

    // check if phone
    const token = searchParams.get('-') ?? '';

    if (true) {
      // fetch from repo URL without totken
      const feedXML = await (await fetch(`${repoURL}/raw/branch/main/feed.xml`)).text();

      set({
        feedXML,
      });
    } else {
      const { API } = await import('api');

      const api = new API();

      await api.clone(repoURL, token);

      const feedXML = await api.readFeed();

      const template = await api.readTemplate();

      set({
        feedXML,
        template,
      });
    }

    set({
      repoURL,
      isInitialized: true,
    });
  },
});
