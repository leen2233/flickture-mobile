export const linking = {
  prefixes: ['https://flickture.leen2233.me'],
  config: {
    screens: {
      MovieDetail: {
        path: '/:type/:tmdbId',
        parse: {
          tmdbId: Number,
        },
      },
    },
  },
};
