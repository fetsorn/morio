export const createOverviewSlice = (set, get) => ({
  schema: {},

  isInitialized: false,

  repoURL: undefined,

  feedXML: undefined,

  template: undefined,

  postID: undefined,

  initialize: async (search) => {
    const searchParams = new URLSearchParams(search);

    const repoURL = searchParams.get('~') ?? __DEFAULT_URL__;

    // check if phone
    const token = searchParams.get('-') ?? '';

    const postID = searchParams.get('_') ?? '';

    console.log('AAA', postID);

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
      postID,
    });
  },
});
